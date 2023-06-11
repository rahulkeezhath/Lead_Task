const router = require("express").Router();
const {
  userSignup,
  userLogin,
  findBook,
  addBook,
  getCart,
  deleteBook,
  logout,
} = require("../controllers/userController");
const {protect} = require('../middleware/authMiddleware')

router.post('/signup', userSignup)
router.post('/login', userLogin)
router.get('/homepage',protect, findBook)
router.post('/add-book',protect, addBook)
router.get('/cart',protect, getCart)
router.delete('/delete-book/:bookId',protect, deleteBook)
router.get('/logout',protect,logout)

module.exports = router;