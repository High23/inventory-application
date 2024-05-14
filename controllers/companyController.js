const Company = require("../models/company")
const Game = require("../models/game")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.company_list = asyncHandler(async (req, res, next) => {
    const companies = await Company.find({}).sort({name: 1}).exec()
    res.render("company_list", {
        title: "Companies",
        companies: companies
    });
})

exports.company = asyncHandler(async (req, res, next) => {
    const [company, allGamesByCompany] = await Promise.all([
        Company.findById(req.params.id).exec(),
        Game.find({company: req.params.id}).sort({name: 1}).exec()
    ]);

    if (company === null) {
        const companyError = new Error("Company not found.");
        companyError.status = 404;
        next(companyError);
    }

    res.render("company_detail", {
        title: "Company",
        company: company,
        gamesByCompany: allGamesByCompany
    })
})

exports.company_create_get = asyncHandler(async (req, res, next) => {
    res.render("company_form", {title: "Create a company"})
});

exports.company_create_post = [
    body("name", "Please enter a company name")
        .trim()
        .isLength({min: 1})
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const company = new Company({
            name: req.body.name,
        })

        if(!errors.isEmpty()) {
            res.render("company_form", {
                title: "Create a company",
                company: company,
                errors: errors.array(),
            });
        } else {
            await company.save();
            res.redirect(company.url);
        }
    })
]

exports.company_delete_get = asyncHandler(async (req, res, next) => {
    const [company, gamesByCompany] = await Promise.all([
        Company.findById(req.params.id).exec(),
        Game.find({company: req.params.id}, "name").exec(),
    ])

    if (company === null) {
        const companyError = new Error("Game not found.");
        companyError.status = 404;
        return next(companyError);
    }

    res.render("company_delete", {
        title: "Delete Company",
        company: company,
        gamesByCompany: gamesByCompany,
    });
})

exports.company_delete_post = asyncHandler(async (req, res, next) => {
    await Company.findByIdAndDelete(req.body.companyid)
    res.redirect("/companies");
})

exports.company_update_get = asyncHandler(async (req, res, next) => {
    const [company, gamesByCompany] = await Promise.all([
        Company.findById(req.params.id).exec(),
        Game.find({company: req.params.id}).exec()
    ])

    if (company === null) {
    // No results.
        const err = new Error("Company not found");
        err.status = 404;
        return next(err);
    }

    res.render("company_form", {
        title: "Update Company",
        company: company,
        gamesByCompany: gamesByCompany,
    });
})

exports.company_update_post = [
    body("name", "Please enter a company name")
        .trim()
        .isLength({min: 1})
        .escape(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const company = new Company({
            name: req.body.name,
            _id: req.params.id,
        })

        if(!errors.isEmpty()) {
            res.render("company_form", {
                title: "Create company",
                company: company,
                errors: errors.array(),
            });
        } else {
            const updatedCompany = await Company.findByIdAndUpdate(req.params.id, company, {});
            res.redirect(updatedCompany.url);
        }
    })
]