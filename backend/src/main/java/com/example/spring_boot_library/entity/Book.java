package com.example.spring_boot_library.entity;

import lombok.Data;
import jakarta.persistence.*;

@Entity
@Table(name = "book")
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "author", nullable = false)
    private String author;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "copies", nullable = false)
    private int copies;

    @Column(name = "copies_available", nullable = false)
    private int copiesAvailable;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "img")
    private String img;
}
