const router = require('express').Router()
const { Blog, User } = require('../models')
const errorHandler = require('../middleware/errorHandler')


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

router.get('/:username', async (req, res, next) => {
  try {
    const where = {}
    if (req.query.read) where.read = req.query.read
    const user = await User.findOne({
      where: { username: req.params.username },
      attributes: ['name', 'username'] ,
      include: [{
        model: Blog,
        as: 'readings',
        through: {
          as: 'reading_list',
          attributes: ['id', 'read'],
          where
        }
      }],
    })
    if (!user) {
      throw Error('User not found!')
    }

    console.log(user)
    const modifiedUser = {
      name: user.name,
      username: user.username,
      readings: user.readings.map(blog => ({
        id: blog.id,
        url: blog.url,
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
        year: blog.year,
        readinglists: blog.reading_list ? { id: blog.reading_list.id, read: blog.reading_list.read } : null
      })),
      readinglists: user.reading_list
    }

    res.json(modifiedUser)
  } catch (error) {
    next(error)
  }
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