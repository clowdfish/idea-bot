import MailListener = require("mail-listener");

var MailConfig = require("../config/mail.config.json");

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
                console.log("emailParsed", mail.attachments);
                // mail processing code goes here
            });
        }
    }

    destroy():void {
        EmailAdapter.listener = null;
    }
}