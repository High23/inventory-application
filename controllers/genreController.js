const Genre = require("../models/genre")
const Game = require("../models/game")
const mongoose = require("mongoose")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find({}).sort({name: 1}).exec()
    res.render("genre_list", {
        title: "Genres",
        genres: allGenres,
    });
})

exports.genre = asyncHandler(async (req, res, next) => {
    const [genre, gamesInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Game.find({genre: req.params.id}, "name").exec(),
    ])

    if (genre === null) {
        const genreError = new Error("Genre not found.");
        genreError.status = 404;
        return next(genreError);
    }

    res.render("genre_detail", {
        title: "Genre",
        genre: genre,
        gamesInGenre: gamesInGenre,
    });
})

exports.genre_create_get = asyncHandler(async (req, res, next) => {
    res.render("genre_form", {title: "Create genre"})
});

exports.genre_create_post = [
    body("name", "Please enter a genre name")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("description")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre({
            name: req.body.name,
            description: req.body.description
        })

        if(!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Create genre",
                genre: genre,
                errors: errors.array(),
            });
        } else {
            await genre.save();
            res.redirect(genre.url);
        }
    })
]

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    const [genre, gamesInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Game.find({genre: req.params.id}, "name").exec(),
    ])

    if (genre === null) {
        const genreError = new Error("Game not found.");
        genreError.status = 404;
        return next(genreError);
    }

    res.render("genre_delete", {
        title: "Delete Genre",
        genre: genre,
        gamesInGenre: gamesInGenre,
    });
})

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    await Game.updateMany({genre: req.body.genreid}, {
        $pull: {
            genre: req.body.genreid
        },
    }, {});
    await Genre.findByIdAndDelete(req.body.genreid)
    res.redirect("/genres");
    
})

exports.genre_update_get = asyncHandler(async (req, res, next) => {
    const [genre, gamesInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Game.find({genre: req.params.id}).exec()
    ])

    if (genre === null) {
    // No results.
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
    }
    console.log(genre)
    res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        gamesInGenre: gamesInGenre,
    });
})

exports.genre_update_post = [
    body("name", "Please enter a genre name")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("description")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const genre = new Genre({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id,
        })

        if(!errors.isEmpty()) {
            res.render("genre_form", {
                title: "Create genre",
                genre: genre,
                errors: errors.array(),
            });
        } else {
            await Game.updateMany({genre: req.params.id}, {
                $pull: {
                    genre: req.params.id
                },
            }, {});
            const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
            res.redirect(updatedGenre.url);
        }
    })
]