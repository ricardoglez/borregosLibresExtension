import * as PIXI from 'pixi.js'
import Cookies from 'js-cookie';

import AnimateComponent from './AnimateComponent';
import TWEEN, { Tween } from '@tweenjs/tween.js';

import sheep0 from '../images/sheeps/shBH01.png';
import sheep1 from '../images/sheeps/shBH02.png';
import sheep2 from '../images/sheeps/shBH03.png';
import sheep3 from '../images/sheeps/shBH04.png';
import sheep4 from '../images/sheeps/shBH05.png';
import sheep5 from '../images/sheeps/shBH06.png';
import sheep6 from '../images/sheeps/shBH07.png';
import sheep7 from '../images/sheeps/shBH08.png';
import sheep8 from '../images/sheeps/shBH09.png';
import sheep9 from '../images/sheeps/shBH10.png';



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
        console.log( 'loadAvSheeps', response );
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
        if( !sheeps ){
          reject( { error: 'Sheeps Dont exist'} ); 
        }

      let files = [];
      sheeps.forEach( sh => {
        // console.log( 'sheep' );
        // console.log( sh );
        this.loadSheep( sh )
        .then( responseSh => {
          console.log( responseSh );
          sh['fileName'] = responseSh.data;
          files = [...files, sh ];
        } );
      } );

      this.loader.load( (loader, resources) => {
      //     // This creates a texture from a 'sheep.png' image
         console.log(  'Loading' );
         console.log(  resources );
         this.setupPixi( resources,  files );
          
      });
      resolve( { success: true } );
      } );
    }

    this.selectSheep = ( id ) => {
210      // console.log(id);
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

      console.log(sheepObject);
      let promise = new Promise( (res, rej )=> {
        let status = { success: false };
        let currentSheep = this.selectSheep( sheepObject.borregoId );
        console.log( currentSheep );
        try{
          this.loader.add( currentSheep )
          status.success = true;
          status.data = currentSheep;
          return res( status )
        }
        catch( error ){
          status['error'] = error;
          return rej( status )
        }        
      } );

      return promise
    }
    // load the texture we need

  }

  
  

  
//   startDots() {210
//     console.log('Start Dots');
//     const now = performance.now();
//     for (let i = 0; i < this.totalDots; i++) {
//       this.dots.children[i].animateComponent.start(now);
//     }
//   }

//   addDots() {
//     console.log('Add Dots');
//     this.dotSize = 10;
//     this.totalDots = 10;
//     this.duration = 1400;
//     this.minX = 0;
//     this.maxX = 200;
//     this.spacer = (this.dotSize * 2) + 3;
//     this.delay = this.duration / this.totalDots;
//     this.dots = new PIXI.Container();
//     this.stage.addChild(this.dots);
//     for (let i = 0; i < this.totalDots; i++) {
//       let dot = new Dot(this.dotSize);
//       dot.x = 0;
//       dot.y = i * this.spacer;
//       dot.animateComponent = new AnimateComponent(dot, this.delay * i, this.duration, this.minX, this.maxX);
//       this.dots.addChild(dot);
//     }
//   }
// }
// /**
//  * 
//  */

// class Dot {
//   constructor(size) {
//     const dot = new PIXI.Graphics();
//     dot.lineStyle(0);
//     dot.beginFill(0xFF0099, 0.6);
//     dot.drawCircle(0, 0, size);
//     dot.endFill();
//     return dot;
//   }
// }


}

export default MyStage; 