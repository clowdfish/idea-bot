import MailAdapterModule = require("./adapter/email");

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
}