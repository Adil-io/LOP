const express = require('express');
const app = express();
const PORT = 5000;

const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
mongoose.connection.on('connected', () => {
    console.log('Connected to MobgoDB ATLAS');
})
mongoose.connection.on('error', err => {
    console.log('Error connecting to MobgoDB ATLAS ',err);
})

require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, (req,res) => {
    console.log('Server is Running on ',PORT);
})