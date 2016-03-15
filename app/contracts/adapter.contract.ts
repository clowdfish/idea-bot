interface IAdapter {

    /**
     * Initialize the adapter to be connected to the external data source.
     * This could be email accounts, Slack web sockets or any other live data
     * source.
     */
    initialize();

    /**
     * Once the users include the idea-bot into their conversation, the
     * conversation must be parsed to get information chunks out of it that can
     * be stored in the database.
     *
     * @param content
     */
    parse(content:any);

    /**
     * Once a new idea was created the bot will send a message to all parties.
     * It can also send messages pro-actively, if it is required for the user
     * experience.
     *
     * @param receivers
     * @param subject
     * @param message
     */
    respond(receivers:string[], subject:string, message:string);

    /**
     * Destroy the adapter object to avoid memory leaks.
     */
    destroy();
}