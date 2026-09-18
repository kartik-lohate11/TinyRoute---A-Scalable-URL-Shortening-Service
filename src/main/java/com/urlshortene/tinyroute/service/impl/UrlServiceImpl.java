package com.urlshortene.tinyroute.service.impl;

import com.urlshortene.tinyroute.dto.UrlDataDto;
import com.urlshortene.tinyroute.entities.UrlData;
import com.urlshortene.tinyroute.entities.UserData;
import com.urlshortene.tinyroute.enums.Visibility;
import com.urlshortene.tinyroute.exception.ResourceNotFoundException;
import com.urlshortene.tinyroute.exception.UserNotFoundException;
import com.urlshortene.tinyroute.repository.UrlDataRepository;
import com.urlshortene.tinyroute.repository.UserDataRepository;
import com.urlshortene.tinyroute.service.RedisService;
import com.urlshortene.tinyroute.service.UrlService;
import com.urlshortene.tinyroute.util.UrlUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UrlServiceImpl implements UrlService {

    private final UrlDataRepository urlDataRepository;
    private final UserDataRepository userDataRepository;
    private final RedisService redisService;
    private static final int MAX_URLS = 5;

    @Override
    @Transactional
    public UrlDataDto createShortUrl(String url, Long userId) {
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }

        Optional<UrlData> existingUrl = urlDataRepository.findByOriginalUrlAndUserUrlsId(url, userId);

        if (existingUrl.isPresent()) {
            throw new IllegalArgumentException("You have already created a short URL for this URL");
        }

        UserData userData = userDataRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        UrlData urlData = new UrlData();
        urlData.setOriginalUrl(url);
        urlData.setTotalClicked(0L);
        urlData.setUserUrls(userData);
        urlData.setVisibility(Visibility.ENABLE);

        UrlData savedUrl = urlDataRepository.save(urlData);

        String shortUrl = UrlUtil.encodeBase62(savedUrl.getId());
        savedUrl.setShortUrl(shortUrl);
        savedUrl = urlDataRepository.save(savedUrl);

        // Pre-warm cache with newly created short URL
        redisService.save(shortUrl, url);

        return UrlDataDto.toDto(savedUrl);
    }

    @Override
    public String getOriginalUrl(String shortUrl) {
        // 1. Check Redis Cache first
        String cachedUrl = redisService.get(shortUrl);
        if (cachedUrl != null && !cachedUrl.isBlank()) {
            log.info("[CACHE HIT] Short URL '{}' resolved from Redis: {}", shortUrl, cachedUrl);
            return cachedUrl;
        }

        // 2. Cache Miss: Query Database
        log.info("[CACHE MISS] Short URL '{}' not in Redis cache. Querying Database...", shortUrl);
        UrlData urlData = urlDataRepository.findByShortUrl(shortUrl)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL '" + shortUrl + "' Not Found"));

        String originalUrl = urlData.getOriginalUrl();

        // 3. Populate Redis Cache for subsequent requests
        redisService.save(shortUrl, originalUrl);

        return originalUrl;
    }

    @Override
    public UrlDataDto getUrlById(Long id) {
        UrlData urlData = urlDataRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Url not found with id: " + id));
        return UrlDataDto.toDto(urlData);
    }

    @Override
    public List<UrlDataDto> getUrlsByUserId(Long userId) {
        return urlDataRepository.findAllUrlByUserId(userId);
    }

    @Override
    @Transactional
    public UrlDataDto updateUrl(Long id, String url) {
        UrlData urlData = urlDataRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Url not found with id: " + id));

        urlData.setOriginalUrl(url);
        UrlData updated = urlDataRepository.save(urlData);

        // Update / Invalidate Redis cache
        if (updated.getShortUrl() != null) {
            redisService.save(updated.getShortUrl(), url);
        }

        return UrlDataDto.toDto(updated);
    }

    @Override
    @Transactional
    public void deleteUrl(Long id) {
        UrlData urlData = urlDataRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Url not found with id: " + id));

        if (urlData.getShortUrl() != null) {
            redisService.delete(urlData.getShortUrl());
        }

        urlDataRepository.delete(urlData);
    }

    @Override
    public void increaseClickCount(String shortUrl) {
        Long pendingHits = redisService.incrementHits(shortUrl);
        log.info("[URL HIT] Buffered click in Redis for shortUrl '{}' (Pending un-synced hits: {})", shortUrl, pendingHits);
    }

    @Override
    public void allowRequest(String clientIp) {
        boolean isAllowed = redisService.allowUrl(clientIp, 5L);
        if (!isAllowed) {
            throw new IllegalArgumentException("Rate limit exceeded: Guest users can only create 5 URLs per 24 hours. Please register or log in for unlimited access.");
        }
    }

    @Override
    @Transactional
    public UrlDataDto createPublicShortUrl(String url, String clientIp) {
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }

        // 1. Enforce 24-hour rate limit check (5 URLs / 24 hours)
        allowRequest(clientIp);

        // 2. Save public URL
        UrlData urlData = new UrlData();
        urlData.setOriginalUrl(url);
        urlData.setTotalClicked(0L);
        urlData.setUserUrls(null);
        urlData.setVisibility(Visibility.ENABLE);

        UrlData savedUrl = urlDataRepository.save(urlData);

        String shortUrl = UrlUtil.encodeBase62(savedUrl.getId());
        savedUrl.setShortUrl(shortUrl);
        savedUrl = urlDataRepository.save(savedUrl);

        // 3. Pre-warm Redis cache
        redisService.save(shortUrl, url);

        log.info("[PUBLIC URL CREATED] Guest '{}' created short URL '{}' -> '{}'", clientIp, shortUrl, url);

        return UrlDataDto.toDto(savedUrl);
    }

    public String extractClientIp(jakarta.servlet.http.HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return (ip != null && !ip.isBlank()) ? ip : "unknown-guest";
    }
}
