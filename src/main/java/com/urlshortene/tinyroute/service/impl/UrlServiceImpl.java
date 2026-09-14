package com.urlshortene.tinyroute.service.impl;

import com.urlshortene.tinyroute.dto.UrlDataDto;
import com.urlshortene.tinyroute.entities.UrlData;
import com.urlshortene.tinyroute.entities.UserData;
import com.urlshortene.tinyroute.enums.Visibility;
import com.urlshortene.tinyroute.exception.ResourceNotFoundException;
import com.urlshortene.tinyroute.exception.UserNotFoundException;
import com.urlshortene.tinyroute.repository.UrlDataRepository;
import com.urlshortene.tinyroute.repository.UserDataRepository;
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

    @Override
    @Transactional
    public UrlDataDto createShortUrl(String url, Long userId) {
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("URL cannot be empty");
        }

        Optional<UrlData> existingUrl =
                urlDataRepository.findByOriginalUrlAndUserUrlsId(url, userId);

        if (existingUrl.isPresent()) {
            throw new IllegalArgumentException(
                    "You have already created a short URL for this URL"
            );
        }

        UserData userData = userDataRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(userId + " Not Found")
                );

        UrlData urlData = new UrlData();
        urlData.setOriginalUrl(url);
        urlData.setTotalClicked(0L);
        urlData.setUserUrls(userData);
        urlData.setVisibility(Visibility.ENABLE);

        UrlData savedUrl = urlDataRepository.save(urlData);

        String shortUrl = UrlUtil.encodeBase62(savedUrl.getId());

        savedUrl.setShortUrl(shortUrl);

        return UrlDataDto.toDto(savedUrl);
    }

    @Override
    public String getOriginalUrl(String shortUrl) {
        UrlDataDto url = UrlDataDto.toDto(urlDataRepository.findByShortUrl(shortUrl).orElseThrow(() -> new ResourceNotFoundException(shortUrl + " Not Found")));
        return url.getOriginalUrl();
    }

    @Override
    public UrlDataDto getUrlById(Long id) {
        return null;
    }

    @Override
    public List<UrlDataDto> getUrlsByUserId(Long userId) {
        return List.of();
    }

    @Override
    public UrlDataDto updateUrl(Long id, UrlDataDto urlDataDto) {
        UrlData url = urlDataRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Url not found"));
        return null;
    }

    @Override
    public void deleteUrl(Long id) {
        urlDataRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void increaseClickCount(String shortUrl) {
        UrlData urlData = urlDataRepository.findByShortUrl(shortUrl).orElseThrow(() -> new ResourceNotFoundException(shortUrl + " Not Found"));
        Long count = urlData.getTotalClicked();
        urlData.setTotalClicked(count + 1);
        urlDataRepository.save(urlData);
    }

}
