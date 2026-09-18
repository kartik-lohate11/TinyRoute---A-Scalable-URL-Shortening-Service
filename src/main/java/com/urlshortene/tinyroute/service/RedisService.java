package com.urlshortene.tinyroute.service;

import java.util.Set;

public interface RedisService {
    void save(String shortUrl, String originalUrl);

    void save(String shortUrl, String originalUrl, long ttlSeconds);

    String get(String shortUrl);

    void delete(String shortUrl);

    boolean hasKey(String shortUrl);

    Long incrementHits(String shortUrl);

    Long incrementHitsBy(String shortUrl, long delta);

    Set<String> getHitKeys();

    Long getAndResetHits(String shortUrl);

    String extractShortUrlFromHitKey(String hitKey);

    boolean allowUrl(String url,long count);
}

