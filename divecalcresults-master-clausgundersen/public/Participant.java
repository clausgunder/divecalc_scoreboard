/* Decompiler 5ms, total 172ms, lines 25 */
package divecalc.competition;

public interface Participant {
   String getLastName();

   String getFirstName();

   int getBirthYear();

   Participant.Gender getGender();

   default boolean isMale() {
      return this.getGender() == Participant.Gender.MALE;
   }

   default boolean isFemale() {
      return this.getGender() == Participant.Gender.FEMALE;
   }

   public static enum Gender {
      MALE,
      FEMALE;
   }
}
