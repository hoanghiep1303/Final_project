const express = require('express');
const router = express.Router();
const sitecontroller =require('../controllers/sitecontroller');

router.get('/', sitecontroller.index);

router.get('/login', sitecontroller.login);

router.post('/validate', sitecontroller.validate);

router.get('/register', sitecontroller.register);

router.post('/store', sitecontroller.store);

router.get('/error', sitecontroller.error);

module.exports = router;