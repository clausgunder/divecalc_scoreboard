/* Decompiler 16ms, total 183ms, lines 99 */
package divecalc.competition;

import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class Result extends Number implements Comparable<Result> {
   private static final long serialVersionUID = 1L;
   public static final Result ZERO = new Result(0);
   private final int result;

   Result(int result) {
      this.result = result;
   }

   public Result(int i, int f) {
      if (f >= 0 && f <= 99) {
         this.result = i * 100 + f;
      } else {
         throw new IllegalArgumentException(f + ": invalid fractions");
      }
   }

   public int hashCode() {
      return this.result;
   }

   public boolean equals(Object other) {
      if (other instanceof Result) {
         return ((Result)other).result == this.result;
      } else {
         return false;
      }
   }

   public String toString(char decimalSeparator) {
      String frag = Integer.toString(this.result % 100);
      if (frag.length() == 1) {
         frag = "0" + frag;
      }

      return Integer.toString(this.result / 100) + decimalSeparator + frag;
   }

   public String toString(Locale locale) {
      return this.toString(DecimalFormatSymbols.getInstance(locale).getDecimalSeparator());
   }

   public String toString() {
      return this.toString(Locale.getDefault());
   }

   public int compareTo(Result other) {
      return this.result - other.result;
   }

   public int getIntegralPart() {
      return this.result / 100;
   }

   public int getFractionalPart() {
      return this.result % 100;
   }

   public Result add(Result other) {
      return new Result(this.result + other.result);
   }

   public Result substract(Result other) {
      return new Result(this.result - other.result);
   }

   public Result multiply(DD dd) {
      int ddv = dd.dd / 10 * 100 + dd.dd % 10 * 10;
      return new Result(this.result * ddv / 100);
   }

   public double doubleValue() {
      return (double)this.result / 100.0D;
   }

   public float floatValue() {
      return (float)this.result / 100.0F;
   }

   public int intValue() {
      return this.result / 100;
   }

   public long longValue() {
      return (long)(this.result / 100);
   }

   // $FF: synthetic method
   // $FF: bridge method
   public int compareTo(Object var1) {
      return this.compareTo((Result)var1);
   }
}
