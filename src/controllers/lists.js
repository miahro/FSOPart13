const router = require('express').Router()
//const { Op } = require('sequelize')
//const { Blog } = require('../models')
//const { User, List } = require('../models')
const { User, List } = require('../models')

//const { List } = require('../models/list')
const errorHandler = require('../middleware/errorHandler')
const tokenExtractor = require('../middleware/tokenExtractor')

router.post('/', tokenExtractor, async (req, res, next) => {
  console.log(req.body)
  const user = await User.findByPk(req.decodedToken.id)
  console.log('/api/readinglists', user.id, req.body.userId, req.body.userId)
  try {
    if (user.id !== req.body.userId) {
      throw Error ('AuthorizationError')
    }
    // const hardcodedData = {
    //   userId: 1,
    //   blogId: 1,
    //   read: false
    // }
    // const list = await List.create( hardcodedData )
    const list = await List.create( { ...req.body, read: false } )
    res.json(list)
  } catch(error) {
    next(error)
  }
})


router.use(errorHandler)

module.exports = router