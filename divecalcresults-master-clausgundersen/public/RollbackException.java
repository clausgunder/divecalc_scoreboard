/* Decompiler 4ms, total 161ms, lines 19 */
package javax.persistence;

public class RollbackException extends PersistenceException {
   public RollbackException() {
   }

   public RollbackException(String msg) {
      super(msg);
   }

   public RollbackException(String msg, Throwable cause) {
      super(msg, cause);
   }

   public RollbackException(Throwable cause) {
      super(cause);
   }
}
