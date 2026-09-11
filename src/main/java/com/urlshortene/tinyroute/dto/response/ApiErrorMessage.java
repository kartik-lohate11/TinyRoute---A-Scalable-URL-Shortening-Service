package com.urlshortene.tinyroute.dto.response;

public record ApiErrorMessage(
        String message,
        String status
) {
}
