import '../styles/styles.scss';
import MyStage from './MyStage';

import utils from '../js/utils';

console.log('Content Script');

export const isExtension = chrome && chrome.hasOwnProperty('extension');

let sheeps = null;
let centerP = null;
<<<<<<< HEAD
=======
let port = null;
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e

let callbackMessage = (response) => {
  console.log(response);
  if (response && response.success) {
    centerP = response.centerPoint.data;
    sheeps = response.sheepsResponse.data;

<<<<<<< HEAD
    // console.log('Successfull!');
    let myStage = new MyStage(
      '#myContent',
      isExtension,
      centerP,
      response.sheepsResponse.data
    );
    myStage.initializeApp()
      .then(responseInit => {
        console.log(responseInit, sheeps);
        myStage.setCenterPoint( centerP );
        myStage.setSheeps(sheeps);
      });
=======
    if (!response.fingerprintResponse.data.fpExist) {
      console.log('fp doesnt exist', response.fingerprintResponse, port);
      port.postMessage({ 
        contentScriptQuery: "addThisSheep", 
        data: {
          mySheep : response.fingerprintResponse.data.sheepModel,
          fingerprint: response.fingerprintResponse,
          centerPoint: centerP,
          sheeps: sheeps,
        }
       });
    }
    else {
      let myStage = new MyStage(
        '#myContent',
         isExtension,
         response.centerPoint.data,
         response.fingerprintResponse.data.mySheep
      );
      myStage.initializeApp()
        .then( initialResponse => {
          console.log( initialResponse );
          myStage.setCenterPoint(response.centerPoint.data);
          myStage.setSheeps(response.sheepsResponse.data);
        } )
        .catch(err => {
          console.error(err);
        })
    }
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e

  } else {
    console.error('Error!');
  }
};

<<<<<<< HEAD
if (isExtension) {
  let port = chrome.runtime.connect( {name: 'borregosLibres'});  
   

  console.log(port );
=======
const callbackMySheepReady = ( response )=> {
  
  console.log(response) ;
  let myStage = new MyStage(
    '#myContent',
    isExtension,
    response.centerPoint.data,
    response.mySheep,
  );
  myStage.initializeApp()
    .then(responseInitApp => {
      console.log( responseInitApp );
      console.log(response, response.mySheep);
      myStage.setCenterPoint(response.centerPoint );
      myStage.setSheeps([...response.sheeps, response.mySheep ]);
    });

}

if (isExtension) {
  port = chrome.runtime.connect( {name: 'borregosLibres'});  
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
  
  port.postMessage({ contentScriptQuery: "fetchInitialData" });

  port.onMessage.addListener( msg => {
    console.log(msg);
<<<<<<< HEAD
    if(msg.dataReady){
      console.log( msg.dataReady)

      callbackMessage( msg.data )
    }
    
=======
    if( msg.type == "dataReady" && msg.success ){
      // console.log( msg );
      callbackMessage( msg.data );
    }
    if( msg.type == "mySheepReady" && msg.success ){
      console.log( msg.success);
      callbackMySheepReady( msg.data );
    }
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
  } )
   
} 
else {
  let chainedRequests = [
    utils.initializeFingerprint(),
    utils.fetchSheeps(),
    utils.fetchCentralPoint()
  ];

  Promise.all(chainedRequests)
    .then(([responseInitFp, responseSheeps, responseCenterPoint]) => {
      console.log(responseInitFp, responseSheeps, responseCenterPoint);
      if (!responseInitFp.data.fpExist) {
        utils.addThisSheep(responseInitFp.data.sheepModel)
          .then(responseAddSheep => {
<<<<<<< HEAD
            console.log('add sheep REsponse', responseAddSheep);
=======
            console.log('add sheep REsponse', responseAddSheep.sheep);
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
            let myStage = new MyStage(
              '#myContent',
              isExtension,
              responseCenterPoint.data,
<<<<<<< HEAD
              responseSheeps.data
            );
            myStage.initializeApp()
              .then(response => {
                console.log(response, sheeps);
                myStage.setCenterPoint(responseCenterPoint.data);
                myStage.setSheeps(sheeps);
=======
               responseAddSheep.sheep,
            );
            myStage.initializeApp()
              .then(response => {
                console.log(response, responseAddSheep.sheep);
                myStage.setCenterPoint(responseCenterPoint.data);
                myStage.setSheeps([...responseSheeps.data, responseAddSheep.sheep]);
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
              });

          });
      } else {
<<<<<<< HEAD
=======
        console.log( responseInitFp )
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e

        let myStage = new MyStage(
          '#myContent',
          isExtension,
          responseCenterPoint.data,
<<<<<<< HEAD
          responseSheeps.data
=======
           responseInitFp.data.mySheep
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
        );

        myStage.initializeApp()
          .then(initialResponse => {
            console.log(initialResponse);
            myStage.setCenterPoint(responseCenterPoint.data);
            myStage.setSheeps(responseSheeps.data);
          })
          .catch(err => {
            console.error(err);
          })
      }
    });
  }