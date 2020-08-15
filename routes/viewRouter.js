const express = require('express');
const ViewController = require('./../controllers/viewController');

const router = express.Router();

router.route('/').get(ViewController.getHome);

module.exports = router;
