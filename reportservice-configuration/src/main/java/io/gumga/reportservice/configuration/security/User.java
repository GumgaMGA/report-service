package io.gumga.reportservice.configuration.security;

import io.gumga.domain.domains.GumgaImage;

/**
 * Created by willian on 16/11/17.
 */
public class User {

    private Long id;
    private String login;
    private String name;
    private String password;
    private GumgaImage picture;

    public User() {
    }

    public User(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public GumgaImage getPicture() {
        return picture;
    }

    public void setPicture(GumgaImage picture) {
        this.picture = picture;
    }
}
