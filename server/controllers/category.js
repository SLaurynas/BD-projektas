const Category = require('../models/category');
const Product = require('../models/product');
const Sub = require("../models/sub");
const slugify = require('slugify');

exports.create = async (req, res) => {
    try{
        const {name} = req.body;
        //const category = await new Category({name, slug:slugify(name)}).save();
        res.json(await new Category({name, slug:slugify(name)}).save());
    } catch(err){
        res.status(400).send('Create category failure')
    }
}
exports.list = async (req, res) => {
    res.json(await Category.find({}).sort({createdAt: -1}).exec());
}
exports.read = async (req, res) => {
    let category = await Category.findOne({slug: req.params.slug}).exec();
    //res.json(category);
    const products = await Product.find({category})
    .populate('category')
    .exec();

    res.json({
        category,
        products,
    })
}
exports.update = async (req, res) => {
    const {name} = req.body;
    try{
        const updated = await Category.findOneAndUpdate(
            {slug: req.params.slug}, 
            {name, slug: slugify(name)},
            {new: true}
            );
        res.json(updated);
    } catch(err){
        res.status(400).send('Update failure') 
    }
}
exports.remove = async (req, res) => {
    try{
        const deleted = await Category.findOneAndDelete({slug: req.params.slug});
        res.json(deleted);
    } catch(err){
        res.status(400).send('Deletion failure') 
    }
}

exports.getSubs = async (req, res) => {
    try {
        const subs = await Sub.find({parent: req.params._id}).exec();
        res.json(subs);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching sub-categories");
    }
}