declare module 'mailgun-js/mailgun' {
    function mailgun(config:any):Mailgun;

    interface Mailgun {

        messages():any;
    }
}

declare module 'mailgun-js' {
    import main = require('mailgun-js/mailgun');
    export = main.mailgun;
}
