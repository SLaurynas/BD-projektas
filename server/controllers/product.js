const Product = require('../models/product')
const slugify = require('slugify')

exports.read = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
        .populate('category')
        .populate('subs')
        .exec();
        
        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Error fetching product' });
    }
}

exports.create = async(req, res) => {
    try{
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch(err){
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
    }
} 

exports.listAll = async(req, res) => {
    let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([['createdAt', 'desc']])
    .exec();
    res.json(products);
}

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndDelete({
             slug: req.params.slug 
        }).exec();
        if (!deleted) {
            return res.status(404).send('Product not found');
        }
        res.json(deleted);
    } catch(err) {
        console.log(err);
        res.status(400).send('Product deletion failed');
    }
}

exports.update = async (req, res) => {
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updated = await Product.findOneAndUpdate(
            {slug: req.params.slug}, 
            req.body,
            {new: true},
        ).exec();
        res.json(updated);
    }catch(err){
        console.log('PRODUCT UPDATE ERROR', err);
        return res.status(400).send('Product update failed')
    }
}