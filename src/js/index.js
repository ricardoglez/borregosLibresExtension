import '../styles/styles.scss';
import MyStage from './MyStage';

import utils from '../js/utils';

console.log('Content Script');

export const isExtension = chrome && chrome.hasOwnProperty('extension');

let sheeps = null;
let centerP = null;
let port = null;

let callbackMessage = (response) => {
  console.log(response);
  if (response && response.success) {
    centerP = response.centerPoint.data;
    sheeps = response.sheepsResponse.data;

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

  } else {
    console.error('Error!');
  }
};

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
  
  port.postMessage({ contentScriptQuery: "fetchInitialData" });

  port.onMessage.addListener( msg => {
    console.log(msg);
    if( msg.type == "dataReady" && msg.success ){
      // console.log( msg );
      callbackMessage( msg.data );
    }
    if( msg.type == "mySheepReady" && msg.success ){
      console.log( msg.success);
      callbackMySheepReady( msg.data );
    }
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
            console.log('add sheep REsponse', responseAddSheep.sheep);
            let myStage = new MyStage(
              '#myContent',
              isExtension,
              responseCenterPoint.data,
               responseAddSheep.sheep,
            );
            myStage.initializeApp()
              .then(response => {
                console.log(response, responseAddSheep.sheep);
                myStage.setCenterPoint(responseCenterPoint.data);
                myStage.setSheeps([...responseSheeps.data, responseAddSheep.sheep]);
              });

          });
      } else {
        console.log( responseInitFp )

        let myStage = new MyStage(
          '#myContent',
          isExtension,
          responseCenterPoint.data,
           responseInitFp.data.mySheep
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