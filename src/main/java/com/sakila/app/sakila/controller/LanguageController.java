package com.sakila.app.sakila.controller;

import com.sakila.app.sakila.model.Language;
import com.sakila.app.sakila.repository.LanguageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/languages")
public class LanguageController {

    private final LanguageRepository repo;

    public LanguageController(LanguageRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Language> findAll() {
        return repo.findAll();
    }
}