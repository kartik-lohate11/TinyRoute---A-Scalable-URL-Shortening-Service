package com.urlshortene.tinyroute.service;

import com.urlshortene.tinyroute.dto.UrlDataDto;
import jakarta.servlet.http.HttpServletRequest;

import java.net.http.HttpRequest;
import java.util.List;

public interface UrlService {
    // Create a short URL
    UrlDataDto createShortUrl(String url,Long id);

    // Redirect / get original URL using short code
    String getOriginalUrl(String shortUrl);

    // Get URL details by ID
    UrlDataDto getUrlById(Long id);

    // Get all URLs created by a user
    List<UrlDataDto> getUrlsByUserId(Long userId);

    // Update URL details
    UrlDataDto updateUrl(Long id, String url);

    // Delete URL
    void deleteUrl(Long id);

    // Increase click count
    void increaseClickCount(String shortUrl);

    // Create a public short URL without login (rate limited to 5 per 24 hours)
    UrlDataDto createPublicShortUrl(String url, String clientIp);

    // ANYONE CAN HIT MAX 5 URLS
    void allowRequest(String clientIp);

    String extractClientIp(HttpServletRequest request);
}
