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

/* Routes for games */

/* Routes for games */

module.exports = router;