package com.urlshortene.tinyroute.service;

public interface RedisService {
    void save(String shortUrl, String originalUrl);

    void get(String shortUrl);

    void delete(String shortUrl);
}

