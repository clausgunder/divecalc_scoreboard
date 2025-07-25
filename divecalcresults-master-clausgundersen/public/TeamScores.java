/* Decompiler 6ms, total 183ms, lines 41 */
package divecalc.competition;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public interface TeamScores {
   List<TeamScores.TeamScore> getTeamScores();

   public static class TeamScore implements Serializable {
      public final Team team;
      public final Participant ptcpn;
      public final Number score;
      public final String description;

      public TeamScore(Team team, Number score, String description) {
         this.team = team;
         this.score = score;
         this.description = description;
         this.ptcpn = null;
         if (score == null) {
            throw new IllegalArgumentException("null score");
         }
      }

      public TeamScore(Participant ptcpn, Number score, String description) {
         this.team = null;
         this.score = score;
         this.description = description;
         this.ptcpn = ptcpn;
         if (score == null) {
            throw new IllegalArgumentException("null score");
         }
      }

      public String toString() {
         return this.score instanceof BigDecimal ? ((BigDecimal)this.score).toPlainString() : this.score.toString();
      }
   }
}
