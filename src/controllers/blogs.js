const router = require('express').Router()
const { Blog } = require('../models')
const errorHandler = require('../middleware/errorHandler')

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
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

router.delete('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      await blog.destroy()
    }
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