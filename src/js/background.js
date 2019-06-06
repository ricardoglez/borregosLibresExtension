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
<<<<<<< HEAD
                console.log( 'add sheep REsponse' , responseAddSheep );
                port.postMessage({ 
                  dataReady: true, 
=======

                console.log( 'add sheep REsponse' , responseAddSheep );
                port.postMessage({ 
                  type: "dataReady",
                  success: true, 
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
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
<<<<<<< HEAD
                dataReady: true, 
=======
                type: 'dataReady',
                success: true, 
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
                data: {  
                  fingerprintResponse: responseInitFp, 
                  sheepsResponse: responseSheeps, 
                  newSheep: false, 
                  centerPoint: responseCenterPoint,
                  mySheepResponse: null,
                  success: true,
                }
<<<<<<< HEAD
            }); 

            }
          })
          // .catch( error => {
          //   console.error( error );
          // } );
          
=======
            })
            }
          })
        }

        if( message.contentScriptQuery == 'addThisSheep'){
          console.log( message );
          utils.addThisSheep( message.data.mySheep )
          .then(responseAddSheep => {
            console.log('add sheep REsponse', message.data);
              port.postMessage(  { 
                type : 'mySheepReady',
                success :true,
                data :{
                  mySheep : message.data.mySheep,
                  fingerprint: message.data.fingerprint,
                  centerPoint: message.data.centerPoint,
                  sheeps: message.data.sheeps,
                }
            });
          });
>>>>>>> b7e283482f298c5b30c7ab1b6ecba7e944921b8e
        }
      });
  } );
}





