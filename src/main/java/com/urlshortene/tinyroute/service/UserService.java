package com.urlshortene.tinyroute.service;

import com.urlshortene.tinyroute.dto.UserDto;
import com.urlshortene.tinyroute.entities.UserData;

public interface UserService {

    // Register a new user
    UserDto registerUser(UserDto userDto);

    // Get user by ID
    UserDto getUserById(Long id);

    // Get user by email
    UserDto getUserByMail(String mail);

    // Update user
    UserDto updateUser(Long id, UserDto userDto);

    // Delete user
    void deleteUser(Long id);

}
