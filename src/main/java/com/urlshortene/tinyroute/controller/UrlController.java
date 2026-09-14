package com.urlshortene.tinyroute.controller;

import com.urlshortene.tinyroute.dto.Request.ShortUrlRequest;
import com.urlshortene.tinyroute.service.UrlService;
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
    public ResponseEntity<?> giveShortUrl(@RequestBody ShortUrlRequest request) {
        return ResponseEntity.ok(urlService.createShortUrl(request.shortUrl(), request.id()));
    }

    @GetMapping("/{shortUrl}")
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

}
