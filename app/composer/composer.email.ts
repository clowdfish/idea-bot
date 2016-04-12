var config = require('config');

/**
 * The composer implementation for emails.
 */
export class EmailComposer implements Composer {

  public createMessage(ideaKey:string, ideaTitle:string, isNew:boolean):string {
    var message = isNew ? config.get('messages.new') : config.get('messages.old');

    message.replace('{{idea_link}}', config.get('host') + 'idea/' + ideaKey);
    message.replace('{{idea_title}}', ideaTitle);

    return message;
  }
}