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
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');

// i18n library dependency, we use it below in a localisation interceptor
const i18n = require('i18next');

// Used to get the translations strings
const languageStrings = require('./languageStrings');

// Useful to make the HTTPS request to API Transporte
const https = require('https');

// Filled with the successful response of the API Transporte
let apiResponse;

// If the HTTPS response is not successful or there is another problem, is marked true  
let requestIsError = false;

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
        return Alexa.getIntentName(handlerInput.requestEnvelope) === 'SingleLineStatusIntent';
    },
    async handle(handlerInput) {
        const { requestEnvelope } = handlerInput;
        const line = handlerInput.requestEnvelope.request.intent.slots.line.value;
        
        let lineStatus = getSubteStatus(line, handlerInput);
        
        let speakOutput = '';
        if(requestIsError) {
            speakOutput = lineStatus;
        } else {
            speakOutput = handlerInput.t('SINGLE_LINE_STATUS_RESPONSE_MSG', { line: line, lineStatus: lineStatus });
        }
        
        const listenOutput = handlerInput.t('SINGLE_LINE_LISTEN_MSG');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(listenOutput)
            .withShouldEndSession(requestIsError) // force the skill to close the session after confirming the birthday date
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

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG', { intentName: intentName });

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
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
        const speakOutput = handlerInput.t('ERROR_MSG');

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
 * Makes the HTTPS request to put the Subte status in the global apiResponse variable
 */
function doAPICallout() {
    let clientId = '31f7bcdaff324d6a82b181afe81f6c15';
    let clientSecret = '99A456EB8E544255A7EFB465764d3bB7';

    https.get('https://apitransporte.buenosaires.gob.ar/subtes/serviceAlerts?client_id='+clientId+'&client_secret='+clientSecret+'&json=1', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        //console.log(JSON.parse(data));
        apiResponse = data;
    });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
        requestIsError = true;
    });

}
/**
 * Returns the specific status description message from the incoming Subte Line
 * @param {*} inputLine The Identifier of the Subte Line
 * @param {*} handlerInput Handler to get access to the translations strings
 */
function getSubteStatus(inputLine, handlerInput) {
    let messageStatus='';
    console.log('= inputLine: '+inputLine);
    
    // TEST PURPOSE ONLY
    //doAPICallout();
    //apiResponse = '{"header":{"gtfs_realtime_version":"2.0","incrementality":0,"timestamp":1587841510},"entity":[{"id":"Alert_LineaA","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaA","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaB","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaB","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaC","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaC","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaD","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaD","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaE","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaE","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}},{"id":"Alert_LineaH","is_deleted":false,"trip_update":null,"vehicle":null,"alert":{"active_period":[],"informed_entity":[{"agency_id":"","route_id":"LineaH","route_type":0,"trip":null,"stop_id":""}],"cause":12,"effect":6,"url":null,"header_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]},"description_text":{"translation":[{"text":"Por protocolo de prevención: circula con un servicio especial. Info www.metrovias.com.ar","language":"es"}]}}}]}';
    requestIsError = true;
    
    if(inputLine != undefined && !requestIsError) {
        console.log('== apiResponse: '+JSON.parse(apiResponse));
        
        let lineAlertId = 'Alert_Linea'+inputLine.toUpperCase();
        let parsedResponse = JSON.parse(apiResponse);
        let allLines = parsedResponse.entity;
        
        console.log('== lineAlertId: '+lineAlertId);
        console.log('== allLines: '+allLines);
    
        for (var i = 0; i < allLines.length; i++) {
          let line = allLines[i].id;
          console.log('== line: '+allLines[i].id);
              console.log('linea api desc: '+allLines[i].alert.description_text.translation[0].text);
          if(lineAlertId === line) {
            messageStatus = allLines[i].alert.description_text.translation[0].text;
            break;
          }
        }
        
        console.log('lineAlertId: '+lineAlertId);
        console.log('mensaje: '+messageStatus);
    } else {
        if(requestIsError) {
            messageStatus = handlerInput.t('REQUEST_ERROR_MSG');
        } else {
            messageStatus = handlerInput.t('ERROR_MSG');
            requestIsError = true;
        }
    }
    return messageStatus;
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
    .addRequestHandlers(
        LaunchRequestHandler,
        SingleStatusIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
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