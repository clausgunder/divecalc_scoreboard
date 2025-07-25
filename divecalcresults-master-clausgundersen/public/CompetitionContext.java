/* Decompiler 15ms, total 191ms, lines 151 */
package divecalc.competition;

import divecalc.competition.Ruleset.SeriesProperty;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

public interface CompetitionContext {
   Locale getLocale();

   String getCompetitionName();

   TimeZone getCompetitionTimeZone();

   TimeZone getDisplayTimeZone();

   String getString(CompetitionContext.StockString var1);

   int getMaxDives(Series var1);

   int getMaxJudges(Series var1);

   DiveNumber parseStandardDive(String var1);

   String standardDiveToString(DiveNumber var1);

   String standardDiveToText(DiveNumber var1);

   String standardSeriesToString(Series var1);

   boolean isPanelled(Event var1);

   int getJudgeCountA(Event var1);

   int getJudgeCountB(Event var1);

   Award[] getEffectiveAwards(Event var1, Dive var2);

   void recalculateDD(Event var1, Diver var2, Dive var3);

   Dive getDive(Event var1, Diver var2, int var3);

   Dive[] getDives(Event var1, Diver var2);

   Dive[] getDives(Event var1, Diver var2, int var3);

   Dive getDive(Event var1, Diver var2, int var3, int var4);

   Participant getParticipant1(Diver var1);

   Participant getParticipant2(Diver var1);

   List<Participant> getParticipants(Diver var1);

   Participant[] getParticipants(Diver var1, Dive var2, Event var3);

   List<Team> getTeams();

   List<Participant> getParticipants(Team var1);

   Team getTeam(Participant var1);

   Team getSecondaryTeam(Participant var1);

   Diver getDiver(Participant var1, Event var2);

   List<Diver> getDivers(Participant var1);

   Event getEvent(Diver var1);

   Object getSeriesProperty(Event var1, SeriesProperty var2);

   Object getPropertyValue(Event var1, int var2);

   Object getPropertyValue(Diver var1, int var2);

   Event createPhase(Event var1, int var2);

   Diver enterDiver(Event var1, Participant var2);

   Diver enterDiver(Event var1, Participant var2, Participant var3);

   void setQualified(Diver var1, boolean var2);

   void setStartList(Event var1, List<Diver> var2);

   void setStartPoints(Diver var1, Result var2);

   void setDive(Event var1, Diver var2, Dive var3, DiveNumber var4, Height var5);

   void setDive(Event var1, Diver var2, SyncroDive var3, DiveNumber var4, Height var5, DiveNumber var6, Height var7);

   List<Diver> getDivers(Event var1);

   List<Event> getEvents();

   String getEventName(Event var1);

   String getResultClass(Event var1, Diver var2);

   NameFormatter newNameFormatter();

   Diver getDiver(Event var1, Dive var2);

   Event getPhase(Event var1, int var2);

   public static enum StockString {
      SERIES_SYSTEM_ONE_PHASE,
      SERIES_SYSTEM_TWO_PHASES,
      SERIES_SYSTEM_THREE_PHASES,
      SERIES_SYSTEM_THREE_PHASES_TWO_SEMIFINALS,
      SERIES_PHASE_PRELIMINARY,
      SERIES_PHASE_SEMIFINAL,
      SERIES_PHASE_SEMIFINAL_A,
      SERIES_PHASE_SEMIFINAL_B,
      SERIES_PHASE_FINAL,
      HEIGHT_1_METER,
      HEIGHT_3_METERS,
      HEIGHT_5_METERS,
      HEIGHT_7_METERS,
      HEIGHT_10_METERS,
      PROPERTY_NUMBER_OF_LIMITED_DIVES,
      PROPERTY_NUMBER_OF_UNLIMITED_DIVES,
      PROPERTY_NUMBER_OF_QUALIFYING_DIVERS,
      PROPERTY_NUMBER_OF_DIVES,
      PROPERTY_DD_LIMIT,
      PROPERTY_MIN_AGE,
      PROPERTY_MAX_AGE,
      PROPERTY_NUMBER_OF_REQUIRED_GROUPS,
      PROPERTY_MAX_HEIGHT,
      SERIES_MEN,
      SERIES_WOMEN,
      SERIES_BOYS,
      SERIES_GIRLS,
      SERIES_ONE_METER,
      SERIES_THREE_METERS,
      SERIES_PLATFORM,
      SERIES_SPRINGBOARD,
      SERIES_SYNCRO,
      DIVER_DISQUALIFIED,
      DIVER_DID_NOT_START,
      DIVER_DID_NOT_FINISH,
      DIVER_OUTSIDE_COMPETITION,
      SERIES_MASTERS,
      HEIGHT_12_METERS,
      HEIGHT_15_METERS,
      HEIGHT_20_METERS,
      HEIGHT_27_METERS;
   }
}
