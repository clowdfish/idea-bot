import config = require('config');
import notifier = require('mail-notifier');
import mailgun = require('mailgun-js');
import http = require('http');
import querystring = require('querystring');

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

interface Message {
    text: string;
    date: string;
    email: string;
}

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
        // mail processing code goes here

        console.log("Email:");

        // lets do something with that email thread!
        // split into lines and clean the dashes
        var text = email.text.replace(/\n>+ */g, "\n");
        var arr = text.split(/\n{2,}/);
        //console.log(arr.length);

        var messages = [];

        //set date for first message
        var msgDate = email.date;
        var msgEmail = email.from[0].address;
        var msgText = "";

        for (var _i = 0; _i < arr.length; _i++) {
            var item = arr[_i];

            //check if meta or message
            if (item.charAt(item.length-1) == ":") {
                //means meta
                //create Message and push and clean
                messages.push({
                    date : msgDate,
                    email : msgEmail,
                    text : msgText
                });

                msgDate = "";
                msgEmail = "";
                msgText = "";

                //extract email address
                var regex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
                var res = regex.exec(item);
                //console.log(item);
                //console.log(res);
                msgEmail = res[0];
            } else {
                //means message, push to message
                msgText += (item + "\n");
            }
        }
        //dont forget to push the last message!
        messages.push({
            date : msgDate,
            email : msgEmail,
            text : msgText
        });

        messages.reverse();

        /**
         *
         * Message structure to API
         * title
         * description
         * creator
         * owners[]
         * messages[]
         *
         **/

        // title
        var regex = /([\[\(] *)?(RE|FWD?) *([-:;)\]][ :;\])-]*|$)|\]+ *$/gi;
        var title = email.subject.replace(regex,"");
        // description
        var description = messages[0].text;
        // creator
        var creator = messages[0].email;
        // all owners
        var owners = [];
        email.from.forEach(function(elem, indx) {
            if (elem.address != "genie@clowdfish.com") {
                owners.push(elem.address);
            }
        });

        email.to.forEach(function(elem, indx) {
            if (elem.address != "genie@clowdfish.com") {
                owners.push(elem.address);
            }
        });

        email.cc.forEach(function(elem, indx) {
            if (elem.address != "genie@clowdfish.com") {
                owners.push(elem.address);
            }
        });

        var body = JSON.stringify({
            title: title,
            description: description,
            creator: creator,
            owners: owners,
            messages: messages
        });

        var post_options = {
            host: 'localhost',
            port: 10010,
            json: true,
            path: '/api/ideas/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            }
        };

        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);

            });
        });

        // post the data
        post_req.write(body);
        post_req.end();

        //console.log("emailParsed", email.attachments);
    }

    /**
     * buildWelcomeMessage
     * Function constructs the message structure and sends data to the respond() function for sending
     */

    static buildWelcomeMessage() {
        //TODO: Make message text
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