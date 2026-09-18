package com.urlshortene.tinyroute.controller;

import com.urlshortene.tinyroute.dto.Request.ShortUrlRequest;
import com.urlshortene.tinyroute.dto.Request.UrlUpdateRequest;
import com.urlshortene.tinyroute.service.UrlService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/url")
@RequiredArgsConstructor
@Slf4j
public class UrlController {

    private final UrlService urlService;

    @PostMapping
    @RateLimiter(name = "urlRedirectRateLimiter")
    public ResponseEntity<?> giveShortUrl(@RequestBody ShortUrlRequest request) {
        return ResponseEntity.ok(urlService.createShortUrl(request.shortUrl(), request.id()));
    }

    @GetMapping("/{shortUrl}")
    @RateLimiter(name = "urlRedirectRateLimiter")
    public ResponseEntity<Void> redirectToOriginalUrl(
            @PathVariable String shortUrl) {

        String originalUrl = urlService.getOriginalUrl(shortUrl);

        urlService.increaseClickCount(shortUrl);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(originalUrl))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUrl(@PathVariable Long id) {
        urlService.deleteUrl(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping
    public ResponseEntity<?> updateUrl(@RequestBody UrlUpdateRequest request) {
        return ResponseEntity.ok(urlService.updateUrl(request.id(), request.url()));
    }

    @GetMapping("/all-url/{id}")
    public ResponseEntity<?> getAllUserUrl(@PathVariable
                                           Long id) {
        return ResponseEntity.ok(urlService.getUrlsByUserId(id));
    }

    @PostMapping("/public")
    @RateLimiter(name = "urlRedirectRateLimiter")
    public ResponseEntity<?> createPublicShortUrl(
            @RequestBody com.urlshortene.tinyroute.dto.Request.PublicUrlRequest request,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        String clientIp = urlService.extractClientIp(httpRequest);
        return ResponseEntity.ok(urlService.createPublicShortUrl(request.url(), clientIp));
    }



}
