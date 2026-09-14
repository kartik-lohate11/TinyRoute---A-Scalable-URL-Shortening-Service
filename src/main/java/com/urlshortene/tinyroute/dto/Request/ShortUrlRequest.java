package com.urlshortene.tinyroute.dto.Request;

public record ShortUrlRequest(
        String shortUrl,
        Long id
) {
}
