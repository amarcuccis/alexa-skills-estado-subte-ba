/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

module.exports = {
    en: {
        translation: {
            WELCOME_MSG: `Welcome to Buenos Aires Subway status! What do you want to know?`,
            WELCOME_LISTEN_MSG: `What do you want to know?`,
            SINGLE_LINE_STATUS_RESPONSE_MSG: `Line: {{line}}, is currently with an alert. {{lineStatus}}`,
            SINGLE_LINE_NORMAL_STATUS_RESPONSE_MSG : 'Line: {{line}}, it\'s moving on time. Have a nice trip!',
            PLURAL_LINE_STATUS_RESPONSE_MSG : 'Lines {{lines}} are with an alert. {{linesStatus}}',
            GRAL_STATUS_PRESENTATION_MSG : 'This is the Subway status. {{allLineAlerts}}',
            GRAL_STATUS_ALL_LINES_NORMAL_MSG : 'This is the Subway general status. All lines are moving on time. Have a nice trip!',
            GRAL_STATUS_ALL_LINES_WITH_ALERT : 'All the lines have an alert. ',
            GRAL_STATUS_ONE_LINE_WITH_ALERT : 'There is only one line with an alert. ',
            GRAL_STATUS_REST_OF_LINES_NORMAL_MSG : 'The rest of the lines are moving on time. ',
            GRAL_STATUS_ONE_LINE_NORMAL : 'There is only one line moving on time. ',
            ASK_ANOTHER_INFO_MSG: `Do you want to do another Subway status question?`,
            HELP_MSG: `I can tell you the status of any line in the Buenos Aires Subway in realtime, or even all of it! If you want to know the status of an specific line, just ask: How it is Line A? Or if you want to know the status of all lines, just ask: What is the Subway general status?`,
            GOODBYE_MSG: `See you later!`,
            REFLECTOR_MSG: `You have invoked {{intentName}}`,
            ERROR_MSG: `Sorry I did not catch that, Can you repeat please?`,
            REQUEST_ERROR_MSG: 'It seems like there is a problem with information service. Please come back in a few minutes'
        }
    },
    es: {
        translation: {
            WELCOME_MSG: `Bienvenido a Estado del Subte de Buenos Aires! Qué quieres saber?`,
            WELCOME_LISTEN_MSG: `Qué deseas consultar?`,
            SINGLE_LINE_STATUS_RESPONSE_MSG: `La línea {{line}}, se encuentra con una alerta. {{lineStatus}}`,
            SINGLE_LINE_NORMAL_STATUS_RESPONSE_MSG : 'La línea {{line}}, se encuentra circulando con normalidad. Buen viaje!',
            PLURAL_LINE_STATUS_RESPONSE_MSG : 'Las líneas, {{lines}} se encuentran con una alerta. {{linesStatus}}',
            GRAL_STATUS_PRESENTATION_MSG : 'Aquí tienes el estado general del Subte. {{allLineAlerts}}',
            GRAL_STATUS_ALL_LINES_NORMAL_MSG : 'Aquí tienes el estado general del Subte. Todas las líneas se encuentran circulando con normalidad. Buen viaje!',
            GRAL_STATUS_ALL_LINES_WITH_ALERT : 'Todas las líneas se encuentran con una alerta. ',
            GRAL_STATUS_ONE_LINE_WITH_ALERT : 'Solo hay una línea con alerta. ',
            GRAL_STATUS_REST_OF_LINES_NORMAL_MSG : 'Las demás líneas circulan con normalidad.',
            GRAL_STATUS_ONE_LINE_NORMAL : 'Solo hay una línea que se encuentra circulando con normalidad. ',
            ASK_ANOTHER_INFO_MSG: `Deseas hacer otra consulta sobre el estado del Subte?`,
            HELP_MSG: `Puedo informarte el estado en tiempo real de la línea de Subte que quieras, o incluso de todas! Si quieres saber el estado de una línea específica, solo pregúntame: Cómo está la línea A? O, si quieres saber el estado de todas las líneas, pregúntame: Cuál es el estado general del Subte?`,
            GOODBYE_MSG: `Hasta la próxima!`,
            REFLECTOR_MSG: `Has invocado {{intentName}}`,
            ERROR_MSG: `Perdona, no he entendido. Puedes repetir?`,
            REQUEST_ERROR_MSG: 'Parece que hay un problema con el servicio de información, por favor intenta en unos minutos'
        }
    }
}