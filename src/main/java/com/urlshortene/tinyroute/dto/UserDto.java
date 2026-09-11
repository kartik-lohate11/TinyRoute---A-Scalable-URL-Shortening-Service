package com.urlshortene.tinyroute.dto;

import com.urlshortene.tinyroute.entities.UrlData;
import com.urlshortene.tinyroute.entities.UserData;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class UserDto {
    private Long id;
    private String mail;
    private String password;
    private String apiKey;
    private List<UrlData> urls = new ArrayList<>();
    private LocalDateTime createdTime;
    private LocalDateTime updateTime;

    public static UserDto toDto(UserData user) {

        UserDto dto = new UserDto();

        dto.setId(user.getId());
        dto.setMail(user.getMail());
        dto.setPassword(user.getPassword());
        dto.setApiKey(user.getApiKey());
        dto.setUrls(user.getUrls());
        dto.setCreatedTime(user.getCreatedTime());
        dto.setUpdateTime(user.getUpdateTime());

        return dto;
    }

    public UserData toEntity() {

        UserData user = new UserData();

        user.setId(this.id);
        user.setMail(this.mail);
        user.setPassword(this.password);
        user.setApiKey(this.apiKey);
        user.setUrls(this.urls);
        user.setCreatedTime(this.createdTime);
        user.setUpdateTime(this.updateTime);

        return user;
    }

}
