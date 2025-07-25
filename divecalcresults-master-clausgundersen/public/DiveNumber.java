/* Decompiler 197ms, total 373ms, lines 396 */
package divecalc.competition;

import divecalc.competition.fina.FINA2024;
import java.io.Serializable;

public class DiveNumber implements Serializable {
   private static final long serialVersionUID = 1L;
   private boolean standard;
   private int direction;
   private int position;
   private int somersaults;
   private int twists;
   private boolean armstand;
   private boolean flying;

   public DiveNumber() {
      this.standard = true;
      this.direction = 1;
      this.position = 1;
   }

   public DiveNumber(DiveNumber other) {
      this.standard = other.standard;
      this.direction = other.direction;
      this.position = other.position;
      this.somersaults = other.somersaults;
      this.twists = other.twists;
      this.armstand = other.armstand;
      this.flying = other.flying;
   }

   public int hashCode() {
      return this.direction << 6 | this.position << 4 | this.somersaults << 2 | this.twists;
   }

   public boolean equals(Object other) {
      if (!(other instanceof DiveNumber)) {
         return false;
      } else {
         DiveNumber that = (DiveNumber)other;
         return this.standard == that.standard && this.direction == that.direction && this.position == that.position && this.somersaults == that.somersaults && this.twists == that.twists && this.armstand == that.armstand && this.flying == that.flying;
      }
   }

   public String toString() {
      return this.standard ? FINA2024.toString(this) : "[d=" + this.direction + ", p=" + this.position + ", s=" + this.somersaults + ", t=" + this.twists + ", a=" + this.armstand + ", f=" + this.flying + "]";
   }

   public void setStandard(DiveNumber.Direction direction, DiveNumber.Position position, int somersaults, int twists) {
      this.standard = true;
      this.direction = direction.digit;
      this.position = position.digit;
      if (somersaults >= 0 && somersaults <= 11) {
         this.somersaults = somersaults;
         this.twists = twists;
         if (twists < 0 || twists > 9) {
            throw new IllegalArgumentException("invalid twists");
         }
      } else {
         throw new IllegalArgumentException("invalid somersaults");
      }
   }

   public boolean isStandard() {
      return this.standard;
   }

   public boolean isRulesetSpecific() {
      return !this.standard;
   }

   private boolean invRSVal(int val) {
      return val < 0 || val > 255;
   }

   public void setRulesetSpecific(int v1, int v2, int v3, int v4) {
      if (!this.invRSVal(v1) && !this.invRSVal(v2) && !this.invRSVal(v3) && !this.invRSVal(v4)) {
         this.standard = false;
         this.direction = v1;
         this.position = v2;
         this.somersaults = v3;
         this.twists = v4;
      } else {
         throw new IllegalArgumentException("out of range");
      }
   }

   public boolean isArmstand() {
      return this.armstand;
   }

   public void setArmstand(boolean armstand) {
      this.armstand = armstand;
   }

   public boolean isFlying() {
      return this.flying;
   }

   public void setFlying(boolean flying) {
      this.flying = flying;
   }

   public int getRulesetSpecificData1() {
      return this.direction;
   }

   public int getRulesetSpecificData2() {
      return this.position;
   }

   public int getRulesetSpecificData3() {
      return this.somersaults;
   }

   public int getRulesetSpecificData4() {
      return this.twists;
   }

   public DiveNumber.Direction getDirection() {
      return DiveNumber.Direction.valueOf(this.direction);
   }

   public void setDirection(DiveNumber.Direction d) {
      if (this.standard) {
         this.direction = d.digit;
      } else {
         throw new IllegalStateException("dive number is not standard");
      }
   }

   public boolean isFront() {
      return this.direction == DiveNumber.Direction.FRONT.digit;
   }

   public boolean isBack() {
      return this.direction == DiveNumber.Direction.BACK.digit;
   }

   public boolean isReverse() {
      return this.direction == DiveNumber.Direction.REVERSE.digit;
   }

   public boolean isInward() {
      return this.direction == DiveNumber.Direction.INWARD.digit;
   }

   public DiveNumber.Position getPosition() {
      return DiveNumber.Position.valueOf(this.position);
   }

   public void setPosition(DiveNumber.Position p) {
      if (this.standard) {
         this.position = p.digit;
      } else {
         throw new IllegalStateException("dive number is not standard");
      }
   }

   public boolean isStraight() {
      return this.position == DiveNumber.Position.STRAIGHT.digit;
   }

   public boolean isPike() {
      return this.position == DiveNumber.Position.PIKE.digit;
   }

   public boolean isTuck() {
      return this.position == DiveNumber.Position.TUCK.digit;
   }

   public boolean isFree() {
      return this.position == DiveNumber.Position.FREE.digit;
   }

   public boolean isThreePos() {
      return this.position == DiveNumber.Position.THREE.digit;
   }

   public int getSomersaults() {
      return this.somersaults;
   }

   public void setSomersaults(int somersaults) {
      if (this.standard) {
         if (somersaults >= 0 && somersaults <= 11) {
            this.somersaults = somersaults;
         } else {
            throw new IllegalArgumentException("invalid somersaults");
         }
      } else {
         throw new IllegalStateException("dive number is not standard");
      }
   }

   public int getTwists() {
      return this.twists;
   }

   public void setTwists(int twists) {
      if (this.standard) {
         if (twists >= 0 && twists <= 9) {
            this.twists = twists;
         } else {
            throw new IllegalArgumentException("invalid twists");
         }
      } else {
         throw new IllegalStateException("dive number is not standard");
      }
   }

   public boolean isTwisted() {
      return this.twists > 0;
   }

   public DiveNumber.Group getGroup() {
      if (this.armstand) {
         return DiveNumber.Group.ARMSTAND;
      } else if (this.twists > 0) {
         return DiveNumber.Group.TWISTING;
      } else if (this.direction == 1) {
         return DiveNumber.Group.FRONT;
      } else if (this.direction == 2) {
         return DiveNumber.Group.BACK;
      } else {
         return this.direction == 3 ? DiveNumber.Group.REVERSE : DiveNumber.Group.INWARD;
      }
   }

   public static enum Group {
      FRONT(1),
      BACK(2),
      REVERSE(3),
      INWARD(4),
      TWISTING(5),
      ARMSTAND(6);

      public final int digit;

      private Group(int digit) {
         this.digit = digit;
      }

      public int getDigit() {
         return this.digit;
      }

      public static DiveNumber.Group valueOf(int digit) {
         switch(digit) {
         case 1:
            return FRONT;
         case 2:
            return BACK;
         case 3:
            return REVERSE;
         case 4:
            return INWARD;
         case 5:
            return TWISTING;
         case 6:
            return ARMSTAND;
         default:
            throw new IllegalArgumentException(Integer.toString(digit));
         }
      }
   }

   public static enum Direction {
      FRONT(1),
      BACK(2),
      REVERSE(3),
      INWARD(4);

      public final int digit;

      private Direction(int digit) {
         this.digit = digit;
      }

      public int getDigit() {
         return this.digit;
      }

      public static DiveNumber.Direction valueOf(int digit) {
         switch(digit) {
         case 1:
            return FRONT;
         case 2:
            return BACK;
         case 3:
            return REVERSE;
         case 4:
            return INWARD;
         default:
            throw new IllegalArgumentException(Integer.toString(digit));
         }
      }
   }

   public static enum Position {
      STRAIGHT(1, 'A'),
      PIKE(2, 'B'),
      TUCK(3, 'C'),
      FREE(4, 'D'),
      THREE(5, 'E');

      public final char letter;
      final int digit;

      private Position(int digit, char letter) {
         this.digit = digit;
         this.letter = letter;
      }

      public char getLetter() {
         return this.letter;
      }

      static DiveNumber.Position valueOf(int digit) {
         switch(digit) {
         case 1:
         case 65:
         case 97:
            return STRAIGHT;
         case 2:
         case 66:
         case 98:
            return PIKE;
         case 3:
         case 67:
         case 99:
            return TUCK;
         case 4:
         case 68:
         case 100:
            return FREE;
         case 5:
         case 69:
         case 101:
            return THREE;
         default:
            throw new IllegalArgumentException(Integer.toString(digit));
         }
      }

      public static DiveNumber.Position valueOf(char letter) {
         switch(letter) {
         case 'A':
         case 'a':
            return STRAIGHT;
         case 'B':
         case 'b':
            return PIKE;
         case 'C':
         case 'c':
            return TUCK;
         case 'D':
         case 'd':
            return FREE;
         case 'E':
         case 'e':
            return THREE;
         case 'F':
         case 'G':
         case 'H':
         case 'I':
         case 'J':
         case 'K':
         case 'L':
         case 'M':
         case 'N':
         case 'O':
         case 'P':
         case 'Q':
         case 'R':
         case 'S':
         case 'T':
         case 'U':
         case 'V':
         case 'W':
         case 'X':
         case 'Y':
         case 'Z':
         case '[':
         case '\\':
         case ']':
         case '^':
         case '_':
         case '`':
         default:
            throw new IllegalArgumentException(String.valueOf(letter));
         }
      }
   }
}
