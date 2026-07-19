package in.mr_nayan.brandfluence.DTO;

import in.mr_nayan.brandfluence.entity.enums.UserRole;
import lombok.Data;

@Data
public class LoginResponse {
   private Long id;
   private String name;
   private String email;
   private UserRole role;
   private String message;

   public String getToken() {
      return token;
   }

   public void setToken(String token) {
      this.token = token;
   }

   private String token;

   public Long getId() {
      return id;
   }

   public void setId(Long id) {
      this.id = id;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getEmail() {
      return email;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public UserRole getRole() {
      return role;
   }

   public void setRole(UserRole role) {
      this.role = role;
   }

   public String getMessage() {
      return message;
   }

   public void setMessage(String message) {
      this.message = message;
   }
}
