package com.urlshortene.tinyroute.controller;

import com.urlshortene.tinyroute.dto.Request.LoginRequest;
import com.urlshortene.tinyroute.dto.UserDto;
import com.urlshortene.tinyroute.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDto user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("Serve is healthy");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto user) {
        return ResponseEntity.ok(userService.loginUser(user.getMail(), user.getPassword()));
    }

    @PostMapping("/login-verify")
    public ResponseEntity<?> loginVerify(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.verifyUser(request.userName(), request.password()));
    }
}
