const express = require('express');
const router = express.Router();


router.get('/', function(req, res) {
    response.sendFile(__dirname + 'covid-19/index.html');
});

module.exports = router