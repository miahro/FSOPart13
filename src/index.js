require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    default: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

app.get('/ping', async (req, res) => {
  console.log('pong')
  res.json('pong')
})
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

app.get('/api/blogs/:id', async (req, res) => {
  const blogId = parseInt(req.params.id);
  const blog = await Blog.findByPk(blogId)
  console.log(JSON.stringify(blog))
  if (blog) {
    res.json(blog);
  } else {
    console.log('Blog not found')
    res.status(404).json({ error: 'Blog not found' });
  }
});

app.post('/api/blogs/', async (req, res) => {
  const { author, url, title, likes } = req.body;

    console.log('url:', url)

  try {
    const newBlog = await Blog.create({
      author: author,
      url: url,
      title: title,
      likes: likes
    });

    console.log('Insert successful:', newBlog);
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const blogId = parseInt(req.params.id);
  const blog = await Blog.findByPk(blogId)
  if (blog){
    blog.destroy()
    console.log('Blog deleted')
    res.send('Blog deleted')
  } else {
    console.log('Blog not found')
    res.status(404).json({ error: 'Blog not found' });
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})