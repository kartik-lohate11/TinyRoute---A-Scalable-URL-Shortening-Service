package com.urlshortene.tinyroute;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TinyrouteApplication {

	public static void main(String[] args) {
		SpringApplication.run(TinyrouteApplication.class, args);
	}

}
