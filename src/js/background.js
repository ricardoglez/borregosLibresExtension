import '../styles/styles.scss';
import  utils  from "../js/utils";
console.log('Background');
// console.log(chrome.runtime);

const isExtension = chrome && chrome.hasOwnProperty('extension');


console.log('isExtension',isExtension);
if( isExtension ){

  chrome.runtime.onConnect.addListener( port => {
    console.log( 'port ', port);
    console.assert(port.name == 'borregosLibres');

    port.onMessage.addListener( ( message ) => {
        console.log('Message', message );
        if (message.contentScriptQuery == "fetchInitialData") {
          // console.log('Fetching from background');
          let  chainedRequests = [
            utils.initializeFingerprint(),
            utils.fetchSheeps( ),
            utils.fetchCentralPoint()
          ];
          
          Promise.all( chainedRequests  )
          .then( ( [ responseInitFp, responseSheeps, responseCenterPoint ] )=> {
            console.log(responseInitFp, responseSheeps, responseCenterPoint ); 
            if( !responseInitFp.data.fpExist){
              utils.addThisSheep( responseInitFp.data.sheepModel )
              .then( responseAddSheep => {
                console.log( 'add sheep REsponse' , responseAddSheep );
                port.postMessage({ 
                  dataReady: true, 
                  data :{  
                  fingerprintResponse: responseInitFp, 
                  sheepsResponse: responseSheeps, 
                  newSheep: true, 
                  mySheepResponse: responseAddSheep,
                  centerPoint: responseCenterPoint,
                  success: true,
                } 
              });   
              } );
            }
            else {
              port.postMessage({ 
                dataReady: true, 
                data: {  
                  fingerprintResponse: responseInitFp, 
                  sheepsResponse: responseSheeps, 
                  newSheep: false, 
                  centerPoint: responseCenterPoint,
                  mySheepResponse: null,
                  success: true,
                }
            }); 

            }
          })
          // .catch( error => {
          //   console.error( error );
          // } );
          
        }

        if( message.contentScriptQuery == 'addThisSheep'){
          
        }
      });
  } );
}





