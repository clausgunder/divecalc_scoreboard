/* Decompiler 1ms, total 188ms, lines 20 */
package divecalc.competition;

public interface Diver {
   int getPosition();

   int getRank();

   Result getResult();

   Result getStartPoints();

   boolean isDisqualified();

   boolean isAborted();

   boolean isOutsideCompetition();

   boolean isCompeting();
}
