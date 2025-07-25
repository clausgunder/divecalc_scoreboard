/* Decompiler 1ms, total 160ms, lines 38 */
package divecalc.competition;

public interface Dive {
   int getPosition();

   DiveNumber getDive();

   Height getHeight();

   DD getDD();

   Award[] getAwards();

   Result getSum();

   Result getResult();

   Result getTotal();

   int getDiver();

   int getDiver2();

   int[] getDivers();

   boolean isTeamSyncro();

   boolean isEmpty();

   boolean isInvalid();

   boolean isDone();

   Award getMaxAward();

   Award getPenalty();
}
