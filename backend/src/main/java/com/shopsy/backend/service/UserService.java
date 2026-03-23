package com.shopsy.backend.service;

import com.shopsy.backend.model.User;

public interface UserService {

    User findUserById(Long userId);

    User findUserByEmail(String email);

    User createUser(User user);

    User updateUser(User user);

    Long getTotalUsersCount();

}
