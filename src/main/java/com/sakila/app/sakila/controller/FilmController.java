package com.sakila.app.sakila.controller;

import com.sakila.app.sakila.model.Film;
import com.sakila.app.sakila.service.FilmService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/films")
public class FilmController {

    private final FilmService filmService;

    public FilmController(FilmService filmService) {
        this.filmService = filmService;
    }

    @GetMapping
    public Page<Film> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(required = false) String title
    ) {
        if (title != null && !title.isBlank()) {
            return filmService.search(title, page, size);
        }
        return filmService.findAll(page, size);
    }

    @GetMapping("/{id}")
    public Film getById(@PathVariable Integer id) {
        return filmService.findById(id).orElseThrow();
    }

    @PostMapping
    public Film create(@RequestBody Film film) {
        return filmService.save(film);
    }

    @PutMapping("/{id}")
    public Film update(@PathVariable Integer id, @RequestBody Film film) {
        return filmService.update(id, film);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        filmService.delete(id);
    }
}