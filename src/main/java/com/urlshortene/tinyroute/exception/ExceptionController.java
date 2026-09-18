package com.urlshortene.tinyroute.exception;

import com.urlshortene.tinyroute.dto.response.ApiErrorMessage;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class ExceptionController {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorMessage> handleResourceNotFound(ResourceNotFoundException exception) {
        log.warn("[NOT FOUND] Resource not found: {}", exception.getMessage());
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.NOT_FOUND.name()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiErrorMessage> handleUserNotFound(UserNotFoundException exception) {
        log.warn("[NOT FOUND] User not found: {}", exception.getMessage());
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.NOT_FOUND.name()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorMessage> handleIllegalArgument(IllegalArgumentException exception) {
        log.warn("[BAD REQUEST] Invalid argument: {}", exception.getMessage());
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                exception.getMessage(),
                HttpStatus.BAD_REQUEST.name()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(RequestNotPermitted.class)
    public ResponseEntity<ApiErrorMessage> handleRateLimitExceeded(RequestNotPermitted exception) {
        log.warn("[RATE LIMIT EXCEEDED] Rate limit exceeded: {}", exception.getMessage());
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                "Too many requests. Please slow down and try again later.",
                HttpStatus.TOO_MANY_REQUESTS.name()
        );
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(errorMessage);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorMessage> handleGenericException(Exception exception) {
        log.error("[INTERNAL ERROR] Unexpected error occurred: ", exception);
        ApiErrorMessage errorMessage = new ApiErrorMessage(
                "An unexpected server error occurred. Please try again later.",
                HttpStatus.INTERNAL_SERVER_ERROR.name()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
    }
}
