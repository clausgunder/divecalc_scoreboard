/* Decompiler 4ms, total 190ms, lines 24 */
package divecalc.competition;

public interface NameFormatter {
   void setMaxLength(int var1);

   void setTeamShortNamePreferred(boolean var1);

   String formatName(String var1, String var2);

   String getDiverName(Diver var1);

   String getDiverName(Diver var1, int var2);

   String getDiverTeamName(Diver var1);

   String getDiverTeamName(Diver var1, int var2);

   String getDiverSecondaryTeamName(Diver var1);

   String getDiverSecondaryTeamName(Diver var1, int var2);

   String getTeamName(Team var1);
}
