package com.smartstudy.backend.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/me")
    public String me(@AuthenticationPrincipal UserDetails userDetails) {
        return "Xin chào, bạn đang đăng nhập với email: " + userDetails.getUsername();
    }
}