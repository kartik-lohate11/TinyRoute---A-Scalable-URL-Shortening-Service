package com.urlshortene.tinyroute.scheduler;

import com.urlshortene.tinyroute.repository.UrlDataRepository;
import com.urlshortene.tinyroute.service.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@Slf4j
@RequiredArgsConstructor
public class ClickCountSyncScheduler {

    private final RedisService redisService;
    private final UrlDataRepository urlDataRepository;

    /**
     * Periodically syncs click counts buffered in Redis to MySQL database.
     * Runs every 30 seconds.
     */
    @Scheduled(fixedRate = 30000)
    public void syncClickCountsToDatabase() {
        Set<String> hitKeys = redisService.getHitKeys();
        if (hitKeys == null || hitKeys.isEmpty()) {
            return;
        }

        log.info("[SCHEDULED SYNC] Starting click count synchronization for {} active short URLs...", hitKeys.size());
        int updatedCount = 0;

        for (String key : hitKeys) {
            String shortUrl = redisService.extractShortUrlFromHitKey(key);
            Long pendingHits = redisService.getAndResetHits(shortUrl);

            if (pendingHits != null && pendingHits > 0) {
                try {
                    int rowsAffected = urlDataRepository.incrementTotalClicksByShortUrl(shortUrl, pendingHits);
                    if (rowsAffected > 0) {
                        log.info("[SCHEDULED SYNC] Synced {} hits for shortUrl '{}' to MySQL database", pendingHits, shortUrl);
                        updatedCount++;
                    } else {
                        log.warn("[SCHEDULED SYNC] No URL found in DB for shortUrl '{}'. Hits discarded: {}", shortUrl, pendingHits);
                    }
                } catch (Exception e) {
                    log.error("[SCHEDULED SYNC ERROR] Failed to sync {} hits for shortUrl '{}' to DB: {}", pendingHits, shortUrl, e.getMessage());
                    // Restore pending hits in Redis so they are not lost if DB is temporarily unavailable
                    redisService.incrementHitsBy(shortUrl, pendingHits);
                }
            }
        }

        if (updatedCount > 0) {
            log.info("[SCHEDULED SYNC COMPLETED] Successfully synchronized click counts for {} URLs.", updatedCount);
        }
    }
}
