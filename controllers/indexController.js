const Game = require("../models/game")
const Genre = require("../models/genre")
const Company = require("../models/company")

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances, authors and genre counts (in parallel)
    const [
        numOfGames,
        numOfGenres,
        numOfCompanies,
    ] = await Promise.all([
        Game.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
        Company.countDocuments({}).exec(),
    ]);
  
    res.render("index", {
        title: "Home",
        game_count: numOfGames,
        genre_count: numOfGenres,
        company_count: numOfCompanies,
    });
  });