import config = require('config');
import notifier = require('mail-notifier');
import mailgun = require('mailgun-js');
import http = require('http');
import querystring = require('querystring');

import { EmailComposer } from '../composer/composer.email';
import { EmailParser } from '../parser/parser.email';

var Imap = {
  user: config.get('username'),
  password: config.get('password'),
  host: config.get('imap.hostname'),
  port: config.get('imap.port'),
  tls: true,
  tlsOptions: {rejectUnauthorized: false}
};

var Mailgun = mailgun({
  apiKey: config.get('mailgun.apiKey'),
  domain: config.get('mailgun.domain')
});

/**
 *
 */
export class EmailAdapter implements Adapter {

  static listener;

  initialize():void {

    if (!EmailAdapter.listener) {
      EmailAdapter.listener = notifier(Imap);

      EmailAdapter.listener
        .on('error', function (err) {
          console.error(err);
          EmailAdapter.listener.start();
        })
        .on('end', function () { // session closed
          EmailAdapter.listener.start();
        })
        .on('mail', function (mail) {
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
  static parse(email:Email) {

    var postBody = new EmailParser().parseMessage(email);

    var postOptions = {
      host: config.get('host'),
      port: parseInt(config.get('port')),
      json: true,
      path: '/api/ideas/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postBody.length
      }
    };

    var postReq = http.request(postOptions, function (res) {
      res.setEncoding('utf8');
      var response = '';

      res.on('data', function (chunk) {
        response += chunk;
      });

      res.on('end', function () {
        console.log("end");

        var responseObject = JSON.parse(response);

        if (responseObject.hasOwnProperty("key")) {
          var message = new EmailComposer().createMessage(responseObject.key, postBody.title, responseObject.isNew);
          EmailAdapter.respond(postBody.owners, postBody.title, message);
        }
        else 
          console.error("Something wrong with reply from API");
      });
    });

    postReq.write(postBody);
    postReq.end();
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