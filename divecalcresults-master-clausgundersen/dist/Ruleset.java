/* Decompiler 23ms, total 208ms, lines 220 */
package divecalc.competition;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

public interface Ruleset {
   Collection<Series> getSeriesList();

   boolean isSeriesSupported(Series var1);

   String getSeriesName(Series var1);

   String getCompetitionSystemName(Series var1);

   String getCompetitionPhaseName(Series var1);

   int getCompetitionPhaseGroupId(Series var1);

   String getCompetitionPhaseGroupName(Series var1, int var2);

   String diveToString(Event var1, Dive var2);

   String diveToString(Event var1, SyncroDive var2);

   String diveToText(Event var1, Dive var2);

   String diveToText(Event var1, SyncroDive var2);

   DiveNumber parseDive(Event var1, String var2);

   Object getSeriesProperty(Series var1, Event var2, Ruleset.SeriesProperty var3);

   DD calculateDD(Event var1, Dive var2);

   DD[] calculateDD(Event var1, SyncroDive var2);

   Result[] calculateResult(Event var1, Dive var2);

   Award[] calculateEffectiveAwards(Event var1, Dive var2);

   String getResultClass(Event var1, Diver var2);

   Ruleset.DiverCheckResult checkDiver(Event var1, Diver var2);

   int[] getAlternativeDiveListIdentifiers(Event var1);

   String getAlternativeDiveListName(Event var1, int var2);

   int getAlternativeDiveListIdOfPhase(Series var1, int var2);

   Ruleset.DiverCheckResult checkAlternativeDiveList(Event var1, Diver var2, int var3);

   boolean checkJudges(Event var1);

   Award calculateRequiredAward(Event var1, Diver var2, Diver var3, Dive var4);

   Result analyseAwardResult(Event var1, Award var2, DD var3);

   Result analyseAwardTechResult(Event var1, Award var2, DD var3);

   Result analyseAwardSyncroResult(Event var1, Award var2, DD var3);

   Result[] calculateSyncroResults(Event var1, Dive var2);

   List<Property> getEventProperties(Event var1);

   List<Property> getDiverProperties(Event var1, Diver var2);

   Object getEventPropertyValue(Event var1, int var2);

   Object getDiverPropertyValue(Event var1, Diver var2, int var3);

   void eventPropertyValueChanged(Event var1, int var2);

   void diverPropertyValueChanged(Event var1, Diver var2, int var3);

   Event[] startNextPhase(Event var1);

   List<Ruleset.PresetDive> getPresetDives(Event var1);

   public static class PresetDive implements Serializable {
      public final int diver;
      public final int position;
      public final DiveNumber dive;
      public final Height height;
      public final DD dd;

      public PresetDive(int diver, int position, DiveNumber dive, Height height, DD dd) {
         if (diver != 0 && diver != 1) {
            throw new IllegalArgumentException("diver: " + diver);
         } else {
            this.diver = diver;
            if (position < 0) {
               throw new IllegalArgumentException("position: " + position);
            } else {
               this.position = position;
               this.dive = dive;
               this.height = height;
               this.dd = dd;
            }
         }
      }
   }

   public static class DiverCheckResult implements Serializable {
      public static final Ruleset.DiverCheckResult OK;
      public final Ruleset.DiverCheckStatus status;
      public final int diveNumber;
      public final String reason;

      public DiverCheckResult(Ruleset.DiverCheckStatus status) {
         this.status = status;
         this.diveNumber = 0;
         this.reason = null;
      }

      public DiverCheckResult(Ruleset.DiverCheckStatus status, int diveNumber, String reason) {
         this.status = status;
         if (status == null) {
            throw new IllegalArgumentException("null status");
         } else {
            this.diveNumber = diveNumber;
            if (diveNumber < 0) {
               throw new IllegalArgumentException("negative dive number");
            } else {
               this.reason = reason;
            }
         }
      }

      public boolean isOK() {
         return this.status == Ruleset.DiverCheckStatus.OK;
      }

      public boolean isError() {
         return this.status != Ruleset.DiverCheckStatus.OK;
      }

      static {
         OK = new Ruleset.DiverCheckResult(Ruleset.DiverCheckStatus.OK);
      }
   }

   public static enum DiverCheckStatus {
      OK,
      INVALID_AGE,
      INVALID_DIVELIST,
      INVALID_DIVELIST_TOO_MANY_DIVES,
      INVALID_DIVELIST_TOO_FEW_DIVES,
      INVALID_DIVELIST_SAME_DIVE,
      INVALID_DIVELIST_WRONG_HEIGHT,
      INVALID_DIVELIST_EXCEEDS_DD_LIMIT,
      INVALID_DIVELIST_TOO_FEW_GROUPS,
      INVALID_DIVELIST_TOO_FEW_LIMITED_GROUPS,
      INVALID_DIVELIST_TOO_FEW_UNLIMITED_GROUPS,
      INVALID_GENDER;

      public boolean isOK() {
         return this == OK;
      }

      public boolean isInvalidDiveList() {
         switch(this) {
         case INVALID_DIVELIST:
            return true;
         default:
            return false;
         }
      }
   }

   public static class LimitedDives implements Serializable {
      private int limited;

      public LimitedDives() {
      }

      public LimitedDives(int limitedCount) {
         for(int i = 0; i < limitedCount; ++i) {
            this.setLimited(i);
         }

      }

      public void setLimited(int dive) {
         this.limited |= 1 << dive;
      }

      public void setUnlimited(int dive) {
         this.limited &= ~(1 << dive);
      }

      public boolean isLimited(int dive) {
         return (this.limited & 1 << dive) != 0;
      }

      public boolean isUnlimited(int dive) {
         return !this.isLimited(dive);
      }
   }

   public static enum SeriesProperty {
      DEFAULT_HEIGHT,
      NUMBER_OF_DIVES,
      DIVES_PER_ROUND,
      NUMBER_OF_UNLIMITED_DIVES,
      NUMBER_OF_LIMITED_DIVES,
      DD_LIMIT,
      LIMITED_DIVES,
      NUMBER_OF_QUALIFYING_DIVERS,
      MIN_AGE,
      MAX_AGE,
      PRINT_SORT_ORDER,
      SIMPLE_RESULTS,
      PHASE_RESULT_SIGNIFICANT,
      RESULTS_LINK_ID;
   }
}
