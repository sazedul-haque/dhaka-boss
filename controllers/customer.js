const { validationResult } = require('express-validator');

const Customer = require('../models/customer');
const Log = require('../models/log');

exports.getCustomers = (req, res, next) => {
    Customer.find()
        .then(customers => {
            res.status(200).json({ data: customers });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.getSingleCustomer = (req, res, next) => {
    const id = req.params.customerId;
    Customer.findById(id)
        .then(customer => {
            res.status(200).json({ data: customer });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getCustomersWithLog = async (req, res, next) => {
    const customers = await Customer.find()
    const promises = customers.map(async customer => {
        const count = await Log.find({ customer: customer._id, seen: false }).countDocuments()
        return {
            id: customer._id,
            name: customer.name,
            notification: count
        }

    })
    const results = await Promise.all(promises)
    res.status(200).json({ data: results });
};

exports.createCustomer = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ msg: 'Validation faild.', errors: errors.array() });
    }

    const email = req.body.email;
    const name = req.body.name;
    const phone = req.body.phone;
    const gender = req.body.gender;

    const customer = new Customer({
        email: email,
        name: name,
        phone: phone,
        gender: gender
    });
    customer.save()
        .then(result => {
            const metaData = 'Customer created successfully';
            const customer = result._id;
            const log = new Log({
                metaData: metaData,
                customer: customer
            });
            return log.save();
        })
        .then(result => {
            res.status(201).json({ msg: 'Customer created successfully.' });
        })
        .catch(err => {
            if (!err) {
                err.statusCode = 500;
            }
            next(err);
        })
}


exports.updateCustomer = (req, res, next) => {
    const id = req.params.customerId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ msg: 'Validation faild.', errors: errors.array() });
    }

    const updatedName = req.body.name;
    const updatedEmail = req.body.email;
    const updatedPhone = req.body.phone;
    const updatedGender = req.body.gender;

    Customer.findById(id)
        .then(customer => {
            if (!customer) {
                return res.status(404).json({ msg: 'Customer not found' });
            }
            customer.name = updatedName,
                customer.email = updatedEmail,
                customer.phone = updatedPhone,
                customer.gender = updatedGender
            return customer.save();
        })
        .then(result => {
            const metaData = 'Customer updated';
            const customer = result._id;
            const log = new Log({
                metaData: metaData,
                customer: customer
            });
            return log.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Customer updated.' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}


exports.deleteCustomer = (req, res, next) => {
    const id = req.params.customerId;
    Customer.findById(id)
        .then(customer => {
            if (!customer) {
                return res.status(404).json({ msg: 'Customer not found.' });
            }
            return Customer.deleteOne({ _id: id })
        })
        .then(result => {
            res.status(200).json({ msg: 'Customer deleted successfully.' });
        })
        .catch(err => {
            if (!err) {
                err.statusCode = 500;
            }
            next(err);
        })
}