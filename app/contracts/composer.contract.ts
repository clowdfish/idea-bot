/**
 * The Composer interface defining the Composer features.
 */
interface Composer {

  /**
   * Create the message that is sent to the idea creator(s).
   *
   * @param ideaKey
   * @param ideaTitle
   * @param isNew
   */
  createMessage(ideaKey:string, ideaTitle:string, isNew:boolean):string;
}