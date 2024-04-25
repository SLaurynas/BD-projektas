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
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;
  
    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
      (ele) => ele.postedBy.toString() === user._id.toString()
    );
  
    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: user._id } },
        },
        { new: true }
      ).exec();
      console.log("ratingAdded", ratingAdded);
      res.json(ratingAdded);
    } else {
      // if user have already left rating, update it
      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        { $set: { "ratings.$.star": star } },
        { new: true }
      ).exec();
      console.log("ratingUpdated", ratingUpdated);
      res.json(ratingUpdated);
    }
  };
  

exports.getRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
  
    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(3)
      .populate("category")
      .populate("subs")
      .populate("postedBy")
      .exec();
  
    res.json(related);
  };
  
const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      //.populate("postedBy", "_id name")
      .exec();
  
    res.json(products);
  };

const handlePrice = async (req, res, price) => {
    try{
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        //.populate("postedBy", "_id name")
        .exec();

    res.json(products);
    }catch(err){
        console.log(err);
    }
}

const handleStar = async (req, res) => {
    try {
        const stars = req.body.stars;  // Ensure you are getting 'stars' from the request correctly
        const aggregates = await Product.aggregate([
            {
                $project: {
                    document: "$$ROOT",
                    floorAverage: {
                        $floor: { $avg: "$ratings.star" }
                    }
                }
            },
            {
                $match: { floorAverage: stars }
            }
        ]);

        const productIds = aggregates.map(ag => ag._id);  // Assuming '_id' is included in the aggregation results

        const products = await Product.find({ _id: { $in: productIds } })
            .populate("category", "_id name")
            .populate("subs", "_id name")
            // .populate("postedBy", "_id name")  // Uncomment if necessary and properly defined
            .exec();

        res.json(products);
    } catch (err) {
        console.error('Error in handleStar:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({ category })
            .populate("category", "_id name")
            .populate("subs", "_id name")
            //.populate("postedBy", "_id name") // Uncomment if 'postedBy' is correctly defined in your schema
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

const handleSub = async (req, res, sub) => {
    const products = await Product.find({subs: sub})
    .populate("category", "_id name")
    .populate("subs", "_id name")
    //.populate("postedBy", "_id name") // Uncomment if 'postedBy' is correctly defined in your schema
    .exec();

    res.json(products);
}
  
  exports.searchFilters = async (req, res) => {
    const { query, price, category, stars, sub } = req.body;
  
    if (query) {
      console.log("query", query);
      await handleQuery(req, res, query);
    }

    if(price !== undefined){
        console.log('price', price)
        await handlePrice(req, res, price)
    }

    if(category){
        console.log("category ", category)
        await handleCategory(req, res, category)
    }

    if(stars) {
        console.log("stars ", stars)
        await handleStar(req, res, stars)
    }

    if(sub){
        console.log("sub ", sub)
        await handleSub(req, res, sub)
    }
  };