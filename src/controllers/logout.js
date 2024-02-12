const router = require('express').Router()
const { Session } = require('../models')
const { User } = require('../models')
const errorHandler = require('../middleware/errorHandler')
const tokenExtractor = require('../middleware/tokenExtractor')

router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user) {
      const err = new Error('Token not valid')
      err.name = 'AuthorizationError'
      next(err)
      return
    }
    await Session.destroy({ where: { userId: user.id } })
    res.status(204).end()
  } catch(error) {
    next(error)
  }
})


router.use(errorHandler)

module.exports = router