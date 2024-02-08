const router = require('express').Router()
const { Blog } = require('../models')
const { User } = require('../models')
const errorHandler = require('../middleware/errorHandler')
const tokenExtractor = require('../middleware/tokenExtractor')
//const tokenExtractor = require('.../middleware/tokenExtractor')

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    next(error);
  }
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id})
    res.json(blog)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  
  if (!blog) {
    const error = new Error('Blog not found')
    error.name = 'NotFoundError'
    next(error)
    return
  }

  res.json(blog);
});

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.findByPk(req.params.id)
    if (!blog || !(user.id == blog.userId)) {
      const err = new Error('Only creator of blog can delete blog')
      err.name = 'AuthorizationError'
      next(err)
      return
    }
    await blog.destroy()
    res.status(204).end()
  } catch(error) {
    next(error)
  }
  })

router.put('/:id', async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);
  
  if (!blog) {
    const error = new Error('Blog not found');
    error.name = 'NotFoundError';
    next(error);
    return; 
  }
  blog.likes += 1
  await blog.save()
  res.json(blog)
});

router.use(errorHandler)

module.exports = router