import MailAdapterModule = require("./adapter/email");
var mockemail = require("./mock/email2");

export class IdeaBot {

    // TODO check configuration to load adapters
    adapters:IAdapter[] = [
        new MailAdapterModule.EmailAdapter()
    ];

    run() {
        this.adapters.forEach(function(adapter) {
            adapter.initialize();
        });
    }

    stop() {
        this.adapters.forEach(function(adapter) {
           adapter.destroy();
        });
    }

    newEmail() {
        MailAdapterModule.EmailAdapter.parse(mockemail.emailjson);
    }
}