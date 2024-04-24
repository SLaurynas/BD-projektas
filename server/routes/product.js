const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controllers
const {
    read, 
    create, 
    listAll, 
    remove, 
    update, 
    list, 
    productsCount,
    productStar,
    getRelated,
    searchFilters
} = require("../controllers/product");

router.get('/product/:slug', read);
router.post("/product", authCheck, adminCheck, create);
router.get('/products/total', productsCount);
router.get("/products/:count", listAll);
router.delete('/product/:slug', authCheck, adminCheck, remove);
router.put('/product/:slug', authCheck, adminCheck, update);

router.get('/product/related/:productId', getRelated);
router.post('/products', list);
router.put('/product/star/:productId', authCheck, productStar)
router.post('/search/filters', searchFilters)
 
module.exports = router; 