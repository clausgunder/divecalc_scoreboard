/* Decompiler 18ms, total 179ms, lines 107 */
package divecalc.competition;

import divecalc.competition.CompetitionContext.StockString;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public enum Height {
   HEIGHT_1(StockString.HEIGHT_1_METER),
   HEIGHT_3(StockString.HEIGHT_3_METERS),
   HEIGHT_5(StockString.HEIGHT_5_METERS),
   HEIGHT_7(StockString.HEIGHT_7_METERS),
   HEIGHT_10(StockString.HEIGHT_10_METERS),
   HEIGHT_12(StockString.HEIGHT_12_METERS),
   HEIGHT_15(StockString.HEIGHT_15_METERS),
   HEIGHT_20(StockString.HEIGHT_20_METERS),
   HEIGHT_27(StockString.HEIGHT_27_METERS);

   public final StockString string;

   private Height(StockString string) {
      this.string = string;
   }

   public boolean isHigherThan(Height other) {
      return this.ordinal() > other.ordinal();
   }

   public boolean isLowerThan(Height other) {
      return this.ordinal() < other.ordinal();
   }

   public boolean isPlatform() {
      return this == HEIGHT_5 || this == HEIGHT_7 || this == HEIGHT_10;
   }

   public static Height parse(String str) {
      if (str.length() == 1) {
         switch(str.charAt(0)) {
         case '1':
            return HEIGHT_1;
         case '2':
         case '4':
         case '6':
         default:
            throw new IllegalArgumentException(str);
         case '3':
            return HEIGHT_3;
         case '5':
            return HEIGHT_5;
         case '7':
            return HEIGHT_7;
         }
      } else if ("10".equals(str)) {
         return HEIGHT_10;
      } else if (!str.equals("7.5") && !str.equals("7,5")) {
         if (!str.equals("12") && !str.equals("10-12")) {
            if (str.equals("15")) {
               return HEIGHT_15;
            } else if (str.equals("20")) {
               return HEIGHT_20;
            } else if (str.equals("27")) {
               return HEIGHT_27;
            } else {
               throw new IllegalArgumentException(str);
            }
         } else {
            return HEIGHT_12;
         }
      } else {
         return HEIGHT_7;
      }
   }

   public String toString(char decimalSeparator) {
      switch(this) {
      case HEIGHT_1:
         return "1";
      case HEIGHT_5:
         return "5";
      case HEIGHT_3:
         return "3";
      case HEIGHT_7:
         return "7" + decimalSeparator + "5";
      case HEIGHT_10:
         return "10";
      case HEIGHT_12:
         return "10-12";
      case HEIGHT_15:
         return "15";
      case HEIGHT_20:
         return "20";
      case HEIGHT_27:
         return "27";
      default:
         throw new IllegalStateException();
      }
   }

   public String toString(Locale locale) {
      return this.toString(DecimalFormatSymbols.getInstance(locale).getDecimalSeparator());
   }

   public String toString() {
      return this.toString(Locale.getDefault());
   }
}
