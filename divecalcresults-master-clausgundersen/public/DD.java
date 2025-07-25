/* Decompiler 69ms, total 233ms, lines 106 */
package divecalc.competition;

import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class DD extends Number implements Comparable<DD> {
   private static final long serialVersionUID = 1L;
   public static final DD ZERO = new DD(0);
   final int dd;

   private DD(int dd) {
      this.dd = dd;
   }

   public DD(int i, int f) {
      if (f >= 0 && f <= 9) {
         this.dd = i * 10 + f;
      } else {
         throw new IllegalArgumentException(f + ": invalid fractions");
      }
   }

   public int hashCode() {
      return this.dd;
   }

   public boolean equals(Object other) {
      if (other instanceof DD) {
         return ((DD)other).dd == this.dd;
      } else {
         return false;
      }
   }

   public String toString(char decimalSeparator) {
      return Integer.toString(this.dd / 10) + decimalSeparator + this.dd % 10;
   }

   public String toString(Locale locale) {
      return this.toString(DecimalFormatSymbols.getInstance(locale).getDecimalSeparator());
   }

   public String toString() {
      return this.toString(Locale.getDefault());
   }

   public int compareTo(DD other) {
      return this.dd - other.dd;
   }

   public int getValue() {
      return this.dd;
   }

   public int getIntegralPart() {
      return this.dd / 10;
   }

   public int getFractionalPart() {
      return this.dd % 10;
   }

   public DD add(DD other) {
      return new DD(this.dd + other.dd);
   }

   public DD substract(DD other) {
      return new DD(this.dd - other.dd);
   }

   public double doubleValue() {
      return (double)this.dd / 10.0D;
   }

   public float floatValue() {
      return (float)this.dd / 100.0F;
   }

   public int intValue() {
      return this.dd / 10;
   }

   public long longValue() {
      return (long)(this.dd / 10);
   }

   public static DD valueOf(String s) {
      if (s == null) {
         return null;
      } else {
         int pi = s.indexOf(46);
         if (pi == -1) {
            pi = s.indexOf(44);
         }

         return pi == -1 ? new DD(Integer.parseInt(s), 0) : new DD(Integer.parseInt(s.substring(0, pi)), Integer.parseInt(s.substring(pi + 1)));
      }
   }

   // $FF: synthetic method
   // $FF: bridge method
   public int compareTo(Object var1) {
      return this.compareTo((DD)var1);
   }
}
