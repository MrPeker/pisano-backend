const express = require('express');
const app = express();

const db = require('./configs/db.js');

app.get('/product/search/:query', (req, res) => {
    if(req.params.query) {
        
    }
});

app.listen(8080, () => {
    console.log('App running on 8080');
})