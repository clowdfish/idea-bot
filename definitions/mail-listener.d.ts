declare module 'mail-listener/listener' {
    class Listener {
        constructor(config:any);

        start();
        on(event:string, callback:(arg?:any)=>void);
    }
}

declare module 'mail-listener' {
    import main = require('mail-listener/listener');
    export = main.Listener;
}
