/* Decompiler 48ms, total 227ms, lines 163 */
package divecalc.competition;

import java.io.Serializable;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class Award implements Serializable, Comparable<Award> {
   private static final long serialVersionUID = 1L;
   public static final Award ZERO = new Award(0);
   public static final Award TEN = new Award(20);
   final int award;
   private static final int[] EMPTY_INT_ARRAY = new int[0];

   private Award(int award) {
      this.award = award;
   }

   public Award(int i, int f) {
      if (i >= 0 && i <= 10) {
         if (f != 5 && f != 0) {
            throw new IllegalArgumentException(i + ", " + f + ": invalid award");
         } else {
            this.award = (i << 1) + (f == 5 ? 1 : 0);
            if (this.award > 20) {
               throw new IllegalArgumentException(i + ", " + f + ": invalid award");
            }
         }
      } else {
         throw new IllegalArgumentException(i + ", " + f + ": invalid award");
      }
   }

   public int hashCode() {
      return this.award;
   }

   public boolean equals(Object other) {
      if (other instanceof Award) {
         return ((Award)other).award == this.award;
      } else {
         return false;
      }
   }

   public String toShortString() {
      if ((this.award & 1) == 1) {
         return this.award == 1 ? "½" : Integer.toString(this.award >> 1) + "½";
      } else {
         return Integer.toString(this.award >> 1);
      }
   }

   public String toString(char decimalSeparator) {
      return Integer.toString(this.award >> 1) + decimalSeparator + ((this.award & 1) == 1 ? "5" : "0");
   }

   public String toString(Locale locale) {
      return this.toString(DecimalFormatSymbols.getInstance(locale).getDecimalSeparator());
   }

   public String toString() {
      return this.toString(Locale.getDefault());
   }

   public int compareTo(Award other) {
      return this.award - other.award;
   }

   public boolean isZero() {
      return this.award == 0;
   }

   public int getIntegralPart() {
      return this.award >> 1;
   }

   public int getFractionalPart() {
      return (this.award & 1) * 5;
   }

   public Award add(Award award) {
      int a = this.award + award.award;
      if (a > 20) {
         throw new IllegalArgumentException("too high result");
      } else {
         return new Award(a);
      }
   }

   public Award substract(Award award) {
      int a = this.award - award.award;
      if (a < 0) {
         throw new IllegalArgumentException("negative result");
      } else {
         return new Award(a);
      }
   }

   public static int findMinimum(Award[] awards, int count) {
      return findMinimum(awards, count, EMPTY_INT_ARRAY);
   }

   public static int findMaximum(Award[] awards, int count) {
      return findMaximum(awards, count, EMPTY_INT_ARRAY);
   }

   public static int findMinimum(Award[] awards, int count, int[] skipIndexes) {
      int low = -1;

      for(int i = 0; i < count; ++i) {
         boolean skip = false;
         int[] var6 = skipIndexes;
         int var7 = skipIndexes.length;

         for(int var8 = 0; var8 < var7; ++var8) {
            int skipTest = var6[var8];
            skip |= skipTest == i;
         }

         if (!skip && awards[i] != null) {
            if (low == -1) {
               low = i;
            } else if (awards[i].compareTo(awards[low]) <= 0) {
               low = i;
            }
         }
      }

      return low;
   }

   public static int findMaximum(Award[] awards, int count, int[] skipIndexes) {
      int max = -1;

      for(int i = 0; i < count; ++i) {
         boolean skip = false;
         int[] var6 = skipIndexes;
         int var7 = skipIndexes.length;

         for(int var8 = 0; var8 < var7; ++var8) {
            int skipTest = var6[var8];
            skip |= skipTest == i;
         }

         if (!skip && awards[i] != null) {
            if (max == -1) {
               max = i;
            } else if (awards[i].compareTo(awards[max]) > 0) {
               max = i;
            }
         }
      }

      return max;
   }

   // $FF: synthetic method
   // $FF: bridge method
   public int compareTo(Object var1) {
      return this.compareTo((Award)var1);
   }
}
