const {body} = require('express-validator');
const express = require('express');
const router = express.Router();

router.use(function (req, res, next) {
  var name = req.body.name;
  var description = req.body.description;
  return [
    body('name', 'Name is required.').exists().isLength({min: 3, max: 200}),
    body('description', 'Description is required.').exists()
    // check('')
  ]
})

module.exports = router;
