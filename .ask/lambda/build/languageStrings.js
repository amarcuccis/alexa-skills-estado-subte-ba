/* *
 * We create a language strings object containing all of our strings.
 * The keys for each string will then be referenced in our code, e.g. handlerInput.t('WELCOME_MSG').
 * The localisation interceptor in index.js will automatically choose the strings
 * that match the request's locale.
 * */

module.exports = {
    en: {
        translation: {
            WELCOME_MSG: `Hello! Welcome to Cake walk. What is your birthday?`,
            WELCOME_REPROMPT_MSG: `I was born Nov. 6th, 2014. When were you born?`,
            WELCOME_BACK_MSG: `Welcome back. It looks like there is {{count}} day until your {{age}}th birthday.`,
            WELCOME_BACK_MSG_plural: `Welcome back. It looks like there are {{count}} days until your {{age}}th birthday.`,
            HAPPY_BIRTHDAY_MSG: `Happy {{age}}th birthday!`,
            REGISTER_BIRTHDAY_MSG: `Thanks, I'll remember that you were born {{month}} {{day}} {{year}}.`,
            HELP_MSG: `You can tell me your date of birth and I'll take note. You can also just say, "register my birthday" and I will guide you. Which one would you like to try?`,
            GOODBYE_MSG: `Goodbye!`,
            REFLECTOR_MSG: `You just triggered {{intentName}}`,
            ERROR_MSG: `Sorry, I couldn't understand what you said. Can you reformulate?`,
            ERROR_TIMEZONE_MSG: `I can't determine your timezone. Please check your device settings and make sure a timezone was selected. After that please reopen the skill and try again!`
        }
    },
    es: {
        translation: {
            WELCOME_MSG: `Bienvenido a Estado del Subte de Buenos Aires! Cuál es tu consulta?`,
            WELCOME_REPROMPT_MSG: `Qué deseas consultar?`,
            WELCOME_BACK_MSG: `Hola otra vez! Falta {{count}} día para que cumplas {{age}} año.`, 
            WELCOME_BACK_MSG_plural: `Hola otra vez! Faltan {{count}} días para que cumplas {{age}} años.`,
            HAPPY_BIRTHDAY_MSG: `Feliz Cumpleaños! Hoy cumples {{count}} año!`,
            HAPPY_BIRTHDAY_MSG_plural: `Feliz Cumpleaños! Hoy cumples {{count}} años!`,
            SINGLE_LINE_STATUS_RESPONSE_MSG: `La línea {{line}} se encuentra {{lineStatus}}.`,
            SINGLE_LINE_REPROMPT_MSG: `Deseas hacer otra consulta sobre el Subte?`,
            HELP_MSG: `Puedo apuntarme tu fecha de nacimiento. Dime la fecha o dime de acordarme de tu cumpleaños. Qué prefieres?`,
            GOODBYE_MSG: `Hasta luego!`,
            REFLECTOR_MSG: `Has invocado {{intentName}}`,
            ERROR_MSG: `Perdona, no entendido. Puedes repetir?`,
            ERROR_TIMEZONE_MSG: `No he potido determinar tu zona horaria. Verifica la configuración de tu dispositivo, y intenta otra vez.`
        }
    }
}
