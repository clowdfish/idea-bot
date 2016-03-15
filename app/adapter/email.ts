import config = require('config');
import notifier = require('mail-notifier');
import mailgun = require('mailgun-js');

var Imap = {
    user: config.get('username'),
    password: config.get('password'),
    host: config.get('imap.hostname'),
    port: config.get('imap.port'),
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
};

var Mailgun = mailgun({
    apiKey: config.get('mailgun.apiKey'),
    domain: config.get('mailgun.domain')
});

/**
 *
 */
export class EmailAdapter implements IAdapter {

    static listener;

    initialize():void {

        if(!EmailAdapter.listener) {
            EmailAdapter.listener = notifier(Imap);

            EmailAdapter.listener
                .on('error', function(err) {
                    console.error(err);
                    EmailAdapter.listener.start();
                })
                .on('end', function () { // session closed
                    EmailAdapter.listener.start();
                })
                .on('mail',function(mail){
                    //console.log(mail.from[0].address, mail.subject);
                    EmailAdapter.parse(mail);
                })
                .start();
        }
    }

    /**
     * Once the users include the idea-bot into their conversation, the
     * conversation must be parsed to get information chunks out of it that can
     * be stored in the database.
     *
     * @param email
     */
    static parse(email:any) {
        // TODO implement parsing

        console.log("Email:");
        console.log(email);

        //console.log("emailParsed", email.attachments);
        // mail processing code goes here
    }

    /**
     * Once a new idea was created the bot will send a message to all parties.
     * It can also send messages pro-actively, if it is required for the user
     * experience.
     *
     * @param receivers
     * @param subject
     * @param message
     */
    static respond(receivers:string[], subject:string, message:string) {

        var sender = 'Genie <' + config.get('username') + '>';

        var data = {
            from: sender,
            to: receivers,
            subject: subject,
            html: message
        };

        Mailgun.messages().send(data, function (err, body) {
            if (err) console.error(err);
            else
                console.log("Answer was sent.");
        });
    }

    destroy():void {
        EmailAdapter.listener = null;
    }
}