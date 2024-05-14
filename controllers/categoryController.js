const Category = require("../models/category")
const Game = require("../models/game")
const mongoose = require("mongoose")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}).sort({name: 1}).exec()
    res.render("category_list", {
        title: "Genres",
        categories: allCategories,
    });
})

exports.category = asyncHandler(async (req, res, next) => {
    const [category, gamesInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Game.find({category: req.params.id}, "name").exec(),
    ])

    if (category === null) {
        const categoryError = new Error("Genre not found.");
        categoryError.status = 404;
        return next(categoryError);
    }

    res.render("category_detail", {
        title: "Genre",
        category: category,
        gamesInCategory: gamesInCategory,
    });
})

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", {title: "Create category"})
});

exports.category_create_post = [
    body("name", "Please enter a genre name")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("description")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description
        })

        if(!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create category",
                category: category,
                errors: errors.array(),
            });
        } else {
            await category.save();
            res.redirect(category.url);
        }
    })
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [category, gamesInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Game.find({category: req.params.id}, "name").exec(),
    ])

    if (category === null) {
        const categoryError = new Error("Game not found.");
        categoryError.status = 404;
        return next(categoryError);
    }

    res.render("category_delete", {
        title: "Delete Category",
        category: category,
        gamesInCategory: gamesInCategory,
    });
})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    await Game.updateMany({category: req.body.categoryid}, {
        $pull: {
            category: req.body.categoryid
        },
    }, {});
    await Category.findByIdAndDelete(req.body.categoryid)
    res.redirect("/categories");
    
})

exports.category_update_get = asyncHandler(async (req, res, next) => {
    const [category, gamesInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Game.find({category: req.params.id}).exec()
    ])

    if (category === null) {
    // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }
    console.log(category)
    res.render("category_form", {
        title: "Update Category",
        category: category,
        gamesInCategory: gamesInCategory,
    });
})

exports.category_update_post = [
    body("name", "Please enter a genre name")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("description")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id,
        })

        if(!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create category",
                category: category,
                errors: errors.array(),
            });
        } else {
            await Game.updateMany({category: req.params.id}, {
                $pull: {
                    category: req.params.id
                },
            }, {});
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect(updatedCategory.url);
        }
    })
]