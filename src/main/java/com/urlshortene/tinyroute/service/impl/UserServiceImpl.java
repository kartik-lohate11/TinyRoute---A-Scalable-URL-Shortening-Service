package com.urlshortene.tinyroute.service.impl;

import com.urlshortene.tinyroute.dto.UserDto;
import com.urlshortene.tinyroute.entities.UserData;
import com.urlshortene.tinyroute.exception.ResourceNotFoundException;
import com.urlshortene.tinyroute.exception.UserNotFoundException;
import com.urlshortene.tinyroute.repository.UserDataRepository;
import com.urlshortene.tinyroute.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserDataRepository userDataRepository;

    @Override
    public UserDto registerUser(UserDto userDto) {
        if (userDataRepository.existsByMail(userDto.getMail())) {
            throw new IllegalArgumentException("User already exists with mail: " + userDto.getMail());
        }
        UserData user = userDto.toEntity();
        UserData savedUser = userDataRepository.save(user);
        return UserDto.toDto(savedUser);
    }

    @Override
    public UserDto getUserById(Long id) {
        UserData user = userDataRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return UserDto.toDto(user);
    }

    @Override
    public UserDto getUserByMail(String mail) {
        UserData user = userDataRepository.findByMail(mail).orElseThrow(() -> new UserNotFoundException("User not found with mail: " + mail));
        return UserDto.toDto(user);
    }

    @Override
    public UserDto updateUser(Long id, UserDto userDto) {
        UserData existingUser = userDataRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (userDto.getMail() != null && !userDto.getMail().isBlank() && !userDto.getMail().equals(existingUser.getMail())) {
            if (userDataRepository.existsByMail(userDto.getMail())) {
                throw new IllegalArgumentException("Mail already exists: " + userDto.getMail());
            }
            existingUser.setMail(userDto.getMail());
        }
        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            existingUser.setPassword(userDto.getPassword());
        }
        UserData updatedUser = userDataRepository.save(existingUser);
        return UserDto.toDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        UserData user = userDataRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        userDataRepository.delete(user);
    }
}
