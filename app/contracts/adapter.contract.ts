interface IAdapter {

    /**
     * Initialize the adapter to be connected to the external data source.
     * This could be email accounts, Slack web sockets or any other live data
     * source.
     */
    initialize();

    /**
     * Destroy the adapter object to avoid memory leaks.
     */
    destroy();
}