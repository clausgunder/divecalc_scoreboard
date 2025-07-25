/* Decompiler 15ms, total 169ms, lines 91 */
package divecalc.competition;

import java.io.Serializable;

public class Property implements Serializable {
   private static final long serialVersionUID = 2L;
   private final int id;
   private String name;
   private String description;
   private Object value;
   private boolean editable;
   private boolean changeNotifyRequired;
   private boolean dynamic;

   public Property(int id) {
      this.id = id;
   }

   public int getId() {
      return this.id;
   }

   public String getName() {
      return this.name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getDescription() {
      return this.description;
   }

   public void setDescription(String description) {
      this.description = description;
   }

   public Object getValue() {
      return this.value;
   }

   public void setValue(String value) {
      this.value = value;
   }

   public void setValue(Boolean value) {
      this.value = value;
   }

   public void setValue(Integer value) {
      this.value = value;
   }

   public void setValue(Result value) {
      this.value = value;
   }

   public boolean isEditable() {
      return this.editable;
   }

   public void setEditable(boolean editable) {
      if (editable && this.dynamic) {
         throw new IllegalArgumentException("dynamic property can not be editable");
      } else {
         this.editable = editable;
      }
   }

   public boolean isDynamic() {
      return this.dynamic;
   }

   public void setDynamic(boolean dynamic) {
      if (this.editable && dynamic) {
         throw new IllegalArgumentException("editable property can not be dynamic");
      } else {
         this.dynamic = dynamic;
      }
   }

   public boolean isChangeNotifyRequired() {
      return this.changeNotifyRequired;
   }

   public void setChangeNotifyRequired(boolean changeNotifyRequired) {
      this.changeNotifyRequired = changeNotifyRequired;
   }
}
