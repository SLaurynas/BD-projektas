const Product = require('../models/product')
const User = require('../models/user')
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

exports.list = async (req, res) => {
    try{
        const{sort, order, page} = req.body;
        const currentPage = page || 1;
        const perPage = 3;

        const products = await Product.find({})
        .skip((currentPage - 1)* perPage)
        .populate('category')
        .populate('subs')
        .sort([[sort, order]])
        .limit(perPage)
        .exec();

        res.json(products);
    }catch(err){
        console.log('PRODUCT LIST ERROR', err);
    }
}

// exports.list = async (req, res) => {
//     try{
//         const{sort, order, limit} = req.body;
//         const products = await Product.find({})
//         .populate('category')
//         .populate('subs')
//         .sort([[sort, order]])
//         .limit(limit)
//         .exec();

//         res.json(products);
//     }catch(err){
//         console.log('PRODUCT LIST ERROR', err);
//     }
// }

exports.productsCount = async(req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
}

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({email: req.user.email}).exec();
    const { star } = req.body;

    let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
    );

    if (existingRatingObject === undefined) {
        // Corrected the field name to 'ratings'
        let ratingAdded = await Product.findByIdAndUpdate(product._id, {
            $push: { ratings: { star, postedBy: user._id } },
        }, { new: true }).exec();
        console.log("ratingAdded", ratingAdded);
        res.json(ratingAdded);
    } else {
        // Update the existing rating
        const ratingUpdated = await Product.updateOne({
            _id: product._id,
            'ratings._id': existingRatingObject._id, // Correctly target the specific rating
        }, {
            $set: { 'ratings.$.star': star }, // Update the star value in the existing rating
        }, { new: true }).exec();
        console.log("ratingUpdated", ratingUpdated);
        res.json(ratingUpdated);
    }
};
