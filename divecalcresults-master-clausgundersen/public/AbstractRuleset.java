/* Decompiler 160ms, total 372ms, lines 351 */
package divecalc.competition;

import divecalc.competition.CompetitionContext.StockString;
import divecalc.competition.Ruleset.DiverCheckResult;
import divecalc.competition.Ruleset.DiverCheckStatus;
import divecalc.competition.Ruleset.PresetDive;
import divecalc.competition.Ruleset.SeriesProperty;
import divecalc.competition.Series.Gender;
import divecalc.competition.fina.FINA2009;
import java.util.Calendar;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

public abstract class AbstractRuleset implements Ruleset2 {
   protected abstract CompetitionContext getCompetitionContext();

   public static Result awardToResult(Award award, DD dd) {
      if (award != null && dd != null) {
         AwardSum summer = new AwardSum();
         summer.add(award);
         return summer.toResult(true).multiply(dd);
      } else {
         return null;
      }
   }

   public static Award difference(Result r1, Result r2, DD dd) {
      if (dd != null && !dd.equals(DD.ZERO)) {
         Result rdiff = r1.substract(r2);
         int rdiffval = rdiff.getIntegralPart() * 100 + rdiff.getFractionalPart();
         int sumdiff = rdiffval / dd.getValue();
         if (rdiffval % dd.getValue() > 0) {
            ++sumdiff;
         }

         if (sumdiff > 300) {
            return null;
         } else {
            int diff = sumdiff / 3;
            if (sumdiff % 3 > 0) {
               ++diff;
            }

            int award = diff / 10;
            int fraction = diff % 10;
            if (fraction > 5) {
               ++award;
               fraction = 0;
            } else if (fraction > 0) {
               fraction = 5;
            }

            return award > 10 ? null : new Award(award, fraction);
         }
      } else {
         return null;
      }
   }

   public static boolean checkDiveHeight(Height diveHeight, divecalc.competition.Series.Height seriesHeight, Height maxHeight) {
      if (seriesHeight == null) {
         return true;
      } else {
         switch(seriesHeight) {
         case ONE_METER:
            return diveHeight == Height.HEIGHT_1;
         case THREE_METERS:
            return diveHeight == Height.HEIGHT_3;
         case PLATFORM:
            if (diveHeight == Height.HEIGHT_1) {
               return false;
            } else if (diveHeight == Height.HEIGHT_3) {
               return false;
            } else if (maxHeight != null && diveHeight.compareTo(maxHeight) > 0) {
               return false;
            }
         default:
            return true;
         }
      }
   }

   public static DiverCheckResult checkDiveList(Dive[] dives, int requiredDiveCount, AbstractRuleset.DiveValidator validator) {
      int emptyPos = -1;
      int diveCount = 0;
      Dive[] var5 = dives;
      int var6 = dives.length;

      for(int var7 = 0; var7 < var6; ++var7) {
         Dive dive = var5[var7];
         if (dive.isEmpty()) {
            emptyPos = dive.getPosition();
         } else {
            if (dive.isInvalid()) {
               return new DiverCheckResult(DiverCheckStatus.INVALID_DIVELIST, dive.getPosition() + 1, (String)null);
            }

            if (emptyPos != -1) {
               return new DiverCheckResult(DiverCheckStatus.INVALID_DIVELIST, emptyPos + 1, (String)null);
            }

            ++diveCount;
            if (validator != null) {
               DiverCheckResult result = validator.checkDive(dive);
               if (result != null) {
                  return result;
               }
            }
         }
      }

      if (requiredDiveCount > 0) {
         if (diveCount < requiredDiveCount) {
            return new DiverCheckResult(DiverCheckStatus.INVALID_DIVELIST_TOO_FEW_DIVES, 0, (String)null);
         }

         if (diveCount > requiredDiveCount) {
            return new DiverCheckResult(DiverCheckStatus.INVALID_DIVELIST_TOO_MANY_DIVES, requiredDiveCount + 1, (String)null);
         }
      }

      return validator.finish();
   }

   public String getSeriesName(Series series) {
      return this.getCompetitionContext().standardSeriesToString(series);
   }

   public String getSeriesName(Event event) {
      return this.getSeriesName(event.getSeries());
   }

   public String getCompetitionSystemName(Series series) {
      if (series.getSystemId() == 0) {
         return this.getCompetitionContext().getString(StockString.SERIES_SYSTEM_ONE_PHASE);
      } else {
         throw new UnsupportedOperationException("system " + series.getSystemId());
      }
   }

   public String getCompetitionPhaseName(Series series) {
      if (series.getSystemId() == 0) {
         return null;
      } else if (series.getPhaseId() == 0) {
         return this.getCompetitionContext().getString(StockString.SERIES_PHASE_PRELIMINARY);
      } else if (series.getPhaseId() == 65535) {
         return this.getCompetitionContext().getString(StockString.SERIES_PHASE_FINAL);
      } else {
         throw new UnsupportedOperationException("phase " + series.getPhaseId());
      }
   }

   public Award calculateRequiredAward(Event event, Diver target, Diver diver, Dive dive) {
      return difference(target.getResult(), diver.getResult(), dive.getDD());
   }

   public Result analyseAwardResult(Event event, Award award, DD dd) {
      return awardToResult(award, dd);
   }

   public Result analyseAwardTechResult(Event event, Award award, DD dd) {
      return awardToResult(award, dd);
   }

   public Result analyseAwardSyncroResult(Event event, Award award, DD dd) {
      return awardToResult(award, dd);
   }

   public String getResultClass(Event event, Diver diver) {
      return null;
   }

   public Result[] calculateSyncroResults(Event event, Dive dive) {
      return FINA2009.calculateSynchroResults(event, this.getCompetitionContext().getEffectiveAwards(event, dive), this.getCompetitionContext().getJudgeCountA(event), dive.getDD());
   }

   public List<Property> getEventProperties(Event event) {
      return Collections.emptyList();
   }

   public List<Property> getDiverProperties(Event event, Diver diver) {
      return Collections.emptyList();
   }

   public Object getEventPropertyValue(Event event, int propertyId) {
      return null;
   }

   public Object getDiverPropertyValue(Event event, Diver diver, int propertyId) {
      return null;
   }

   public void eventPropertyValueChanged(Event event, int propertyId) {
   }

   public void diverPropertyValueChanged(Event event, Diver diver, int propertyId) {
   }

   public Event[] startNextPhase(Event event) {
      return new Event[0];
   }

   public int[] getAlternativeDiveListIdentifiers(Event event) {
      return null;
   }

   public String getAlternativeDiveListName(Event event, int diveListId) {
      return null;
   }

   public int getAlternativeDiveListIdOfPhase(Series series, int phaseId) {
      return 0;
   }

   public DiverCheckResult checkAlternativeDiveList(Event event, Diver diver, int diveListId) {
      return DiverCheckResult.OK;
   }

   public List<PresetDive> getPresetDives(Event event) {
      return null;
   }

   public String diveToString(Event event, Dive dive) {
      return this.getCompetitionContext().standardDiveToString(dive.getDive());
   }

   public String diveToString(Event event, SyncroDive dive) {
      return this.getCompetitionContext().standardDiveToString(dive.getDive2());
   }

   public String diveToText(Event event, Dive dive) {
      return this.getCompetitionContext().standardDiveToText(dive.getDive());
   }

   public String diveToText(Event event, SyncroDive dive) {
      return this.getCompetitionContext().standardDiveToText(dive.getDive2());
   }

   public DiveNumber parseDive(Event event, String dive) {
      return this.getCompetitionContext().parseStandardDive(dive);
   }

   protected boolean checkMinAge(Participant p, int year, int minAge) {
      return p == null || p.getBirthYear() <= 0 || year - p.getBirthYear() >= minAge;
   }

   protected boolean checkMaxAge(Participant p, int year, int maxAge) {
      return p == null || p.getBirthYear() <= 0 || year - p.getBirthYear() <= maxAge;
   }

   protected int getEventYear(Event event) {
      Calendar c = Calendar.getInstance();
      c.setTime(event.getStartDate());
      return c.get(1);
   }

   public int getAge(Event event, Participant p) {
      return this.getEventYear(event) - p.getBirthYear();
   }

   protected boolean isAgeValid(Event event, Diver diver) {
      int year = this.getEventYear(event);
      CompetitionContext cc = this.getCompetitionContext();
      int minAge = (Integer)cc.getSeriesProperty(event, SeriesProperty.MIN_AGE);
      List<Participant> participants = cc.getParticipants(diver);
      if (minAge > 0) {
         Iterator var7 = participants.iterator();

         while(var7.hasNext()) {
            Participant ptcpn = (Participant)var7.next();
            if (!this.checkMinAge(ptcpn, year, minAge)) {
               return false;
            }
         }
      }

      int maxAge = (Integer)cc.getSeriesProperty(event, SeriesProperty.MAX_AGE);
      if (maxAge > 0) {
         Iterator var11 = participants.iterator();

         while(var11.hasNext()) {
            Participant ptcpn = (Participant)var11.next();
            if (!this.checkMaxAge(ptcpn, year, maxAge)) {
               return false;
            }
         }
      }

      return true;
   }

   protected boolean isParticipantGenderRequired(Event event) {
      return false;
   }

   protected boolean isGenderValid(Event event, Diver diver) {
      Gender eg = event.getSeries().getGender();
      divecalc.competition.Participant.Gender reqg;
      if (eg == Gender.MEN) {
         reqg = divecalc.competition.Participant.Gender.MALE;
      } else {
         if (eg != Gender.WOMEN) {
            return true;
         }

         reqg = divecalc.competition.Participant.Gender.FEMALE;
      }

      boolean enforceGender = this.isParticipantGenderRequired(event);
      Iterator var6 = this.getCompetitionContext().getParticipants(diver).iterator();

      while(var6.hasNext()) {
         Participant p = (Participant)var6.next();
         divecalc.competition.Participant.Gender pg = p.getGender();
         if (pg == null) {
            if (enforceGender) {
               return false;
            }
         } else if (pg != reqg) {
            return false;
         }
      }

      return true;
   }

   protected DiverCheckResult checkDiver(Event event, Diver diver, int requiredDiveCount, AbstractRuleset.DiveValidator validator) {
      DiverCheckResult rv = checkDiveList(this.getCompetitionContext().getDives(event, diver), requiredDiveCount, validator);
      if (rv.isOK() && !this.isAgeValid(event, diver)) {
         rv = new DiverCheckResult(DiverCheckStatus.INVALID_AGE);
      }

      if (rv.isOK() && !this.isGenderValid(event, diver)) {
         rv = new DiverCheckResult(DiverCheckStatus.INVALID_GENDER);
      }

      return rv;
   }

   protected DiverCheckResult checkAlternativeDiveList(Event event, Diver diver, int diveListId, int requiredDiveCount, AbstractRuleset.DiveValidator validator) {
      return checkDiveList(this.getCompetitionContext().getDives(event, diver, diveListId), requiredDiveCount, validator);
   }

   public interface DiveValidator {
      DiverCheckResult checkDive(Dive var1);

      DiverCheckResult finish();
   }
}
