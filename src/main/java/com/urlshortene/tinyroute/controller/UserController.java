package com.urlshortene.tinyroute.controller;

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


}
