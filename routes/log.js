const express = require('express');
const router = express.Router();
const { check } = require('express-validator');


const LogController = require('../controllers/log');
const Log = require('../models/log');

router.get('/logs', LogController.getLogs);

router.get('/logs/customer/:customerId', LogController.getLogByCustomerId);

router.get('/logs/unseen', LogController.getUnseenLogs);

module.exports = router;