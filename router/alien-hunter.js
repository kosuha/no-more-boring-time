const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    response.sendFile(__dirname + 'alien-hunter/index.html');
});

module.exports = router;