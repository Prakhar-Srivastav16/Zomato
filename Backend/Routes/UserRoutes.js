const { CreateUser, GetAllUsers, LoginUser } = require('../Controller/UserController');
const express = require('express');
const router = express.Router();

router.post('/create', CreateUser);
router.post('/login', LoginUser);
router.get('/all', GetAllUsers);

module.exports = router;