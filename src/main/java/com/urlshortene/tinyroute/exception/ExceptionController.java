package com.urlshortene.tinyroute.exception;

import com.urlshortene.tinyroute.dto.response.ApiErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionController {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFound(ResourceNotFoundException exception) {
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.NOT_FOUND.name()
        );
        return ResponseEntity.status(404).body(errorMessage);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFound(UserNotFoundException exception) {
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.NOT_FOUND.name()
        );
        return ResponseEntity.status(404).body(errorMessage);
    }
}
