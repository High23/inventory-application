const Game = require("../models/game")
const Category = require("../models/category")
const Company = require("../models/company")

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances, authors and genre counts (in parallel)
    const [
        numOfGames,
        numOfCategories,
        numOfCompanies,
    ] = await Promise.all([
        Game.countDocuments({}).exec(),
        Category.countDocuments({}).exec(),
        Company.countDocuments({}).exec(),
    ]);
  
    res.render("index", {
        title: "Home",
        game_count: numOfGames,
        category_count: numOfCategories,
        company_count: numOfCompanies,
    });
  });