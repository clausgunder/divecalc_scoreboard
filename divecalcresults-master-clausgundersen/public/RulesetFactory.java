/* Decompiler 1ms, total 191ms, lines 22 */
package divecalc.competition;

import java.util.Locale;

public interface RulesetFactory {
   String getRulesetName();

   String getRulesetDisplayName();

   String getRulesetVersion();

   String getRulesetAuthor();

   String getRulesetDescription(Locale var1);

   boolean isDeprecated();

   String[] getDeprecatedRulesets();

   Ruleset newInstance(CompetitionContext var1);
}
