/* Decompiler 22ms, total 196ms, lines 88 */
package divecalc.competition;

import java.io.Serializable;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class AwardSum implements Serializable, Comparable<AwardSum> {
   private static final long serialVersionUID = 1L;
   private int sum;
   private int count;

   public int hashCode() {
      return this.sum;
   }

   public boolean equals(Object other) {
      if (other instanceof AwardSum) {
         return ((AwardSum)other).sum == this.sum;
      } else {
         return false;
      }
   }

   public String toString(char decimalSeparator) {
      return Integer.toString(this.sum >> 1) + decimalSeparator + ((this.sum & 1) == 1 ? "50" : "00");
   }

   public String toString(Locale locale) {
      return this.toString(DecimalFormatSymbols.getInstance(locale).getDecimalSeparator());
   }

   public String toString() {
      return this.toString(Locale.getDefault());
   }

   public int compareTo(AwardSum other) {
      return this.sum - other.sum;
   }

   public AwardSum add(Award award) {
      this.sum += award.award;
      ++this.count;
      return this;
   }

   public AwardSum add(Award[] awards, int awardCount, int... discardIndexes) {
      for(int i = 0; i < awardCount; ++i) {
         boolean discard = false;
         int[] var6 = discardIndexes;
         int var7 = discardIndexes.length;

         for(int var8 = 0; var8 < var7; ++var8) {
            int discardIndex = var6[var8];
            if (i == discardIndex) {
               discard = true;
               break;
            }
         }

         if (!discard) {
            this.add(awards[i]);
            ++this.count;
         }
      }

      return this;
   }

   public int getIntegralPart() {
      return this.sum >> 1;
   }

   public int getFractionalPart() {
      return (this.sum & 1) * 50;
   }

   public Result toResult(boolean normalize) {
      int r = (this.sum >> 1) * 100 + (this.sum & 1) * 50;
      return normalize && this.count != 3 ? new Result(3 * r / this.count) : new Result(r);
   }

   // $FF: synthetic method
   // $FF: bridge method
   public int compareTo(Object var1) {
      return this.compareTo((AwardSum)var1);
   }
}
