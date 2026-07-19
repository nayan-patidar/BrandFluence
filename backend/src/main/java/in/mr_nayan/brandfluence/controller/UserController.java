package in.mr_nayan.brandfluence.controller;


import in.mr_nayan.brandfluence.DTO.LoginRequest;
import in.mr_nayan.brandfluence.DTO.LoginResponse;
import in.mr_nayan.brandfluence.DTO.UserRequest;
import in.mr_nayan.brandfluence.DTO.UserResponse;
import in.mr_nayan.brandfluence.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse registerUser(@Valid @RequestBody UserRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("login")
    public LoginResponse loginUser(@RequestBody LoginRequest request) {
        return userService.loginUser(request);
    }

@GetMapping("/all")
public ResponseEntity<List<UserResponse>> getAllUsers() {

    return ResponseEntity.ok(userService.getAllUsers());
}
}
