/**
 * The Parser interface defining the Parser features.
 */
interface Parser {

  /**
   * Parse the message and return the object that will be stored to the
   * database.
   *
   * @param message
   */
  parseMessage(message:any):any;
}