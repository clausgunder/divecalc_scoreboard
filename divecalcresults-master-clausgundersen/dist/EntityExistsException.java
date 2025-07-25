/* Decompiler 4ms, total 219ms, lines 19 */
package javax.persistence;

public class EntityExistsException extends PersistenceException {
   public EntityExistsException() {
   }

   public EntityExistsException(String msg) {
      super(msg);
   }

   public EntityExistsException(String msg, Throwable cause) {
      super(msg, cause);
   }

   public EntityExistsException(Throwable cause) {
      super(cause);
   }
}
