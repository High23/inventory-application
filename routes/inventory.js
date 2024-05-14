const express = require('express');
const router = express.Router();

const genre_controller = require("../controllers/genreController")
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

/* Routes for genres */

router.get('/genre/create', genre_controller.genre_create_get);

router.post('/genre/create', genre_controller.genre_create_post);

router.get('/genre/:id/delete', genre_controller.genre_delete_get);

router.post('/genre/:id/delete', genre_controller.genre_delete_post);

router.get('/genre/:id/update', genre_controller.genre_update_get);

router.post('/genre/:id/update', genre_controller.genre_update_post);

router.get('/genre/:id', genre_controller.genre);

router.get('/genres', genre_controller.genre_list);

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