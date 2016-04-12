/**
 * Email parser for simple email data structures. Simple means, that no email
 * conversation should be included in the email body, since they are not parsed
 * in the current version.
 */
export class EmailParser implements Parser {

  public parseMessage(email:Email):any {

    var title = email.subject.replace(/([\[\(] *)?(RE|FWD?) *([-:;)\]][ :;\])-]*|$)|\]+ *$/gi, "");

    var message = {
      date : email.date,
      email : email.from[0].address,
      text : email.text
    };

    // extract all idea owners
    var owners = [];

    email.from.forEach(function (contact) {
      if (contact.address != "genie@clowdfish.com") {
        owners.push(contact.address);
      }
    });

    email.to.forEach(function (contact) {
      if (contact.address != "genie@clowdfish.com") {
        owners.push(contact.address);
      }
    });

    email.cc.forEach(function (contact) {
      if (contact.address != "genie@clowdfish.com") {
        owners.push(contact.address);
      }
    });

    return JSON.stringify({
      title: title,
      description: email.text,
      creator: email.from[0].address,
      owners: owners,
      messages: [ message ]
    });
  }
}