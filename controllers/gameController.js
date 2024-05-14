const Game = require("../models/game")
const Genre = require("../models/genre")
const Company = require("../models/company")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.game_list = asyncHandler(async (req, res, next) => {
    const allGames = await Game.find({}, "name company")
        .sort({ name: 1 })
        .populate("genre")
        .populate("company")
        .exec();
    res.render("game_list", {title: "Games", game_list: allGames});
})

exports.game = asyncHandler(async (req, res, next) => {
    const game = await Game.findById(req.params.id).populate("genre").populate("company").exec();
    
    if (game === null) {
        const gameError = new Error("Game not found.");
        gameError.status = 404;
        return next(gameError);
    }

    res.render("game_detail", {title: game.name, game: game});
})

exports.game_create_get = asyncHandler(async (req, res, next) => {
    const [allGenres, allCompanies] = await Promise.all([
        Genre.find({}).sort({ name: 1 }).exec(),
        Company.find({}).sort({ name: 1 }).exec()
    ]);

    res.render("game_form", {
        title: "Create game", 
        genres: allGenres, 
        companies: allCompanies,
    });
});

exports.game_create_post = [
    (req, res, next) => {
        console.log(req.body.genre)
        if (!Array.isArray(req.body.genre)) {
            req.body.genre =
                typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        next();
    }, 

    body("name", "The game title should not be empty.")
        .trim()
        .isLength({min: 3})
        .escape(),
    body("company", "A company must be selected.")
        .trim()
        .isLength({min: 3})
        .escape(),
    body("description")
        .optional()
        .trim()
        .escape(),
    body("genre.*",).escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (req.body.price === 0) {
            req.body.numberInStock = 0
        }
        const game = new Game({
            name: req.body.name, 
            company: req.body.company, 
            description: req.body.description, 
            genre: req.body.genre, 
            price: req.body.price, 
            numberInStock: req.body.numberInStock
        })
        
        if (!errors.isEmpty()) {
            const [allGenres, allCompanies] = await Promise.all([
                Genre.find({}).sort({ name: 1 }).exec(),
                Company.find({}).sort({ name: 1 }).exec()
            ]);

            // Mark our selected genres as checked.
            for (const genre of allGenres) {
                if (game.genre.includes(genre._id)) {
                    genre.checked = "true";
                }
            }

            res.render("game_form", {
                title: "Create game", 
                genres: allGenres, 
                companies: allCompanies,
                game: game,
                errors: errors.array(),
            });
            
        } else {
            await game.save();
            res.redirect(game.url);
        }
    })
]

exports.game_delete_get = asyncHandler(async (req, res, next) => {
    const game = await Game.findById(req.params.id).exec()
    
    if (game === null) {
        res.redirect("/games")
    }
    res.render("game_delete", {
        title: "Delete Game",
        game: game,
    });
})

exports.game_delete_post = asyncHandler(async (req, res, next) => {
    const game = await Game.findById(req.params.id).exec();
    if (Number(req.body.removestockamount)) {
        game.numberInStock = game.numberInStock - Number(req.body.removestockamount)
        await Game.findByIdAndUpdate(req.params.id, game, {})
        res.render("game_delete", {
            title: "Delete Game",
            game: game,
        });
        return;
    }
    if (game.numberInStock > 0) {
        res.render("game_delete", {
            title: "Delete Game",
            game: game,
        });
        return;
    } else {
        await Game.findByIdAndDelete(req.body.gameid);
        res.redirect("/games");
    }
})

exports.game_update_get = asyncHandler(async (req, res, next) => {
    const [game, allCompanies, allGenres] = await Promise.all([
        Game.findById(req.params.id).exec(),
        Company.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
    ]);

    if (game === null) {
    // No results.
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
    }

    // Mark our selected genres as checked.
    allGenres.forEach((genre) => {
        if (game.genre.includes(genre._id)) genre.checked = "true";
    });

    res.render("game_form", {
        title: "Update Game",
        companies: allCompanies,
        genres: allGenres,
        game: game,
    });
})

exports.game_update_post = [
    (req, res, next) => {
        console.log(req.body.genre)
        if (!Array.isArray(req.body.genre)) {
            req.body.genre =
                typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        next();
    }, 

    body("name", "The game title should not be empty.")
        .trim()
        .isLength({min: 3})
        .escape(),
    body("company", "A company must be selected.")
        .trim()
        .isLength({min: 3})
        .escape(),
    body("description")
        .optional()
        .trim()
        .escape(),
    body("genre.*",).escape(),
  
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const game = new Game({
            name: req.body.name, 
            company: req.body.company, 
            description: req.body.description, 
            genre: typeof req.body.genre === "undefined" ? [] : req.body.genre, 
            price: req.body.price, 
            numberInStock: req.body.numberInStock,
            _id: req.params.id,
        })
        
        if (!errors.isEmpty()) {
            const [allGenres, allCompanies] = await Promise.all([
                Genre.find({}).sort({ name: 1 }).exec(),
                Company.find({}).sort({ name: 1 }).exec()
            ]);

            // Mark our selected genres as checked.
            for (const genre of allGenres) {
                if (game.genre.indexOf(genre._id) > -1) {
                    genre.checked = "true";
                }
            }
            res.render("game_form", {
                title: "Update game", 
                genres: allGenres, 
                companies: allCompanies,
                game: game,
                errors: errors.array(),
            });
            
        } else {
            const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});
            res.redirect(updatedGame.url);
        }
    }),
];