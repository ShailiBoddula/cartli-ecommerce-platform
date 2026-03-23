package com.shopsy.backend.dto;

import com.shopsy.backend.model.Role;

public class AuthResponse {
    
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(Long id, String email, String firstName, String lastName, Role role, String token) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
    
    // Builder class
    public static class Builder {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private Role role;
        private String token;
        
        public Builder id(Long id) {
            this.id = id;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public Builder role(Role role) {
            this.role = role;
            return this;
        }
        
        public Builder token(String token) {
            this.token = token;
            return this;
        }
        
        public AuthResponse build() {
            return new AuthResponse(id, email, firstName, lastName, role, token);
        }
    }
    
    public static Builder builder() {
        return new Builder();
    }
}
