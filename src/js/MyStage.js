import * as PIXI from 'pixi.js'
import Cookies from 'js-cookie';

import AnimateComponent from './AnimateComponent';
import TWEEN, { Tween } from '@tweenjs/tween.js';


import sheepsSpriteRef from '../images/sheeps/sheepsSprites.json';
import spritesheetFull from '../images/sheeps/sheepsSprites.png';

console.log( sheepsSpriteRef);

class MyStage{
  constructor( selector , isExtension, centerPoint ){
  
  if( isExtension ){
    // console.log('extension');
    let injectContainer = document.createElement('section');
    injectContainer.setAttribute( 'id' , 'myContent');
    document.body.prepend( injectContainer );

  }

    // console.log('Selector', selector);
    // this.state = null;
    // this.app = null;
    this.sheeps = null;
    this.mySheep = null;
    this.centerPoint = null;
    this.sheepsToRender = [];
    this.container = null;
    this.canvas = null;
    this.devicePixelRatio = null;
    this.bounds = null;
    this.renderer = null;
    this.stage = null;
    this.sheet = null;
    this.loader = new PIXI.Loader();

    // this.addDots();
    // this.onResize();
    // this.startDots();

    this.initializeApp = () => {
      console.log( '::Initialize App::' );

      let promise = new Promise( (res, rej ) => {
        let status = { success: false }
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
      } );

      return promise
    }

    this.setCenterPoint = ( position ) => {
      this.centerPoint = position;
    }

    this.setSheeps = ( sheeps ) => {
      this.sheeps = sheeps;
      this.loadAvSheeps( this.sheeps )
      .then( response =>{
        console.log( 'loadAvSheeps', response ,this.sheet);
       
      } );
    }

    this.findtheAngle = ( xI,yI, xD, yD, type ) => {
      let angle = null;
      if( type == 'rad' ){
       angle = Math.atan2(yD - yI, xD - xI );
      }
      else if( type == 'deg' ){
        angle = Math.atan2(yD - yI, xD - xI) * 180 / Math.PI;
      } 
      
      // console.log( 'angle',angle );
      return angle
    }

    this.play = ( sheep ) => {
    if( !sheep ){ 
      console.error('Sheep isnt available')
      return null
    }
    console.log('Animate');
    var coords = { x: sheep.x, y: sheep.y , rotation: sheep.rotation };
    var tweenPath = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
    .to({ x: sheep.xD, y: sheep.yD, rotation: sheep.rotation+0.5 }, 6000) // Move to (300, 200) in 1 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate(function( res ) { // Called after tween.js updates 'coords'.
        // Move 'box' to the position described by 'coords' with a CSS translation.
        // console.log('res', res);
        sheep.x = coords.x ;
        sheep.y = coords.y ;
        sheep.rotation = coords.rotation;
    })
    .start(); // Start the tween immediately.
    
    }

    this.gameLoop = ( time ) =>  {

      console.log('inside gameLoop befor raf' );
      //Loop this function at 60 frames per second
      requestAnimationFrame( ( time ) => this.gameLoop( time )  );
      TWEEN.update( time );


      this.sheepsToRender.forEach( sheep => {
        this.play( sheep );
        // console.log( sheep.xI, sheep.yI );
       
      } ); 
      
      // //Render the stage to see the animation
      this.renderer.render(this.stage);
    }

    this.setupPixi = ( resources, files ) => {
      // console.log('Setup Pixi');
      if( !this.centerPoint  || !this.centerPoint.x || !this.centerPoint.y ){
        return 
      }
      var circle = new PIXI.Graphics();

      circle.beginFill( 0xFFF00 );

      circle.drawEllipse( this.centerPoint.x, this.centerPoint.y ,64,64 )
      circle.endFill();
      // var circle = new PIXI.Circle(this.centerPoint.x, this.centerPoint.y, 20);
      this.stage.addChild(circle);


      files.forEach( f => {
        const sheep = new PIXI.Sprite( resources[ f.fileName ].texture );

        let newX = f.borrego.position.xI;
        let newY = f.borrego.position.yI;
        console.log( 'Before Add', sheep );
        // sheep.x = this.renderer.width / 2;
        // sheep.y = this.renderer.height / 2;
        sheep.position.set( newX, newY );

        sheep.vx = 0;
        sheep.vy = 0;
        
        sheep.xD = this.centerPoint.x;
        sheep.yD = this.centerPoint.y;

        sheep.xI = newX;
        sheep.yI = newY;

        sheep.anchor.x = 1;
        sheep.anchor.y = 0.5;

    
        this.sheepsToRender = [...this.sheepsToRender, sheep];

        this.stage.addChild(sheep);
      } );
      console.log( this.stage );

      requestAnimationFrame((time) => this.gameLoop( time ));
    }

    this.loadAvSheeps = ( sheeps ) => {
      return new Promise( (resolve, reject)=> {
      
        // console.log( sheeps );
      //   if( !sheeps ){
      //     reject( { error: 'Sheeps Dont exist'} ); 
      //   }

      let files = [];
      sheeps.forEach( sh => {
        console.log( 'sheep' );
        console.log( sh );
        // console.log( currentSheep );
        let fileNameBase = `  shBH${sh.borregoId<=9 ?'0':''}${sh.borregoId}`
        sh['fileName'] = fileNameBase;
        files = [...files, sh ];
      } );

      console.log( files);

      console.log( this.loader );
      this.loader.add( 'images/sheeps/sheepsSprites.json').load(this.setup);


      resolve( { success: true, data: { sheeps: sheeps } } );
      } );
    }

    this.setup = () => {
      
      console.log( 'setup' );
      this.sheet = this.loader.resources[ 'images/sheeps/sheepsSprites.json' ].spritesheet;
      // console.log(this.sheet);
      this.sprite = new PIXI.Sprite(this.sheet.textures[ 'sheepsSprites.png' ]);
      // console.log(this.sprite);


    // forEach Sheep Loaded condigure it and handle the animation 

      let anySheep = new PIXI.AnimatedSprite(this.sheet.animations["shBH01"]);

      console.log(anySheep);
      // set speed, start playback and add it to the stage
      anySheep.animationSpeed = 0.11; 
      anySheep.position.set( 800 , 400 );

      anySheep.play();
      
    
      // var blackHole = this.sheet.textures['shBH07_04.png']; 

      // var circle = new PIXI.Circle(this.centerPoint.x, this.centerPoint.y, 20);
      // this.stage.addChild(blackHole);
      
      
      
      this.stage.addChild(anySheep);
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
    this.step = (timestamp) => {
      console.log('Step');
      requestAnimationFrame((time) => this.step(time));
      this.renderer.render(this.stage);
    }

    this.loadSheep = ( sheepObject ) => {
      console.log('Load new Sheep');

      // console.log(sheepObject);
      // let promise = new Promise( (res, rej )=> {
      //   let status = { success: false };
      //   let currentSheep = this.selectSheep( sheepObject.borregoId );
      //   console.log( currentSheep );
      //   try{
      //     this.loader.add( currentSheep )
      //     status.success = true;
      //     status.data = currentSheep;
      //     return res( status )
      //   }
      //   catch( error ){
      //     status['error'] = error;
      //     return rej( status )
      //   }        
      // } );

      // return promise
    }
    // load the texture we need

  }
  
}

export default MyStage; 