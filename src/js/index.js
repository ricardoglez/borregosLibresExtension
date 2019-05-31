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

    if (!response.fingerprintResponse.data.fpExist) {
      utils.addThisSheep(response.fingerprintResponse.data.sheepModel)
        .then(responseAddSheep => {
          console.log('add sheep REsponse', responseAddSheep.sheep);
          let myStage = new MyStage(
            '#myContent',
            isExtension,
            response.centerPoint.data,
             responseAddSheep.sheep,
          );
          myStage.initializeApp()
            .then(responseApp => {
              console.log(responseApp, responseAddSheep.sheep);
              myStage.setCenterPoint(response.centerPoint.data);
              myStage.setSheeps([...response.sheepsResponse.data, responseAddSheep.sheep]);
            });

        });

    } else {

      let myStage = new MyStage(
        '#myContent',
         isExtension,
         response.centerPoint.data,
         response.fingerprintResponse.data.mySheep 
      );

      myStage.initializeApp()
        .then(initialResponse => {
          console.log(initialResponse);
          myStage.setCenterPoint(response.centerPoint.data);
          myStage.setSheeps(response.sheepsResponse.data);
        })
        .catch(err => {
          console.error(err);
        })
    }

  } else {
    console.error('Error!');
  }
};

if (isExtension) {
  let port = chrome.runtime.connect( {name: 'borregosLibres'});  
  
  port.postMessage({ contentScriptQuery: "fetchInitialData" });

  port.onMessage.addListener( msg => {
    console.log(msg);
    if(msg.dataReady){
      console.log( msg.dataReady);
      callbackMessage( msg.data );
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