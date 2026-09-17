package com.urlshortene.tinyroute.service.impl;

import com.urlshortene.tinyroute.service.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

    private final String SHORT_KEY = "tinyroute:url:";

    @Override
    public void save(String shortUrl, String originalUrl) {

    }

    @Override
    public void get(String shortUrl) {

    }

    @Override
    public void delete(String shortUrl) {

    }
}
