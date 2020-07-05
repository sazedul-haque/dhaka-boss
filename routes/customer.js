const express = require('express');
const router = express.Router();
const { check } = require('express-validator');


const CustomerController = require('../controllers/customer');
const Customer = require('../models/customer');

/* GET Customers Nisting. */
router.get('/customers', CustomerController.getCustomers);

router.get('/customers/logs', CustomerController.getCustomersWithLog);


/* POST New Customer. */
router.post('/customers', [
  check('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail().custom((value, { req }) => {
    return Customer.findOne({ email: value })
      .then(customerDoc => {
        if(customerDoc) {
          return Promise.reject('Email address already exist!');
        }
      })
  }),
  check('name').trim(),
  check('phone').isNumeric().withMessage('Please provide a valid phone number'),
  check('gender').trim()
], CustomerController.createCustomer);


/* PUT New Customer. */
router.put('/customers/:customerId', [
  check('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
  check('name').trim(),
  check('phone').isNumeric().withMessage('Please provide a valid phone number'),
  check('gender').trim()
], CustomerController.updateCustomer);


/* DELETE Customer. */
router.delete('/customers/:customerId', CustomerController.deleteCustomer);

module.exports = router;