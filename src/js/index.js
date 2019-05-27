import '../styles/styles.scss';
import MyStage from './MyStage';

import utils from '../js/utils';

console.log('Content Script');

export const isExtension = chrome && chrome.hasOwnProperty('extension');

let sheeps = null;
let centerP = null;

let callbackMessage = (response) => {
  console.log(response);
  if (response && response.success) {
    centerP = response.centerPoint.data;
    sheeps = response.sheepsResponse.data;

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

  } else {
    console.error('Error!');
  }
};

if (isExtension) {
  let port = chrome.runtime.connect( {name: 'borregosLibres'});  
   

  console.log(port );
  
  port.postMessage({ contentScriptQuery: "fetchInitialData" });

  port.onMessage.addListener( msg => {
    console.log(msg);
    if(msg.dataReady){
      console.log( msg.dataReady)

      callbackMessage( msg.data )
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
            console.log('add sheep REsponse', responseAddSheep);
            let myStage = new MyStage(
              '#myContent',
              isExtension,
              responseCenterPoint.data,
              responseSheeps.data
            );
            myStage.initializeApp()
              .then(response => {
                console.log(response, sheeps);
                myStage.setCenterPoint(responseCenterPoint.data);
                myStage.setSheeps(sheeps);
              });

          });
      } else {

        let myStage = new MyStage(
          '#myContent',
          isExtension,
          responseCenterPoint.data,
          responseSheeps.data
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