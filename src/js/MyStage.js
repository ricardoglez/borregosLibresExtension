import * as PIXI from 'pixi.js'
import Cookies from 'js-cookie';

import AnimateComponent from './AnimateComponent';
import TWEEN, { Tween } from '@tweenjs/tween.js';
<<<<<<< HEAD

=======
import {DropShadowFilter} from '@pixi/filter-drop-shadow';
import {GlowFilter} from '@pixi/filter-glow';

import  moment from 'moment';
let sheepsSpriteRefExt, spritesheetFullExt, blackHoleExt;
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e

import sheepsSpriteRef from '../images/sheeps/sheepsSprites.json';
import spritesheetFull from '../images/sheeps/sheepsSprites.png';

if( chrome.hasOwnProperty('extension') ){
  blackHoleExt = chrome.extension.getURL('../images/sheeps/blackhole.png');
  sheepsSpriteRefExt = chrome.extension.getURL('../images/sheeps/sheepsSprites.json')
  spritesheetFullExt = chrome.extension.getURL('../images/sheeps/sheepsSprites.png');
}

// console.log( sheepsSpriteRef);

class MyStage{
  constructor( selector , isExtension, centerPoint, mySheep  ){
  console.log( mySheep );
  if( isExtension ){
    // console.log('extension');
    let injectContainer = document.createElement('section');
    injectContainer.setAttribute( 'id' , 'myContent');
    document.body.prepend( injectContainer );

  }

    // console.log('Selector', selector);
    // this.state = null;
    // this.app = null;
    this.sheeps         = null;
    this.mySheep        = mySheep;
    this.centerPoint    = null;
    this.sheepsToRender = [];
    this.container      = null;
    this.canvas         = null;
    this.devicePixelRatio = null;
    this.bounds         = null;
    this.renderer       = null;
    this.stage          = null;
    this.blackHole      = null;
    this.arrow          = null;
    this.sheet          = null;
    this.subtitle       = null;
    this.loader         = new PIXI.Loader();
    this.headerLabel    = null;

    // this.addDots();
    // this.onResize();
    // this.startDots();

    this.checkingFreeTime =() => {
        let now = moment();
        let currentDay =  now.format('dddd');
        let currentHour =  now.hours();
        console.log(now);
        console.log(currentDay);
        console.log(currentHour);
        if( currentDay == 'Sunday' || currentDay == 'Saturday' ){
          return true
        }
        else {
          if( currentHour >= 9 && currentHour <= 18 ){
            return false 
          }
          else {
            return true
          }
        }
    }

    this.initializeApp = () => {
      let isFreeTime = this.checkingFreeTime( );
      let promise;
      console.log( '::Initialize App::' );
      console.log( '::isFreeTime::', isFreeTime );
        promise = new Promise( (res, rej ) => {
          if( isFreeTime ){
            let status = { success: false };
            try{
              this.container = document.querySelector(selector);
              this.canvas = document.createElement('canvas');
              this.container.classList.add('pixi-container');
              // this.container.appendChild(this.canvas);
              this.devicePixelRatio = window.devicePixelRatio;
              this.bounds = [this.container.offsetWidth, this.container.offsetHeight];
              // console.log('container size', this.bounds)
              this.renderer = PIXI.autoDetectRenderer({
                width:this.bounds[0], 
                height: this.bounds[1],
                antialias: true,
                resolution: this.devicePixelRatio,
                view: this.canvas,
                transparent: true,
              });
              this.renderer.resize( this.bounds[0], this.bounds[1]);
              // console.log( this.renderer );
              this.container.appendChild( this.renderer.view );
    
              this.stage = new PIXI.Container();
    
              status.success = true;
              return  res(  status );
            }
            catch( err ){
              console.error( err);
              return  rej(  status );
            }
          }
          else {
            rej( { success: false } )
          } 
        } );
        
  
      
       
      return promise
    }

    this.setCenterPoint = ( position ) => {
      this.centerPoint = position;
    }

    this.setSheeps = ( sheeps ) => {
      this.sheeps = sheeps;
      this.loadAvSheeps( this.sheeps,this.mySheep )
      .then( response => {
        // console.log( 'loadAvSheeps', response ,this.sheet);
        this.mySheep = response.mySheep;
       
      } );
    }

    this.findtheAngle = ( xI,yI, xD, yD, type ) => {
      let angle = null;
      type = !type ? "rad" : type; 
      if( type == 'rad' ){
       angle = Math.atan2(yD - yI, xD - xI );
      }
      else if( type == 'deg' ){
        angle = Math.atan2(yD - yI, xD - xI) * 180 / Math.PI;
      }       
      // console.log( 'angle',angle );
      return angle
    }

    this.mapRange = (value, low1, high1, low2, high2) => {
      return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    this.findtheDistance = ( xI,yI, xD, yD ) => {
      var a = xI - xD;
      var b = yI - yD;

      return Math.sqrt( a*a + b*b );
       
    }

    this.play = ( sheep ) => {
    if( !sheep ){ 
      console.error('Sheep isnt available')
      return null
    }
    console.log('Animate');
    var coords = { x: sheep.x, y: sheep.y , rotation: sheep.rotation };
    var tweenPath = new TWEEN.Tween(coords)
    .to({ x: sheep.xD, y: sheep.yD }, 6000) 
    .easing(TWEEN.Easing.Quadratic.Out) 
    .onUpdate(function( res ) { 
        sheep.x = coords.x ;
        sheep.y = coords.y ;
        sheep.rotation = coords.rotation;
    })
    .start(); // Start the tween immediately.
    
    }

    this.gameLoop = ( time ) =>  {

      // console.log('inside gameLoop befor raf' );
      //Loop this function at 60 frames per second
      requestAnimationFrame( ( time ) => this.gameLoop( time )  );
      TWEEN.update( time );

      this.setRotation( );
      this.collitionSheeps( );
      this.setScale( );
      this.blackHole.rotation += 0.033;
      // //Render the stage to see the animation
      this.renderer.render(this.stage);
    }

    this.filterSheeps = ( ) => {
      return this.stage.children.filter( ch => {
        // console.log(  ch );
          if( !ch.hasOwnProperty('_text') && ch.hasOwnProperty('loop') ){
            return ch
          } 
        });
    }

    this.createDragAndDropFor = (target , ref) => {
      let newX , newY, promise;
      promise  = new Promise( (resolve, reject) => {
        target.interactive = true;
        target.on("mousedown", function(e){
          target.drag = target;
        })
        target.on("mouseup", function(e){
          target.drag = false;
          
          // console.log( target, this );
         
        })
        target.on("mousemove", function(e){
          if(target.drag){
            newX = target.drag.position.x + e.data.originalEvent.movementX;; 
            newY = target.drag.position.y + e.data.originalEvent.movementY;
            
            ref.setCenterPoint( { x: newX, y: newY }  )
            ref.reRenderSheeps( ref.sheeps , target );
            
            target.drag.position.x += e.data.originalEvent.movementX;
            target.drag.position.y += e.data.originalEvent.movementY;
          }
        })
      } ); 
      
    }

    this.setRotation = ( ) => {
      let sheepsAvailable = this.filterSheeps( ) ;
      // console.log( this.arrow )
      this.arrow.rotation = this.findtheAngle(this.arrow.x, this.arrow.y, this.centerPoint.x,this.centerPoint.y,'rad' )-1.5;
      //  console.log(  'filtered', sheepsAvailable );
       sheepsAvailable = sheepsAvailable.map( (el ) => {
        el.rotation =  this.findtheAngle( el.x, el.y , this.centerPoint.x, this.centerPoint.y, "rad" );
       });
    }
    this.setScale = ( ) => {
      let sheepsAvailable = this.filterSheeps();
      let maxWidth = document.body.clientWidth *.46 , maxHeight = document.body.clientWidth *.46 ;

      //  console.log(  'filtered', sheepsAvailable );
       sheepsAvailable = sheepsAvailable.map( (el ) => {
         let distance = this.findtheDistance( el.x, el.y , this.centerPoint.x, this.centerPoint.y, "rad" );
          el.scale.set( this.mapRange( distance , 50, maxWidth , .3, 1 ), this.mapRange( distance , 50, maxWidth, .3, 1 ) );
          // console.log( 'distance', distance);
          // console.log(this.mapRange( distance , 50, 400, 0, 1 ) );
       });
    }

    this.isColliding = ( el, elCollided ) => {
      // console.log( 'collide of this ',  el, elCollided );
      let angleOfCollission = this.findtheAngle( el.x, el.y, elCollided.x, elCollided.y, 'rad' )
      // console.log( ' Angle of collisison', angleOfCollission);
      if( angleOfCollission > 0 && angleOfCollission <= 1 ){
        // el.x = el.x-15;
        // el.y = el.y-10;
      }
      else if( angleOfCollission > 1 && angleOfCollission <= 2 ){
        // el.x = el.x+10;
        // el.y = el.y-15;
      }
      else if( angleOfCollission > 2 && angleOfCollission <= 3 ){
        // el.x = el.x+15;
        // el.y = el.y+10;
      }
      else if( angleOfCollission > 3 && angleOfCollission <= 4 ){
        // el.x = el.x-10;
        // el.y = el.y+15;
      }

    }

    this.collitionSheeps = () => {
     let sheepsAvailable = this.filterSheeps();

    //  console.log(  'filtered', sheepsAvailable );
     sheepsAvailable = sheepsAvailable.map( (el ) => {
      this.stage.children.forEach( ( compareEl ) => {
        if( 
          el.getBounds().x < compareEl.getBounds().x + compareEl.getBounds().width  && el.getBounds().left + el.getBounds().width  > compareEl.getBounds().left &&
		      el.getBounds().x < compareEl.getBounds().y + compareEl.getBounds().height && el.getBounds().y + el.getBounds().height > compareEl.getBounds().y
        ){

          el['isCollide'] = true;
          this.isColliding( el, compareEl );
        }else {
          el['isCollide'] = false;
        }
      });
      return el
     });
    //  console.log(sheepsAvailable); 

    }

    this.loadAvSheeps = ( sheeps, mySheep ) => {
      return new Promise( (resolve, reject)=> {
      
        // console.log( sheeps );
      //   if( !sheeps ){
      //     reject( { error: 'Sheeps Dont exist'} ); 
      //   }

      let files = [];
      sheeps.forEach( sh => {
        // console.log( 'sheep' );
        // console.log( sh );
        // console.log( currentSheep );
        let fileNameBase = `shBH${sh.borregoId<=9 ?'0':''}${sh.borregoId}`
        sh['fileName'] = fileNameBase;
        sh['sheepId'] = sh.id;
        sh['isCollide'] = false;
        files = [...files, sh ];
      } );

      if( mySheep ){
        // console.log( mySheep );
        let fileNameBase = `shBH${mySheep.borrego.borregoId<=9 ?'0':''}${mySheep.borrego.borregoId}`
        mySheep['fileName'] = fileNameBase;
        mySheep['sheepId'] = mySheep.borrego.borregoId;
        mySheep['isCollide'] = false;
        files = [...files, mySheep ];
      }

      // console.log( files);

      // console.log( this.loader );

      if(  !isExtension ){
        this.loader.add( 'images/sheeps/sheepsSprites.json').load(this.setup);
      }
      else {
        this.loader.add( sheepsSpriteRefExt ).load(this.setup);
      }


      resolve( { success: true, data: { sheeps: sheeps }, mySheep: mySheep } );
      } );
    }



    this.reRenderSheeps= (   ) => {
      let sheepsAvailable = this.filterSheeps();
      sheepsAvailable = sheepsAvailable.map( (el ) => {
        setTimeout(() => {
          var coords = { x: el.x, y: el.y , rotation: 0 };
          let currentSheep = this.sheeps.find( sheep => sheep.sheepId == el.sheepId ); 
          if( !currentSheep ){ return }
            var tweenPath = new TWEEN.Tween(coords)
            .to({ x: this.centerPoint.x, y: this.centerPoint.y, }, currentSheep.borrego.speed* currentSheep.borrego.exponential *currentSheep.borrego.numCurl  )
            .easing( TWEEN.Easing.Quadratic.Out ) 
            .repeat( Infinity )
            .onUpdate(function( res ) { 
                  el.x = coords.x ;
                  el.y = coords.y ;
                  currentSheep.borrego.rotation = coords.rotation;              
            })
            .start();
          },400 )
      });
    }

    this.renderSheeps = ( sheeps, mySheep ) => {
      // console.log(sheeps, mySheep);
      return new Promise( ( resolve, reject ) => {

        sheeps.forEach( sheep => {
          // console.log(sheep);
          let anySheep = new PIXI.AnimatedSprite(this.sheet.animations[sheep.fileName]);
          // console.log( this.centerPoint  );
          let centerPoint = this.centerPoint;
          let findtheAngle = this.findtheAngle;
          // console.log( anySheep );
          // set speed, start playback and add it to the stage
          anySheep.animationSpeed = sheep.borrego.speed*0.033; 
          anySheep.filters = [ new DropShadowFilter() ];
          anySheep['sheepId'] = sheep.sheepId;

          anySheep.position.set( sheep.borrego.position.xI , sheep.borrego.position.yI );
          anySheep.play();

          var coords = { x: anySheep.x, y: anySheep.y , rotation: 0 };
          
          var tweenPath = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
          .to({ x: centerPoint.x, y: centerPoint.y, rotation: anySheep.rotation }, sheep.borrego.speed* sheep.borrego.exponential *10)
          .easing( TWEEN.Easing.Quadratic.Out ) // Use an easing function to make the animation smooth.
          .repeat( Infinity )
          .onUpdate(function( res ) { 
                anySheep.x = coords.x ;
                anySheep.y = coords.y ;
                sheep.borrego.rotation = coords.rotation;              
          })
          .start();

          this.stage.addChild(anySheep);
        } );
        
        if( mySheep ){
          // console.log( mySheep);
          let anySheep = new PIXI.AnimatedSprite(this.sheet.animations[mySheep.fileName]);
          // console.log( this.centerPoint  );
          let centerPoint = this.centerPoint;
          // console.log( anySheep );
          // set speed, start playback and add it to the stage
          anySheep.animationSpeed = mySheep.borrego.speed*0.66; 
          anySheep.filters = [ new DropShadowFilter() ];
          anySheep['sheepId'] = mySheep.sheepId;

          anySheep.position.set( mySheep.borrego.position.xI , mySheep.borrego.position.yI );
          anySheep.play();

          var coords = { x: anySheep.x, y: anySheep.y , rotation: 0 };
          
          var tweenPath = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
          .to({ x: centerPoint.x, y: centerPoint.y, rotation: anySheep.rotation }, mySheep.borrego.speed* mySheep.exponential *10)
          .easing( TWEEN.Easing.Quadratic.Out ) // Use an easing function to make the animation smooth.
          .repeat( Infinity )
          .onUpdate(function( res ) { 
                anySheep.x = coords.x ;
                anySheep.y = coords.y ;
                mySheep.rotation = coords.rotation;              
          })
          .start();

          this.stage.addChild(anySheep);
        }
        resolve({ success: true } );
      } );
    }

    this.setup = () => {
      // console.log( 'Sheep Url, ',sheepsSpriteRefExt );
      // console.log( this.loader.resources );

      if( !isExtension ){
        // this.sheet = this.loader.resources[ 'images/sheeps/sheepsSprites.json' ].spritesheet;
        this.sheet = this.loader.resources[ 'images/sheeps/sheepsSprites.json' ].spritesheet;
        // console.log(this.sheet);
        this.sprite = new PIXI.Sprite( this.sheet.textures[ 'images/sheeps/sheepsSprites.png' ] );
        // console.log( 'Sheeps',this.sheeps );
        // forEach Sheep Loaded condigure it and handle the animation 
      }
      else {
        // this.sheet = this.loader.resources[ 'images/sheeps/sheepsSprites.json' ].spritesheet;
        this.sheet = this.loader.resources[ sheepsSpriteRefExt ].spritesheet;
        this.sprite = new PIXI.Sprite( this.sheet.textures[ spritesheetFullExt ] );
        // console.log( 'sheet',this.sprite );
        // forEach Sheep Loaded condigure it and handle the animation 
      }

      this.blackHole = new PIXI.Sprite( this.sheet.textures['blackhole.png'] );
      // console.log( this.blackHole );
      this.blackHole.scale.set( .76, .76 );
      this.blackHole.filter = [ new GlowFilter() ];;
      this.blackHole.position.set( this.centerPoint.x, this.centerPoint.y );
      // console.log(this.sheet.textures);
      
      this.createDragAndDropFor( this.blackHole, this );

      let headerStyles = {
        fontFamily    : 'Helvetica', 
        fontSize      : 40, 
        background    : 0x000000,
        fontWidth     : "bold",
        fill          : 0xffffff, 
        align         : 'center', 
        zIndex        : 1000 
      }

      let subtitleStyles = {
        fontFamily : 'Helvetica',
        fontSize: 20,
        fill : 0xffffff,
        align : 'center', 
        zIndex: 1000
       };

      this.headerLabel = new PIXI.Text(`Hay ${ this.sheeps.length ? this.sheeps.length : 0} borregos libres. `, headerStyles );
      this.headerLabel.position.set( this.container.offsetWidth/2 -this.headerLabel.width/2 , 50   );
      this.subtitle = new PIXI.Text(`Puedes controlar y mover el portal. `, subtitleStyles );
      this.subtitle.position.set( this.container.offsetWidth/2 - this.subtitle.width/2  , this.headerLabel.height+50 );

      this.arrow = new PIXI.Sprite( this.sheet.textures[ "down-arrow.png" ] );
      // console.log(this.arrow);
      this.arrow.position.set( this.container.offsetWidth/2, 120 );
      
      // this.arrow.tint( 0xffffff);


      this.stage.addChild( this.subtitle );
      this.stage.addChild( this.headerLabel );
      this.stage.addChild( this.blackHole );
      this.stage.addChild( this.arrow );

      this.renderSheeps( this.sheeps , this.mySheep )
      .then(  response => {
        // console.log(  response );
      });
      // var circle = new PIXI.Circle(this.centerPoint.x, this.centerPoint.y, 20);
      // this.stage.addChild(blackHole)
      requestAnimationFrame((time) => this.gameLoop( time ));
    }

    this.selectSheep = ( id ) => {
      // console.log(id);
      switch(id){
        case 0:
         return sheep0
        case 1:
          return sheep1
        case 2:
          return sheep2
        case 3:
         return sheep3
        case 4:
         return sheep4
        case 5:
          return sheep5
        case 6:
         return sheep6
        case 7:
         return sheep7
        case 8:
        return sheep8
        case 9:
        return sheep9
      }
    }
    this.onResize = () => {
      this.bounds = [this.container.offsetWidth, this.container.offsetHeight];
      this.canvas.style.width = `${this.bounds[0]}px`;
      this.canvas.style.height = `${this.bounds[1]}px`;
      this.canvas.width = this.bounds[0];
      this.canvas.height = this.bounds[1];
      // this.dots.x = (this.bounds[0] / 2) - (this.maxX / 2);
      // this.dots.y = (this.bounds[1] / 2) - ((this.spacer * this.totalDots) / 2);
      this.renderer.resize(this.canvas.width, this.canvas.height);
      this.renderer.render(this.stage);
    }
  }
  
}

export default MyStage; 