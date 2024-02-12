const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Session, User } = require('../models')


const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(token, SECRET)
      const session = await Session.findOne({ where: { token } })
      if (!session) {
        res.status(401).json({ error: 'user logged out' })
      }
      const id = req.decodedToken.id
      const user = await User.findOne({ where: { id } })
      if (user.disabled) {
        return res.status(401).json({ error: 'user disabled' })
      }
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}


module.exports = tokenExtractor


