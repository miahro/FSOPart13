const router = require('express').Router()
const Sequelize = require('sequelize')
const { Blog } = require('../models')
const errorHandler = require('../middleware/errorHandler')

router.get('/', async (req, res, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalBlogs'],
        [Sequelize.fn('SUM', Sequelize.col('likes')), 'totalLikes']
      ],
      group: 'author',
      order: [[Sequelize.literal('"totalLikes"'), 'DESC']]
    });

    res.json(authors)
  } catch (error) {
    next(error)
  }
})



router.use(errorHandler)

module.exports = router