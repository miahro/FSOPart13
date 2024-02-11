const router = require('express').Router()
const { User, List } = require('../models')

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
    const list = await List.create( { ...req.body, read: false } )
    res.json(list)
  } catch(error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  try {
    const list = await List.findByPk(req.params.id)
    if (user.id !== list.userId) {
      throw Error ('AuthorizationError')
    }
    list.read = req.body.read
    await list.save()
    res.json(list)
  } catch(error) {
    next(error)
  }
})

router.use(errorHandler)

module.exports = router