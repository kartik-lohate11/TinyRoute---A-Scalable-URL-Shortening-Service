package com.urlshortene.tinyroute.service;

import com.urlshortene.tinyroute.dto.UrlDataDto;

import java.util.List;

public interface UrlService {
    // Create a short URL
    UrlDataDto createShortUrl(UrlDataDto urlDataDto);

    // Redirect / get original URL using short code
    String getOriginalUrl(String shortUrl);

    // Get URL details by ID
    UrlDataDto getUrlById(Long id);

    // Get all URLs created by a user
    List<UrlDataDto> getUrlsByUserId(Long userId);

    // Update URL details
    UrlDataDto updateUrl(Long id, UrlDataDto urlDataDto);

    // Delete URL
    void deleteUrl(Long id);

    // Increase click count
    void increaseClickCount(String shortUrl);
}
