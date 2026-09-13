package com.urlshortene.tinyroute.service.impl;

import com.urlshortene.tinyroute.dto.UrlDataDto;
import com.urlshortene.tinyroute.exception.ResourceNotFoundException;
import com.urlshortene.tinyroute.repository.UrlDataRepository;
import com.urlshortene.tinyroute.service.UrlService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UrlServiceImpl implements UrlService {

    private final UrlDataRepository urlDataRepository;

    @Override
    public UrlDataDto createShortUrl(UrlDataDto urlDataDto) {
        return null;
    }

    @Override
    public String getOriginalUrl(String shortUrl) {
        String url =  urlDataRepository.findByShortUrl(shortUrl).orElseThrow(() -> new ResourceNotFoundException(shortUrl + " Not Found"));
     return url;
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
        return null;
    }

    @Override
    public void deleteUrl(Long id) {

    }

    @Override
    public void increaseClickCount(String shortUrl) {

    }

}
