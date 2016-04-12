import MailAdapterModule = require("./adapter/email");

export class IdeaBot {

  // TODO check configuration to load adapters
  adapters:Adapter[] = [
    new MailAdapterModule.EmailAdapter()
  ];

  run() {
    this.adapters.forEach(function (adapter) {
      adapter.initialize();
    });
  }

  stop() {
    this.adapters.forEach(function (adapter) {
      adapter.destroy();
    });
  }
}