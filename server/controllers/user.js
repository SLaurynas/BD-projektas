const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.userCart = async (req, res) => {
  const { cart } = req.body;
  let products = [];
  const user = await User.findOne({ email: req.user.email }).exec();

  // Check if cart with logged-in user ID already exists
  let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec();

  if (cartExistByThisUser) {
    // Use deleteOne() to remove the existing cart
    await cartExistByThisUser.deleteOne();
    console.log("Removed old cart");
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.stone = cart[i].stone;

    // Get price for calculating total
    let { price } = await Product.findById(cart[i]._id).select("price").exec();
    object.price = price;
    products.push(object);
  }

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal += products[i].price * products[i].count;
  }

  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id, // Ensure the key name is correct
  }).save();

  console.log("New cart ----> ", newCart);
  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  let cart = await Cart.findOne({ orderedBy: user._id }) // Ensure the key name is correct
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
};
