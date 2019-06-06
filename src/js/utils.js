import firestore from './firestore';
import Fingerprint2 from 'fingerprintjs2';
import Cookies from 'js-cookie';
const localStorage = window.localStorage;

const utils = {
  fetchSheeps: () => {
    return new Promise( (resolve, reject) => {
      let sheeps = [];
      // console.log('Fetch Sheeps');
      // console.log(firestore.collection('borregos' ));
      firestore.collection('borregos')
      .onSnapshot( (snapshot) => {
        // console.log('snapshot', snapshot);
        snapshot.forEach( doc => {
          // console.log(doc.data);
          // console.log(doc.id);
          let sheep = {  
            id: doc.id,
            borrego: doc.data().borrego,
            connected: doc.data().connected,
            borregoId: doc.data().borregoId,
            created: doc.data().created,
            fingerprint: doc.data().fingerprint,
          }
          sheeps = [...sheeps, sheep];
        } );
        let responseObj = { success: true, data:sheeps }
        resolve( responseObj );
      } );
    } );
  },
  fetchCentralPoint: () => {
    return new Promise ( (resolve,reject) => {
      firestore.collection('centerPosition')
      .onSnapshot( (snapshot) => {
        try{
          console.log('snapshot center pos');
          console.log(  snapshot);
          let position = null;
          snapshot.forEach( doc => {
            position  = doc.data();
            console.log(doc.id);
          });
          let responseObj = { success: true, data: position }
          console.log( responseObj);
          resolve( responseObj );
        }
        catch(error){
          console.error( error );
          reject( error );
        }
        
      } );
    } );
  },
  getMySheep: () => {
    let sheep = localStorage.getItem( "mySheep" );
    // console.log(sheep);
    try {
      sheep = JSON.parse( sheep );
      // console.log('Parsed',sheep);
      return sheep

    }
    catch(err){
      console.error(err);
      return null
    }
  },
  initializeFingerprint: () => {
<<<<<<< HEAD
    // console.log('Initialize Fingerprint ');
=======
    console.log('Initialize Fingerprint ');
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
    return new Promise( (resolve, reject) => {
      let fingerprintExist = !localStorage.getItem('fingerprint') ? false: true ;
      let fingerPrint = null;

      let status = { success : false, data:null }

<<<<<<< HEAD
      // console.log('fingerprintExist');
      // console.log(fingerprintExist);
=======
      console.log('fingerprintExist');
      console.log(fingerprintExist);
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
      if( fingerprintExist ){
        // console.log('User already has a sheep!');
        // let obj = { fingerprint: localStorage.getItem('fingerprint'),  }
        // this.setStaet({
        //   mySheep:
        // })
        let mySheepData = utils.getMySheep();
        // console.log(mySheepData);
        status.success = true;
        status.data = {"fingerprint": localStorage.getItem('fingerprint'), "fpExist": true, "created": localStorage.getItem("created"), mySheep: mySheepData };
        resolve(status); 
      }
      else{
        // console.log('User doesnt own a sheep so create one with fingerprint');
        Fingerprint2.getPromise( {} )
        .then( ( components ) => {
          // console.log( components );
          let values = components.map( ( component ) => {
            // console.log(component);
            return component.value
          } );


        let now = new Date();

        let salt = now;
        
        let toHash = salt+""+values.join('');

        let murmur = Fingerprint2.x64hash128( toHash, 31 );

        fingerPrint = murmur;

        utils.createOwnSheep( components , fingerPrint )
        .then( responseModel => {
<<<<<<< HEAD
=======
          console.log( responseModel );
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
          let cookieFingerprint = Cookies.get( 'fingerprint' );
          // console.log( 'CoookieFP', cookieFingerprint, fingerPrint );
          if ( cookieFingerprint == undefined ) {
            Cookies.set( 'fingerprint', fingerPrint );
            localStorage.setItem( 'fingerprint', fingerPrint );
            localStorage.setItem('created', now);
<<<<<<< HEAD
            utils.setMySheep( responseModel.data.borrego );
          } else {
            localStorage.setItem( 'fingerprint', fingerPrint );
            localStorage.setItem('created', now);
            utils.setMySheep( responseModel.data.borrego );
=======
            utils.setMySheep( responseModel.data );
          } else {
            localStorage.setItem( 'fingerprint', fingerPrint );
            localStorage.setItem('created', now);
            utils.setMySheep( responseModel.data );
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
          }
          status.success = true;
          status.data = {fingerprint: fingerPrint, "fpExist": false, "created": now, "sheepModel": responseModel.data, "fPComopnents": components} ;
          // console.log(status);
  
          resolve( status );
        } )
        .catch( error => {
          console.error( error);
        } );
      } ).catch( e => {
        console.error( e );
        reject(e);
      } );
      }  
    } )
  },
  createOwnSheep: ( components, fingerprint ) => {
    console.log('Creat Sheep');
    let sheepModel = {
      borrego:{
        borregoId       : null,
        numCurl         : null,
        height          : null,
        width           : null,
        size            : null,
        speed           : null,
        exponential     : null,
        position        : {},
      },
      borregoId: null, 
      connected       : false,
      created         : null,
<<<<<<< HEAD
=======
      isCollide       : null,
      filename        : null,
      sheeepId        : null,
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
      fingerprint     : fingerprint,
    };

    let response = { success: false , data: null };

    let promise = null;



    /**
     * Set the size of the screen 
     * @param { Number } width 
     */
    const setSizeScreen = ( width ) => {
      if( width <= 669 ){
        return 'xs'
      }
      else if( width <= 769 && width > 669 ){
        return 'sm'
      }
      else if( width <= 1024 && width > 769 ){
        return 'md'
      }
      else if( width <= 1240 && width > 1224 ){
        return 'lg'
      }
      else {
        return 'xlg'
      }
    };


    const setSheepPosition= ( nowDate ) => {

      let position = { xI:null  , yI:null };
<<<<<<< HEAD

      position.yI = utils.mapRange( nowDate.getHours() , 9 , 18 , 1 ,10 );
      position.xI = utils.randomNumber( -100 , -250  );
=======
      
      position.yI = utils.randomNumber( -200 , document.body.clientWidth +200)
      position.xI = utils.randomNumber( -200 , document.body.clientWidth +250  );
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e

      return position 
    };

    /**
     * Get Number of curls based on the screen Size
     * @param { String } size 
     */
    const setNumCurl = ( size ) => {
      switch( size ){
        case 'xs':
          return utils.randomNumber( 0,1 );
        case 'sm':
          return utils.randomNumber( 2,3 );
        case 'md':
          return utils.randomNumber( 4,5 );
        case 'lg':
          return utils.randomNumber( 6,7 );
        case 'xlg':
          return utils.randomNumber( 8,9 );
      }
    }

    promise = new Promise ( ( res, rej )  => {

      try{
        components.forEach( component => {      
          switch( component.key){
            case 'screenResolution':
              sheepModel.borrego.width =  component.value[ 1 ] ; 
              sheepModel.borrego.height =  component.value[ 0 ] ; 
              sheepModel.borrego.size = setSizeScreen( component.value[ 1 ] );
              sheepModel.borrego.numCurl = setNumCurl( sheepModel.size );
            break;
            case 'colorDepth':
              // sheepModel.opacity = this.setSize( component.value );
            break;
            case 'deviceMemory':
              // sheepModel.speed = component.value ;         
            break;
            case 'hardwareConcurrency':
              sheepModel.borrego.speed =  component.value ; 
            break;
            case 'timezoneOffset':
              sheepModel.borrego.exponential =  component.value;
            break;
            case 'fonts':
              sheepModel.borrego.numCurl = component.value.length ;         
            break;
            case 'adBlock':
              // sheepModel.fill = this.setFill( component.value );
            break;
            case 'touchSupport':
              // sheepModel.exponential = sheepModel.exponential*.2;         
            break;
            case 'audio':
            break;
          }
        } );
        
        console.log( sheepModel);

        let nowDate = new Date();
        let borregoId =  setNumCurl( sheepModel.borrego.size );

        sheepModel.created = nowDate;
        sheepModel.borrego.position = setSheepPosition( nowDate );
    
        sheepModel.borrego.borregoId = borregoId;
        sheepModel.borregoId = borregoId;


    
        response.success = true ;
        console.log( sheepModel );
        response.data = sheepModel;

        res( response );
      }
      catch( err ){
        response.data = err;
        rej( response );
      }
    });

    return  promise
  },
  randomNumber : (minHeight, maxHeight) => {
    let r = Math.floor(Math.random() * (maxHeight - minHeight +1 )) + minHeight;
    // console.log( 'r', r);
    return r
  },
  setMySheep: ( mySheep ) => {
    if( !mySheep ){
      console.err(  'MySheep Doesnt exist');
    };

    console.log( mySheep );
    let sheep = JSON.stringify( mySheep );
    console.log(sheep);
    localStorage.setItem( 'mySheep', sheep );
  },
  addThisSheep:( sheep ) => {
    console.log( 'Add this sheep', sheep );
    return new Promise ( ( resolve, reject ) => {
      const sheepToServer = { 
        borrego: sheep,
<<<<<<< HEAD

=======
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
      } 
      firestore.collection('borregos').add( sheep )
      .then( response => {
        console.log( 'Successfully Added' );
        console.log( response );
        sheep["id"] = response.id;
<<<<<<< HEAD
        resolve( { success: true , sheepId: response.id} );
=======
        resolve( { success: true , sheep: sheep} );
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
      } )
      .catch( err => {
        console.error(err);
        reject({ success: false } );
      });     
    } )
  },
  mapRange : (value, low1, high1, low2, high2)  => {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
  
}

export default utils;