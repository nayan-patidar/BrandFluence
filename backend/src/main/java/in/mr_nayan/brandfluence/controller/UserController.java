package in.mr_nayan.brandfluence.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.mr_nayan.brandfluence.DTO.LoginRequest;
import in.mr_nayan.brandfluence.DTO.LoginResponse;
import in.mr_nayan.brandfluence.DTO.UserRequest;
import in.mr_nayan.brandfluence.DTO.UserResponse;
import in.mr_nayan.brandfluence.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse registerUser(
            @Valid @RequestBody UserRequest request) {

        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public LoginResponse loginUser(
            @RequestBody LoginRequest request) {

        return userService.loginUser(request);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {

    userService.deleteUser(id);

    return ResponseEntity.noContent().build();
}
}