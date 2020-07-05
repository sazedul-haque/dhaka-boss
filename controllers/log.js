const { validationResult } = require('express-validator');

const Log = require('../models/log');

exports.getLogs = (req, res, next) => {
    Log.find()
        .then(logs => {
            res.status(200).json({ data: logs });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.getLogByCustomerId = (req, res, next) => {
    const customerId = req.params.customerId;
    Log.updateMany({ customer: customerId}, { seen : true })
        .then(result => {
            return Log.find({ customer: customerId})
        })
        .then(logs => {
            res.status(200).json({ customerId: customerId, data: logs });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getUnseenLogs = (req, res, next) => {
    Log.find({ seen: false }).countDocuments()
        .then(logs => {
            res.status(200).json({ data: logs });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}