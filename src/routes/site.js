const express = require('express');
const router = express.Router();
const sitecontroller =require('../controllers/sitecontroller');

router.get('/', sitecontroller.index);

router.get('/login', sitecontroller.login);

router.get('/register', sitecontroller.register);

router.post('/register', sitecontroller.store);

module.exports = router;