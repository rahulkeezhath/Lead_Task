const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userSchema')

const protect = asyncHandler(async (req, res, next ) => {
  let token

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      //  Get Token from header
      token = req.headers.authorization.split(' ')[1]
      console.log("token",token);
      
      // Verify Token
      const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
      console.log("decoded",decoded);
     
      req.user = await User.findById(decoded.id).select('-password')
      console.log("geg",req.user);
      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not AUthorized')
    }
  }

  if(!token) {
    res.status(401)
    throw new Error('Not Authorized, No Token')
  }
})


module.exports= {protect}