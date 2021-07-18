const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    response.sendFile(__dirname + 'jump-race/index.html');
});

module.exports = router;