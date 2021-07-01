const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.listen(80, () => {
    console.log('app run!')
});