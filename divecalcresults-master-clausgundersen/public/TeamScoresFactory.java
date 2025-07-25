/* Decompiler 1ms, total 183ms, lines 22 */
package divecalc.competition;

import java.util.Locale;

public interface TeamScoresFactory {
   String getRulesetName();

   String getRulesetDisplayName();

   String getRulesetVersion();

   String getRulesetAuthor();

   String getRulesetDescription(Locale var1);

   boolean isDeprecated();

   String[] getDeprecatedRulesets();

   TeamScores newInstance(CompetitionContext var1);
}
