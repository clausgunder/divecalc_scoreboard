/* Decompiler 40ms, total 201ms, lines 211 */
package divecalc.competition;

import java.io.Serializable;

public class Series implements Serializable {
   private static final long serialVersionUID = 1L;
   public static final int SYSTEM_NONE = 0;
   public static final int PHASE_FIRST = 0;
   public static final int PHASE_FINAL = 65535;
   private Series.Type type;
   private int rulesetSpecificId;
   private Series.Gender gender;
   private Series.AgeGroup ageGroup;
   private Series.Height height;
   private int systemId;
   private int phaseId;

   public Series(Series.Type type) {
      this.setType(type);
      this.rulesetSpecificId = -1;
   }

   public Series(Series series) {
      this.type = series.type;
      this.rulesetSpecificId = series.rulesetSpecificId;
      this.gender = series.gender;
      this.ageGroup = series.ageGroup;
      this.height = series.height;
      this.systemId = series.systemId;
      this.phaseId = series.phaseId;
   }

   public int hashCode() {
      int rv = this.type.ordinal();
      if (this.gender != null) {
         rv |= this.gender.ordinal() << 2;
      }

      if (this.ageGroup != null) {
         rv |= this.ageGroup.ordinal() << 4;
      }

      if (this.height != null) {
         rv |= this.height.ordinal() << 6;
      }

      return this.rulesetSpecificId != -1 ? (rv << 4) + this.rulesetSpecificId : rv;
   }

   public boolean equals(Object other) {
      if (!(other instanceof Series)) {
         return false;
      } else {
         Series that = (Series)other;
         return this.type == that.type && this.rulesetSpecificId == that.rulesetSpecificId && this.gender == that.gender && this.ageGroup == that.ageGroup && this.height == that.height && this.systemId == that.systemId && this.phaseId == that.phaseId;
      }
   }

   public Series.Type getType() {
      return this.type;
   }

   public void setType(Series.Type type) {
      if (type == null) {
         throw new IllegalArgumentException("null type");
      } else {
         this.type = type;
      }
   }

   public boolean isSyncro() {
      return this.type == Series.Type.SYNCRO;
   }

   public boolean isTeam() {
      return this.type == Series.Type.TEAM;
   }

   public boolean isRulesetSpecific() {
      return this.rulesetSpecificId != -1;
   }

   public int getRulesetSpecificId() {
      return this.rulesetSpecificId;
   }

   public void setRulesetSpecific(boolean rulesetSpecific, int rulesetSpecificId) {
      if (!rulesetSpecific) {
         this.rulesetSpecificId = -1;
      } else {
         if (rulesetSpecificId < 0 || rulesetSpecificId > 65535) {
            throw new IllegalArgumentException("invalid rulesetSpecificId");
         }

         this.rulesetSpecificId = rulesetSpecificId;
      }

   }

   public Series.Gender getGender() {
      return this.gender;
   }

   public void setGender(Series.Gender gender) {
      this.gender = gender;
   }

   public boolean isGender(Series.Gender gender) {
      return this.gender == gender;
   }

   public Series.AgeGroup getAgeGroup() {
      return this.ageGroup;
   }

   public void setAgeGroup(Series.AgeGroup ageGroup) {
      this.ageGroup = ageGroup;
   }

   public boolean isAgeGroup(Series.AgeGroup ageGroup) {
      return this.ageGroup == ageGroup;
   }

   public boolean isJunior() {
      return this.ageGroup != null && this.ageGroup.isJunior();
   }

   public boolean isSenior() {
      return this.ageGroup != null && this.ageGroup.isSenior();
   }

   public Series.Height getHeight() {
      return this.height;
   }

   public void setHeight(Series.Height height) {
      this.height = height;
   }

   public int getSystemId() {
      return this.systemId;
   }

   public void setSystemId(int systemId) {
      if (systemId >= 0 && systemId <= 65535) {
         this.systemId = systemId;
      } else {
         throw new IllegalArgumentException();
      }
   }

   public int getPhaseId() {
      return this.phaseId;
   }

   public void setPhaseId(int phaseId) {
      if (phaseId >= 0 && phaseId <= 65535) {
         this.phaseId = phaseId;
      } else {
         throw new IllegalArgumentException();
      }
   }

   public boolean isFinal() {
      return this.systemId == 0 || this.phaseId == 65535;
   }

   public static enum Height {
      ONE_METER,
      THREE_METERS,
      PLATFORM;
   }

   public static enum Gender {
      MEN,
      WOMEN,
      MIXED;
   }

   public static enum AgeGroup {
      SENIOR,
      MASTERS,
      A,
      B,
      C,
      D;

      public boolean isSenior() {
         return this == SENIOR;
      }

      public boolean isJunior() {
         switch(this) {
         case A:
         case B:
         case C:
         case D:
            return true;
         default:
            return false;
         }
      }
   }

   public static enum Type {
      NORMAL,
      SYNCRO,
      TEAM;
   }
}
