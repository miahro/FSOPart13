const router = require('express').Router()
const { Blog } = require('../models')
const errorHandler = require('../middleware/errorHandler')

const { User } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: {
          exclude: ['userId']
        }
      }
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:username', async (req, res, next) => {
  const username = req.params.username
  const user = await User.findOne({
    where: { username: username },
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })

  if (!user) {
    const error = new Error('User not found')
    error.name = 'NotFoundError'
    next(error)
    return
  }
  res.json(user)
})

router.put('/:username', async (req, res, next) => {
  const username = req.params.username
  try {
    const user = await User.findOne({ where: { username: username } })
    if (!user) {
      const error = new Error('User not found')
      error.name = 'NotFoundError'
      next(error)
      return
    }

    const newUsername = req.body.username
    user.username = newUsername
    await user.save()
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.use(errorHandler)

module.exports = router