const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controllers
const { read, create, listAll, remove, update } = require("../controllers/product");

router.get('/product/:slug', read);
router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", listAll);
router.delete('/product/:slug', authCheck, adminCheck, remove);
router.put('/product/:slug', authCheck, adminCheck, update)
 
module.exports = router; 