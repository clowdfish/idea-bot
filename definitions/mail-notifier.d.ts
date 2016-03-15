declare module 'mail-notifier/notifier' {
    function notifier(config:any):Notifier;

    interface Notifier {
        start();
        on(event:string, callback:(mail?:any , seqno?:any, attributes?:any)=>void):Notifier;
    }
}

declare module 'mail-notifier' {
    import main = require('mail-notifier/notifier');
    export = main.notifier;
}
