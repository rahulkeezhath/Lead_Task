const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require("express-async-handler");
const User = require('../models/userSchema')
const Book = require("../models/bookSchema");



// Signup
const userSignup = asyncHandler(async(req,res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email  || !password) {
      res.status(400);
      throw new Error("Please Add all Fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })
    if(user) {  
        res.status(201).json({
          _id: user.id,
          username: user.username,
          email: user.email,
          token: generateAuthToken(user._id),
        });
    }else{
        res.status(400)
        throw new Error('Invalid User')
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" }); 
  }
})

// Login
const userLogin = asyncHandler(async(req,res)=>{
    try {
        const { email, password } = req.body;

      
       const user = await User.findOne({ email });

       if (user && (await bcrypt.compare(password, user.password))) {
         res.status(200).json({
           _id: user.id,
           username: user.username,
           email: user.email,
           token: generateAuthToken(user._id),
         });
       } else {
         res.status(400);
         throw new Error("Invalid Credentials");
       }
    } catch (error) {    
        res.status(500).send({ message: "Internal Server Error" }); 
    }
  
});

// Find Book
const findBook = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Add Book API
const addBook = asyncHandler(async (req, res) => {
  try {
    const { title, author, price } = req.body;

    const book = new Book({
      title,
      author,
      price,
    });
    const bookExists = await Book.findOne({ title });
    if (bookExists) {
      res.status(400)
      throw new Error("Book already exists");
    }
    await book.save();
    const user = await User.findById(req.user);
    user.cart.push(book._id);
    await user.save();
  ;

    res.json({ message: "Book added to cart" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get Cart Details API
const getCart = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user).populate("cart");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
       const userBooks = user.cart; // Get the user's books from the cart property

       res.json(userBooks)
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Remove Book from Cart API
const deleteBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const user = await User.findById(req.user);
  const index = user.cart.indexOf(bookId);

  if (index > -1) {
    user.cart.splice(index, 1);
    await user.save();
  }

  res.json({ message: "Book removed from cart" });
});



// Logout API
const logout = asyncHandler((req, res) => {
  res.json({ message: "Logout successful" });
});


const generateAuthToken = (id) => {
  return jwt.sign({ id }, process.env.JWTPRIVATEKEY, { expiresIn: "10d" });
};

module.exports = {
  userSignup,
  userLogin,
  findBook,
  addBook,
  getCart,
  deleteBook,
  logout,
};