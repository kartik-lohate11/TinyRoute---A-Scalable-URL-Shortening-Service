package com.urlshortene.tinyroute.dto.Request;

public record UrlUpdateRequest(
        Long id,
        String url
) {
}
