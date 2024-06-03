package com.example.spring_boot_library.controller;

import com.example.spring_boot_library.entity.Message;
import com.example.spring_boot_library.requestmodels.AddBookRequest;
import com.example.spring_boot_library.service.AdminService;
import com.example.spring_boot_library.utils.ExtractJwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value = "Authorization") String token, @RequestBody AddBookRequest addBookRequest) throws Exception {
        String admin = ExtractJwt.palyoadJwtExctraction(token, "\"userType\"");
        if (admin == null || !admin.equals(("admin"))) {
            throw new Exception("Administration page only. User is nor admin!");
        }
        adminService.postBook(addBookRequest);
    }
}