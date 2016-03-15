declare module 'config/config' {
    function get(key:string):string;
}

declare module 'config' {
    import main = require('config/config');
    export = main;
}