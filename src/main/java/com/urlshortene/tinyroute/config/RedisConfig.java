package com.urlshortene.tinyroute.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.ObjectMapper;

@Configuration
@RequiredArgsConstructor
public class RedisConfig {

    private final ObjectMapper objectMapper;

    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory connectionFactory) {

        RedisTemplate<String, Object> template = new RedisTemplate<>();

        template.setConnectionFactory(connectionFactory);

        // Redis keys
        template.setKeySerializer(
                new StringRedisSerializer()
        );

        // Redis values
        template.setValueSerializer(
                new GenericJacksonJsonRedisSerializer(objectMapper)
        );

        // Hash keys
        template.setHashKeySerializer(
                new StringRedisSerializer()
        );

        // Hash values
        template.setHashValueSerializer(
                new GenericJacksonJsonRedisSerializer(objectMapper)
        );

        template.afterPropertiesSet();

        return template;
    }

}
