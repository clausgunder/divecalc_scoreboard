/* Decompiler 2ms, total 178ms, lines 14 */
package divecalc.competition;

import java.util.Date;

public interface Event {
   boolean isSyncro();

   Series getSeries();

   Date getStartDate();

   JudgeType getJudgeType(int var1);
}
