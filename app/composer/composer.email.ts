var config = require('config');

/**
 * The composer implementation for emails.
 */
export class EmailComposer implements Composer {

  public createMessage(ideaKey:string, ideaTitle:string, isNew:boolean):string {
    var message = isNew ? config.get('messages.new') : config.get('messages.old');

    message = message.replace('{{idea_link}}', 'http://' + config.get('host') + '/idea/' + ideaKey);
    message = message.replace('{{idea_title}}', ideaTitle);

    return message;
  }
}