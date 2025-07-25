/* Decompiler 2ms, total 174ms, lines 12 */
package divecalc.competition;

import divecalc.competition.TeamScores.TeamScore;
import java.util.ArrayList;
import java.util.List;

public abstract class AbstractTeamScores implements TeamScores {
   public List<TeamScore> getTeamScores() {
      return new ArrayList(0);
   }
}
