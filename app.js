const express = require('express');
const app = express();

const db = require('./configs/db.js');
const sanitize = require('mongo-sanitize');

const Product = require('./models/Product');


app.get('/product/search/:query', (req, res) => {
    console.log(req.params.query);
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

                res.json({ status: true, message: 'successfully', objects: objs });
            } else {
                res.json({ status: false, message: 'noResult'})
            }
        })
    }
});

app.listen(8080, () => {
    console.log('App running on 8080');
})