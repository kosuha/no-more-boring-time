const express = require('express');
const app = express();
const cors = require('cors');
const api = require('./routes/index');

app.use(cors());

app.use('/api', api);

app.listen(3001, () => console.log('Node.js Server is running'));