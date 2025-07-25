/* Decompiler 4ms, total 169ms, lines 19 */
package javax.persistence;

public class PersistenceException extends RuntimeException {
   public PersistenceException() {
   }

   public PersistenceException(String msg) {
      super(msg);
   }

   public PersistenceException(String msg, Throwable cause) {
      super(msg, cause);
   }

   public PersistenceException(Throwable cause) {
      super(cause);
   }
}
