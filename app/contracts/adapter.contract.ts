/**
 * An Adapter can be used by the Bot to retrieve and respond to all kind of
 * messaging platforms.
 */
interface Adapter {

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

/**
 * Email data structure.
 */
interface Email {

  date: string;
  from: Contact[];
  to: Contact[];
  cc: Contact[];
  subject: string;
  text: string;
}

/**
 * Message data structure.
 */
interface Message {
  text:string;
  date:string;
  email:string;
}

/**
 * Contact data structure used in emails.
 */
interface Contact {

  name:string;

  address: string;
}