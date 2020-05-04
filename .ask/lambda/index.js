/**
 * @author Alex Marcucci
 * @date 04/2020
 * @version 0.1
 */

/////////////////////////////////
// Modules Definition
/////////////////////////////////

// ASK SDK
const Alexa = require('ask-sdk-core');

// ASK SDK adapter to connecto to Amazon S3
let persistenceAdapter; // = require('ask-sdk-s3-persistence-adapter');

// i18n library dependency, we use it below in a localisation interceptor
const i18n = require('i18next');

// Used to get the translations strings
const languageStrings = require('./languageStrings');

// Useful to make the HTTPS request to API Transporte
//const https = require('https');
const https = require('https');

// Filled with the successful response of the API Transporte
let apiResponse;

//MOCK 5 with alerts: 4 the same, 1 diff. 1 line normal
//let apiResponse = '{"header":{"gtfs_realtime_version":"2.0","incrementality":0,"timestamp":1587841510},"entity":[{"id":"Alert_LineaA","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaA","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaB","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaB","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"circula con servicio limitado en las estaciones Medrano y Alem.","language":"es"}]},"description_text":{"translation":[{"text":"circula con servicio limitado en las estaciones Medrano y Alem.","language":"es"}]}}},{"id":"Alert_LineaC","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaC","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaE","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaE","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaH","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaH","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}}]}';

// MOCK all normal
//let apiResponse = '{"header":{"gtfs_realtime_version":"2.0","incrementality":0,"timestamp":1587841510},"entity":[]}';

// MOCK 1 alert
//let apiResponse = '{"header":{"gtfs_realtime_version":"2.0","incrementality":0,"timestamp":1587841510},"entity":[{"id":"Alert_LineaB","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaB","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"circula con servicio limitado en las estaciones Medrano y Alem.","language":"es"}]},"description_text":{"translation":[{"text":"circula con servicio limitado en las estaciones Medrano y Alem.","language":"es"}]}}}]}';

//MOCK all 6 with alerts
//let apiResponse = '{"header":{"gtfs_realtime_version":"2.0","incrementality":0,"timestamp":1587841510},"entity":[{"id":"Alert_LineaA","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaA","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaB","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaB","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaC","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaC","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaD","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaD","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaE","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaE","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaH","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaH","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}}]}';

// If the HTTPS response is not successful or there is another problem, is marked true  
let requestIsError = false;

// True if none alert was found for the specific Subte Line
let lineAlertFound = false;

let clientId = process.env.GCBA_API_CLIENTID;
let clientSecret = process.env.GCBA_API_CLIENTSECRET;

const options = {
    "method": "GET",
    "hostname": 'apitransporte.buenosaires.gob.ar',
    "port": null,
    "path": '/subtes/serviceAlerts?client_id='+clientId+'&client_secret='+clientSecret+'&json=1',
    "headers": {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

const requestStatusCacheMaxTime = 3;

if(isAlexaHosted()) {
    const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
    persistenceAdapter = new S3PersistenceAdapter({ 
        bucketName: process.env.S3_PERSISTENCE_BUCKET,
        objectKeyGenerator: keyGenerator
    });
} else {
    // IMPORTANT: don't forget to give DynamoDB access to the role you're to run this lambda (IAM)
    const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
    persistenceAdapter = new DynamoDbPersistenceAdapter({ 
        tableName: 'global_attr_table',
        createTable: true,
        partitionKeyGenerator: keyGenerator
    });
}

// This function is an indirect way to detect if this is part of an Alexa-Hosted skill
function isAlexaHosted() {
    return process.env.S3_PERSISTENCE_BUCKET ? true : false;
}

// This function establishes the primary key of the database as the skill id (hence you get global persistence, not per user id)
function keyGenerator(requestEnvelope) {
    if (requestEnvelope
        && requestEnvelope.context
        && requestEnvelope.context.System
        && requestEnvelope.context.System.application
        && requestEnvelope.context.System.application.applicationId) {
      return requestEnvelope.context.System.application.applicationId; 
    }
    throw 'Cannot retrieve app id from request envelope!';
}

/////////////////////////////////
// Handlers Definition
/////////////////////////////////

/**
 * Handles LaunchRequest requests sent by Alexa when intent is invoked
 */
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('WELCOME_MSG');
        const repromptOutput = handlerInput.t('WELCOME_LISTEN_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

/**
 * Handles SingleStatusIntentHandler requests sent by Alexa (when a user specify a Subte Line)
 */
const SingleStatusIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest' ||
            (request.type === 'IntentRequest' && request.intent.name === 'SingleLineStatusIntent');
    },
    async handle(handlerInput) {
        let lastStatus = '';

        handlerInput.attributesManager.getPersistentAttributes()
            .then((attributes) => {
                console.log('===== sessionsAtts: '+JSON.stringify(attributes));
                console.log('===== sessionsAtts hasOwnProperty: '+attributes.hasOwnProperty('lastStatus'));
                lastStatus = attributes.hasOwnProperty('lastStatus') ? JSON.parse(attributes.lastStatus) : null;
            })
            .catch((error) => {
                console.log('===== error getting atts: '+error.message);
            })

        const slots = handlerInput.requestEnvelope.request.intent.slots;
        console.log('==== slots: '+slots);
        
        let line = slots['line'].value;
        console.log('==== line: '+line);

        if(lastStatus !== null) {
            const modifiedMinutesDifference = Date.now() - parseInt(lastStatus.lastModified) / 1000 / 60;

            console.log('===== Date now: '+Date.now());
            console.log('===== lastStatus date: '+ parseInt(lastStatus.lastModified) / 1000 / 60);
            console.log('===== sessionsAtts: '+JSON.stringify(lastStatus.status));

            if(modifiedMinutesDifference > requestStatusCacheMaxTime) {
                console.log('====== diff minutes are more than 3: '+modifiedMinutesDifference);
                    const response = await httpGet(options,handlerInput);
                    console.log('======= after httpGET: '+apiResponse);

                    if(requestIsError) {
                        apiResponse = lastStatus.status;
                    } else {
                        apiResponse = response;
                    }
            } else {
                console.log('====== diff minutes are less than 3');
                apiResponse = lastStatus.status;
            }
        } else {
            console.log('====== persistance is null: '+lastStatus);
            const response = await httpGet(options,handlerInput);
            apiResponse = response;
            console.log('======= after httpGET: '+apiResponse);
        }
        
        let lineStatus;

        if(line !== undefined && !requestIsError && apiResponse !== undefined) {
            
            let lineAlertId = 'Alert_Linea'+line.toUpperCase();
            let allLines = apiResponse.entity;
            
            console.log('===== lineAlertId: '+lineAlertId);
            console.log('===== allLines: '+allLines);
    
            for (var i = 0; i < allLines.length; i++) {
                let line = allLines[i].id;
                console.log('======= line: '+allLines[i].id);
                console.log('======== linea api desc: '+allLines[i].alert.description_text.translation[0].text);
                if(lineAlertId === line) {
                lineStatus = allLines[i].alert.description_text.translation[0].text;
                lineAlertFound = true;
                break;
                }
            }
    
            console.log('lineAlertId: '+lineAlertId);
            console.log('mensaje: '+lineStatus);
        } else {
            lineStatus = handlerInput.t('REQUEST_ERROR_MSG');
            requestIsError = true;
        }

        let speakOutput = '';
        if(requestIsError) {
            speakOutput = lineStatus; // If error, lineStatus comes as a complete Error message
        } else if(!lineAlertFound) {
            speakOutput = handlerInput.t('SINGLE_LINE_NORMAL_STATUS_RESPONSE_MSG', { line: line });
        } else {
            speakOutput = handlerInput.t('SINGLE_LINE_STATUS_RESPONSE_MSG', { line: line, lineStatus: lineStatus });
        }
        
        const listenOutput = handlerInput.t('ASK_ANOTHER_INFO_MSG');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(listenOutput)
            .withShouldEndSession(requestIsError)
            .getResponse();
    }
};

/**
 * Handles GeneralStatusIntentHandler requests sent by Alexa (when a user asks for general Subte status)
 */
const GeneralStatusIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest' ||
            (request.type === 'IntentRequest' && request.intent.name === 'GeneralStatusIntent');
    },
    async handle(handlerInput) {
        let lastStatus = '';

        handlerInput.attributesManager.getPersistentAttributes()
            .then((attributes) => {
                console.log('===== sessionsAtts: '+JSON.stringify(attributes));
                console.log('===== sessionsAtts hasOwnProperty: '+attributes.hasOwnProperty('lastStatus'));
                lastStatus = attributes.hasOwnProperty('lastStatus') ? JSON.parse(attributes.lastStatus) : null;
            })
            .catch((error) => {
                console.log('===== error getting atts: '+error.message);
            })

        if(lastStatus !== null) {
            const modifiedMinutesDifference = Date.now() - parseInt(lastStatus.lastModified) / 1000 / 60;

            console.log('===== Date now: '+Date.now());
            console.log('===== lastStatus date: '+ parseInt(lastStatus.lastModified) / 1000 / 60);
            console.log('===== sessionsAtts: '+JSON.stringify(lastStatus.status));

            if(modifiedMinutesDifference > requestStatusCacheMaxTime) {
                console.log('====== diff minutes are more than 3: '+modifiedMinutesDifference);
                    const response = await httpGet(options,handlerInput);
                    console.log('======= after httpGET: '+apiResponse);

                    if(requestIsError) {
                        apiResponse = lastStatus.status;
                    } else {
                        apiResponse = response;
                    }
            } else {
                console.log('====== diff minutes are less than 3');
                apiResponse = lastStatus.status;
            }
        } else {
            console.log('====== persistance is null: '+lastStatus);
            const response = await httpGet(options,handlerInput);
            apiResponse = response;
            console.log('======= after httpGET: '+apiResponse);
        }

        if(!requestIsError && apiResponse != undefined) {

            let allAlerts = apiResponse.entity;
            let lineAlertsByMessage = new Map();
            const subteLinesQuantity = 6;
            const alertsQuantity = allAlerts.length;
            let allLinesAlertsDesc = '';
            let allLinesHaveAlerts = alertsQuantity === subteLinesQuantity;
            let onlyOneLineWithAlert = alertsQuantity === 1;
            let onlyOneLineNormal = alertsQuantity === 5;
            
            console.log('== allAlerts: '+allAlerts);
    
            for(var i = 0; i < alertsQuantity; i++) {
                let line = allAlerts[i].id;
                let alertMessage = allAlerts[i].alert.description_text.translation[0].text;
                console.log('== line: '+line);
    
                if(!lineAlertsByMessage.has(alertMessage)) {
                    lineAlertsByMessage.set(alertMessage,[]);
                }
                let msgLinesList = lineAlertsByMessage.get(alertMessage);
                msgLinesList.push(line);
                lineAlertsByMessage.set(alertMessage,msgLinesList);
    
                console.log('=== new linea in map: ' + alertMessage + ' : ' + line);
            }
    
            if(lineAlertsByMessage.size === 0) {
                messageStatus = handlerInput.t('GRAL_STATUS_ALL_LINES_NORMAL_MSG');
    
            } else {
    
                for(let [lineAlert, lines] of lineAlertsByMessage.entries()) {
    
                    console.log('==== inside lineAlertsByMessage: '+lineAlertsByMessage);
                    console.log('==== lineAlert: '+lineAlert);
                    console.log('==== lines: '+lines);
    
                    let linesWithSameAlert = lines.length;
    
                    console.log('==== linesWithSameAlert: '+lines.length);
                    console.log('==== lines.length === 1: '+lines.length == 1);
                    console.log('==== linesWithSameAlert > 1: '+lines.length > 1);
    
                    let linesListMsg = '';
                    for(let line of lines) {
                        let lineWord = line.slice(line.length-1);
                        linesListMsg += lineWord + ', ';
                    }
    
                    if(linesWithSameAlert === 1) {
                        allLinesAlertsDesc += handlerInput.t('SINGLE_LINE_STATUS_RESPONSE_MSG', { line: linesListMsg, lineStatus: lineAlert }) + '. ';
    
                    }
                    if (linesWithSameAlert > 1) {
                        allLinesAlertsDesc += handlerInput.t('PLURAL_LINE_STATUS_RESPONSE_MSG', { lines: linesListMsg, linesStatus: lineAlert }) + '. ';
                    }
                }
    
                if(allLinesHaveAlerts) {
                    messageStatus = handlerInput.t('GRAL_STATUS_ALL_LINES_WITH_ALERT') +
                        handlerInput.t('GRAL_STATUS_PRESENTATION_MSG', { allLineAlerts: allLinesAlertsDesc });
    
                } else if(onlyOneLineNormal) {
                    messageStatus = handlerInput.t('GRAL_STATUS_PRESENTATION_MSG', { allLineAlerts: allLinesAlertsDesc }) +
                        handlerInput.t('GRAL_STATUS_REST_OF_LINES_NORMAL_MSG');
    
                } else if (onlyOneLineWithAlert) {
                    messageStatus = handlerInput.t('GRAL_STATUS_PRESENTATION_MSG', { allLineAlerts: allLinesAlertsDesc }) +
                        handlerInput.t('GRAL_STATUS_REST_OF_LINES_NORMAL_MSG');
                }
            }
            console.log('==== allLinesAlertsDesc: '+allLinesAlertsDesc);
            console.log('==== mensaje: '+messageStatus);
    
        } else {
            messageStatus = handlerInput.t('REQUEST_ERROR_MSG');
            requestIsError = true;
        }

        const listenOutput = handlerInput.t('ASK_ANOTHER_INFO_MSG');
        
        return handlerInput.responseBuilder
            .speak(messageStatus)
            .reprompt(listenOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};

/**
 * Handles AMAZON.HelpIntent requests sent by Alexa 
 */
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * Handles AMAZON.CancelIntent & AMAZON.StopIntent requests sent by Alexa 
 */
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        let speakOutput = '';
        if(error.message.includes('500')) {
            speakOutput = handlerInput.t('REQUEST_ERROR_MSG');
        } else {
            speakOutput = handlerInput.t('ERROR_MSG');
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/////////////////////////////////
// Subte Line Request Definition Helper Functions
/////////////////////////////////

/**
 * Makes the HTTPS request to get the Subte status
 * @returns JSON response with all Subte alerts if any
 */
function httpGet(options, handlerInput) {
    return new Promise(((resolve, reject) => {
      const request = https.request(options, (response) => {
        response.setEncoding('utf8');
        let returnData = '';    
        if(response.statusCode == 500) {
            requestIsError = true;
        } else if (response.statusCode < 200 || response.statusCode >= 300) {
            requestIsError = true;
            return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
        }    
        response.on('data', (chunk) => {
            returnData += chunk;
        });
        response.on('end', () => {
            console.log('==== fucking json: '+returnData);
            let status = JSON.parse(returnData);

            if(response.statusCode == 200) {
                let statusObj = {
                    'lastModified': Date.now(),
                    'status': status
                }

                const attributesManager = handlerInput.attributesManager;
                const lastStatusAttributes = {
                    'lastStatus' : JSON.stringify(statusObj)
                };
                attributesManager.setPersistentAttributes(lastStatusAttributes);
                attributesManager.savePersistentAttributes();
            }
            
            resolve(status);
        });    
        response.on('error', (error) => {
            requestIsError = true;
            
            reject(error);
        });
      });
      request.end();
    }));
}

/////////////////////////////////
// Interceptors Definition
/////////////////////////////////

/**
 * This request interceptor will log all incoming requests in the associated Logs (CloudWatch) of the AWS Lambda functions
 */
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log("\n" + "********** REQUEST *********\n" +
            JSON.stringify(handlerInput, null, 4));
    }
};

/**
 * This response interceptor will log outgoing responses if any in the associated Logs (CloudWatch) of the AWS Lambda functions
 */
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        if (response) console.log("\n" + "************* RESPONSE **************\n"
            + JSON.stringify(response, null, 4));
    }
};

/**
 * This request interceptor will bind a translation function 't' to the handlerInput
 */
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};

/////////////////////////////////
// SkillBuilder Definition
/////////////////////////////////

/**
 * The SkillBuilder acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom.
 */
exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(persistenceAdapter)
    .addRequestHandlers(
        LaunchRequestHandler,
        SingleStatusIntentHandler,
        GeneralStatusIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalisationRequestInterceptor,
        LoggingRequestInterceptor
    )
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();