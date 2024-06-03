package com.example.spring_boot_library.controller;

import com.example.spring_boot_library.entity.Book;
import com.example.spring_boot_library.responsemodels.ShelfCurrentLoansResponse;
import com.example.spring_boot_library.service.BookService;
import com.example.spring_boot_library.utils.ExtractJwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans(@RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtractJwt.palyoadJwtExctraction(token, "\"sub\"");
        return bookService.currentLoans(userEmail);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansAccount(@RequestHeader(value = "Authorization") String token) {
        String userEmail = ExtractJwt.palyoadJwtExctraction(token, "\"sub\"");
        return bookService.currentLoansAccount(userEmail);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutBookByUser(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) {
        String userEmail = ExtractJwt.palyoadJwtExctraction(token, "\"sub\"");
        return bookService.checkoutBookByUser(userEmail, bookId);
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJwt.palyoadJwtExctraction(token, "\"sub\"");
        return bookService.checkoutBook(userEmail, bookId);
    }

    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJwt.palyoadJwtExctraction(token, "\"sub\"");
        bookService.returnBook(userEmail, bookId);
    }


    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJwt.palyoadJwtExctraction(token, "\"sub\"");
        bookService.renewLoan(userEmail, bookId);
    }
}
