const express = require('express');
const router = express.Router();

const category_controller = require("../controllers/categoryController")
const company_controller = require("../controllers/companyController")
const game_controller = require("../controllers/gameController")

/* Routes for games */

router.get('/game/create', game_controller.game_create_get);

router.post('/game/create', game_controller.game_create_post);

router.get('/game/:id/delete', game_controller.game_delete_get);

router.post('/game/:id/delete', game_controller.game_delete_post);

router.get('/game/:id/update', game_controller.game_update_get);

router.post('/game/:id/update', game_controller.game_update_post);

router.get('/game/:id', game_controller.game);

router.get('/games', game_controller.game_list);

/* Routes for categories */

router.get('/category/create', category_controller.category_create_get);

router.post('/category/create', category_controller.category_create_post);

router.get('/category/:id/delete', category_controller.category_delete_get);

router.post('/category/:id/delete', category_controller.category_delete_post);

router.get('/category/:id/update', category_controller.category_update_get);

router.post('/category/:id/update', category_controller.category_update_post);

router.get('/category/:id', category_controller.category);

router.get('/categories', category_controller.category_list);

/* Routes for companies */

router.get('/company/create', company_controller.company_create_get);

router.post('/company/create', company_controller.company_create_post);

router.get('/company/:id/delete', company_controller.company_delete_get);

router.post('/company/:id/delete', company_controller.company_delete_post);

router.get('/company/:id/update', company_controller.company_update_get);

router.post('/company/:id/update', company_controller.company_update_post);

router.get('/company/:id', company_controller.company);

router.get('/companies', company_controller.company_list);

module.exports = router;