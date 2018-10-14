const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const db = require('./configs/db.js');
const sanitize = require('mongo-sanitize');

const Product = require('./models/Product');

const fetch = require('node-fetch');
const cheerio = require('cheerio');

app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'SGlEZXZlbG9wZXIh'
    })
});

app.get('/product/search/:query', (req, res) => {
    if(req.params.query) {
        Product.find({
            $or: [
                { title: { $regex: sanitize(req.params.query), $options: 'gi' } },
                { title: { $regex: sanitize(req.params.query.toLowerCase()), $options: 'gi' } },
                { title: { $regex: sanitize(req.params.query.toLocaleLowerCase('tr-TR')), $options: 'gi' } },
                { sellers: { $elemMatch: { title: { $regex: sanitize(req.params.query), $options: 'gi' } } } },
                { sellers: { $elemMatch: { title: { $regex: sanitize(req.params.query.toLowerCase()), $options: 'gi' } } } },
                { sellers: { $elemMatch: { title: { $regex: sanitize(req.params.query.toLocaleLowerCase('tr-TR')), $options: 'gi' } } } },
            ]
        },  [
                '_id',
                'title',
                'sellers',
                'rate',
                'image',
                'model'
            ], {
                limit: 50,
                sort: { title: 1 }
            },
            (err, docs) => {
            if(err) {
                console.error(err);
                res.json({ status: false, message: 'technicalError'});
            }
            if(docs) {
                let objs = docs.map((doc, i) => {
                    let sellers = doc.sellers.sort((a,b) => {
                        return a.price-b.price
                    });

                    return {
                        _id: doc._id,
                        title: doc.title,
                        rate: doc.rate,
                        model: doc.model,
                        image: doc.image,
                        seller: sellers[0]
                    };
                });

                res.json({ status: true, message: 'successfully', products: objs });
            } else {
                res.json({ status: false, message: 'noResult'})
            }
        })
    }
});

app.get('/product/detail/:id', (req, res) => {
    if(req.params.id) {
        Product.findById(req.params.id, (err, doc) => {
            if(err) {
                console.error(err);
                res.json({ status: false, message: 'technicalError' });
            }

            if(doc) {
                res.json({ status: true, message: 'successfully', product: doc });
            } else {
                res.json({ status: false, message: 'notFound' });
            }
        })
    } else {
        res.json({ status: false, message: 'notEnoughInfo' });
    }
});

app.get('/wikipedia/search/:query', (req, res) => {
    if(req.params.query) {
        console.log(req.params.query);
        let wikipediaSearchURL = 'https://tr.wikipedia.org/w/api.php?action=opensearch&format=json&formatversion=2&search=' + req.params.query + '&namespace=0&limit=10&suggest=true';
        fetch(wikipediaSearchURL)
            .then((response) => {
                res.json(response)
            })
            .catch((err) => {
                console.error(err);
                res.json({ status: false, message: 'technicalError' });
            })
    } else {
        res.json({ status: false, message: 'notEnoughInfo' });
    }
});

app.get('/wikipedia/page', (req, res) => {
    if(req.query.url) {
        if(req.query.url.match(/https\:\/\/tr\.wikipedia\.org\//)) {
            fetch(req.query.url)
                .then((response) => {
                    let $ = cheerio.load(response);
                    let content = $('#content').html();
                    res.json({ status: true, message: 'succesfully', data: content});
                })
                .catch(err => {
                    console.error(err);
                    res.json({ status: false, message: 'technicalError'});
                })
        }
    } else {
        res.json({ status: false, message: 'notEnoughInfo' });
    }
})

app.listen(port, () => {
    console.log('App running on ' + port);
})