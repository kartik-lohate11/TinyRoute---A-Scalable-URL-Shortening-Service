package com.urlshortene.tinyroute.service.impl;

import com.urlshortene.tinyroute.service.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final String SHORT_KEY_PREFIX = "tinyroute:url:";
    private static final String HITS_KEY_PREFIX = "tinyroute:hits:";
    private static final long DEFAULT_TTL_HOURS = 24;

    @Override
    public void save(String shortUrl, String originalUrl) {
        save(shortUrl, originalUrl, TimeUnit.HOURS.toSeconds(DEFAULT_TTL_HOURS));
    }

    @Override
    public void save(String shortUrl, String originalUrl, long ttlSeconds) {
        if (shortUrl == null || originalUrl == null) {
            log.warn("[REDIS] Cannot cache null shortUrl or originalUrl");
            return;
        }
        try {
            String key = SHORT_KEY_PREFIX + shortUrl;
            redisTemplate.opsForValue().set(key, originalUrl, ttlSeconds, TimeUnit.SECONDS);
            log.info("[REDIS CACHE SET] Key: '{}' -> '{}' with TTL: {} seconds", key, originalUrl, ttlSeconds);
        } catch (Exception e) {
            log.error("[REDIS ERROR] Failed to save cache for key '{}': {}", shortUrl, e.getMessage());
        }
    }

    @Override
    public String get(String shortUrl) {
        if (shortUrl == null) {
            return null;
        }
        try {
            String key = SHORT_KEY_PREFIX + shortUrl;
            String originalUrl = redisTemplate.opsForValue().get(key);
            if (originalUrl != null && !originalUrl.isBlank()) {
                log.info("[REDIS CACHE HIT] Found mapping for key '{}' -> '{}'", key, originalUrl);
                return originalUrl;
            } else {
                log.info("[REDIS CACHE MISS] No mapping found in cache for key '{}'", key);
                return null;
            }
        } catch (Exception e) {
            log.error("[REDIS ERROR] Failed to retrieve key '{}' from cache: {}", shortUrl, e.getMessage());
            return null;
        }
    }

    @Override
    public void delete(String shortUrl) {
        if (shortUrl == null) {
            return;
        }
        try {
            String key = SHORT_KEY_PREFIX + shortUrl;
            Boolean deleted = redisTemplate.delete(key);
            log.info("[REDIS CACHE EVICT] Key: '{}', Deleted: {}", key, deleted);
        } catch (Exception e) {
            log.error("[REDIS ERROR] Failed to delete key '{}' from cache: {}", shortUrl, e.getMessage());
        }
    }

    @Override
    public boolean hasKey(String shortUrl) {
        if (shortUrl == null) {
            return false;
        }
        try {
            String key = SHORT_KEY_PREFIX + shortUrl;
            Boolean exists = redisTemplate.hasKey(key);
            return Boolean.TRUE.equals(exists);
        } catch (Exception e) {
            log.error("[REDIS ERROR] Failed to check existence of key '{}': {}", shortUrl, e.getMessage());
            return false;
        }
    }

    @Override
    public Long incrementHits(String shortUrl) {
        return incrementHitsBy(shortUrl, 1L);
    }

    @Override
    public Long incrementHitsBy(String shortUrl, long delta) {
        if (shortUrl == null || delta <= 0) {
            return 0L;
        }
        try {
            String key = HITS_KEY_PREFIX + shortUrl;
            Long updatedHits = redisTemplate.opsForValue().increment(key, delta);
            log.info("[REDIS HIT INCR] Key: '{}' incremented by {} -> Total Pending: {}", key, delta, updatedHits);
            return updatedHits;
        } catch (Exception e) {
            log.error("[REDIS ERROR] Failed to increment hits for shortUrl '{}': {}", shortUrl, e.getMessage());
            return 0L;
        }
    }

    @Override
    public Set<String> getHitKeys() {
        try {
            Set<String> keys = redisTemplate.keys(HITS_KEY_PREFIX + "*");
            return keys != null ? keys : java.util.Collections.emptySet();
        } catch (Exception e) {
            log.error("[REDIS ERROR] Failed to fetch hit keys with pattern '{}*': {}", HITS_KEY_PREFIX, e.getMessage());
            return java.util.Collections.emptySet();
        }
    }

    @Override
    public Long getAndResetHits(String shortUrl) {
        if (shortUrl == null) {
            return 0L;
        }
        try {
            String key = HITS_KEY_PREFIX + shortUrl;
            String value = redisTemplate.opsForValue().getAndDelete(key);
            if (value != null && !value.isBlank()) {
                return Long.parseLong(value);
            }
        } catch (Exception e) {
            log.error("[REDIS ERROR] Failed to get and reset hits for shortUrl '{}': {}", shortUrl, e.getMessage());
        }
        return 0L;
    }

    @Override
    public String extractShortUrlFromHitKey(String hitKey) {
        if (hitKey != null && hitKey.startsWith(HITS_KEY_PREFIX)) {
            return hitKey.substring(HITS_KEY_PREFIX.length());
        }
        return hitKey;
    }

    private static final String PUBLIC_RATE_LIMIT_PREFIX = "tinyroute:ratelimit:public:";

    @Override
    public boolean allowUrl(String clientId, long count) {
        if (clientId == null || clientId.isBlank()) {
            clientId = "anonymous";
        }
        try {
            String key = PUBLIC_RATE_LIMIT_PREFIX + clientId;
            Long currentCount = redisTemplate.opsForValue().increment(key, 1L);

            // Set 24-hour expiration on the first request in the window
            if (currentCount != null && currentCount == 1L) {
                redisTemplate.expire(key, 24, TimeUnit.HOURS);
            }

            if (currentCount != null && currentCount > count) {
                log.warn("[RATE LIMIT EXCEEDED] Guest user '{}' exceeded 24-hour limit (Limit: {}, Attempted: {})",
                        clientId, count, currentCount);
                return false;
            }

            log.info("[RATE LIMIT ALLOWED] Guest user '{}' request {}/{} for 24h window",
                    clientId, currentCount, count);
            return true;
        } catch (Exception e) {
            log.error("[REDIS ERROR] Rate limit check failed for guest user '{}': {}", clientId, e.getMessage());
            return true;
        }
    }
}
