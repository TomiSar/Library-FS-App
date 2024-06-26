package com.example.spring_boot_library.controller;

import com.example.spring_boot_library.entity.Message;
import com.example.spring_boot_library.requestmodels.AdminQuestionRequest;
import com.example.spring_boot_library.service.MessagesService;
import com.example.spring_boot_library.utils.ExtractJwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessagesController {

    private MessagesService messagesService;

    @Autowired
    public MessagesController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value = "Authorization") String token, @RequestBody Message messageRequest) {
        String userEmail = ExtractJwt.palyoadJwtExctraction(token, "\"sub\"");
        messagesService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void putMessage(@RequestHeader(value = "Authorization") String token, @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
        String userEmail = ExtractJwt.palyoadJwtExctraction(token, "\"sub\"");
        String admin = ExtractJwt.palyoadJwtExctraction(token, "\"userType\"");
        if (admin == null || !admin.equals(("admin"))) {
            throw new Exception("Administration page only. User is nor admin!");
        }

        messagesService.putMessage(adminQuestionRequest, userEmail);
    }
}
