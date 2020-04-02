const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //res.send('Hello World !!!');
    res.render('index', { title: 'Title App', message: 'Hi Pug !'});
});

router.get('/pug', (req, res) => {
    //res.send('Hello World !!!');
    res.render('hello', { title: 'Title App', message: 'Hi Pug @'});
});

module.exports = router;