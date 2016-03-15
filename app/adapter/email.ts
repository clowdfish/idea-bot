import MailListener = require("mail-listener");
import Mailgun = require('mailgun-js');

var MailConfig = require("../config/mail.config.json");
var mailgun = Mailgun({
    apiKey: MailConfig('mailgun.apiKey'),
    domain: MailConfig('mailgun.domain')
});

/**
 *
 */
export class EmailAdapter implements IAdapter {

    static listener;

    initialize():void {

        if(!EmailAdapter.listener) {
            var mailListener = new MailListener({
                username: MailConfig.username,
                password: MailConfig.password,
                host: MailConfig.imap.hostname,
                port: MailConfig.imap.port,
                secure: true, // use secure connection
                mailbox: "INBOX", // mailbox to monitor
                markSeen: true, // all fetched email willbe marked as seen and not fetched next time
                fetchUnreadOnStart: true // use it only if you want to get all unread email on lib start. Default is `false`
            });

            mailListener.start();

            mailListener.on("server:connected", function () {
                console.log("imapConnected");
            });

            mailListener.on("mail:arrived", function (id) {
                console.log("new mail arrived with id:" + id);
            });

            mailListener.on("mail:parsed", function (mail) {
                // do something with mail object including attachments
                this.parse(mail);
            });
        }
    }

    parse(email:any) {
        // TODO implement parsing

        console.log("emailParsed", email.attachments);
        // mail processing code goes here
    }

    respond(receivers:string[], subject:string, message:string) {

        var sender = 'Genie <' + MailConfig.username + '>';

        var data = {
            from: sender,
            to: receivers,
            subject: subject,
            html: message
        };

        mailgun.messages().send(data, function (err, body) {
            if (err) console.error(err);
            else
                console.log("Answer was sent.");
        });
    }

    destroy():void {
        EmailAdapter.listener = null;
    }
}