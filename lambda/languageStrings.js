/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

module.exports = {
    en: {
        translation: {
            WELCOME_MSG: `Bienvenido a Estado del Subte de Buenos Aires! Cuál es tu consulta?`,
            WELCOME_REPROMPT_MSG: `Qué deseas consultar?`,
            SINGLE_LINE_STATUS_RESPONSE_MSG: `La línea {{line}} se encuentra con una alerta {{lineStatus}}.`,
            SINGLE_LINE_LISTEN_MSG: `Deseas hacer otra consulta sobre el estado del Subte?`,
            HELP_MSG: `Puedo apuntarme tu fecha de nacimiento. Dime la fecha o dime de acordarme de tu cumpleaños. Qué prefieres?`,
            GOODBYE_MSG: `Hasta la próxima!`,
            REFLECTOR_MSG: `Has invocado {{intentName}}`,
            ERROR_MSG: `Perdona, no he entendido. Puedes repetir?`,
            REQUEST_ERROR_MSG: 'Parece que hay un problema con el servicio de información, por favor intenta en unos minutos.'
        }
    },
    es: {
        translation: {
            WELCOME_MSG: `Bienvenido a Estado del Subte de Buenos Aires! Cuál es tu consulta?`,
            WELCOME_REPROMPT_MSG: `Qué deseas consultar?`,
            SINGLE_LINE_STATUS_RESPONSE_MSG: `La línea {{line}} se encuentra con una alerta {{lineStatus}}.`,
            SINGLE_LINE_LISTEN_MSG: `Deseas hacer otra consulta sobre el estado del Subte?`,
            HELP_MSG: `Puedo apuntarme tu fecha de nacimiento. Dime la fecha o dime de acordarme de tu cumpleaños. Qué prefieres?`,
            GOODBYE_MSG: `Hasta la próxima!`,
            REFLECTOR_MSG: `Has invocado {{intentName}}`,
            ERROR_MSG: `Perdona, no he entendido. Puedes repetir?`,
            REQUEST_ERROR_MSG: 'Parece que hay un problema con el servicio de información, por favor intenta en unos minutos.'
        }
    }
}