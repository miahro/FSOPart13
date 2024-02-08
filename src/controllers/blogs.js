const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog } = require('../models')
const { User } = require('../models')
const errorHandler = require('../middleware/errorHandler')
const tokenExtractor = require('../middleware/tokenExtractor')


router.get('/', async (req, res, next) => {

  let where = {}
  if (req.query.search) {
    where = {
      [Op.or]: [{
        title: {
          [Op.iLike]: `%${req.query.search}%`
        }
      }, {
        author: {
          [Op.iLike]: `%${req.query.search}%`
        }
        }]
    }
  }

  try {
    const blogs = await Blog.findAll({
      attributes: {
        exclude: ['userId']
        },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [
        ['likes', 'DESC'],
      ]
    });

    const formattedBlogs = blogs.map(blog => ({
      id: blog.id,
      author: blog.author,
      url: blog.url,
      title: blog.title,
      likes: blog.likes,
      year: blog.year,
      user: blog.user ? blog.user.name : null,
    }));

    res.json(formattedBlogs);
  } catch (error) {
    next(error);
  }
});

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
  const blog = await Blog.findByPk(req.params.id, {
    attributes: {
      exclude: ['userId']
      },
    include: {
      model: User,
      attributes: ['name']
    },
    raw: true
  })
  
  if (!blog) {
    const error = new Error('Blog not found')
    error.name = 'NotFoundError'
    next(error)
    return
  }

  const formattedBlog = {
    id: blog.id,
    author: blog.author,
    url: blog.url,
    title: blog.title,
    likes: blog.likes,
    year: blog.year,
    user: blog['user.name'] || null
  };

  res.json(formattedBlog);
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