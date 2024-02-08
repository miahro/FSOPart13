const errorHandler = (err, req, res, next) => {
  console.error('errorHandle Middleware Error:', err);
  console.log('errorHandle Middleware Error:', err);

  if (err.name === 'SequelizeValidationError') {
    console.log(err)
    return res.status(400).json({ error: 'Validation Error', details: err.message });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({ error: 'Resource Not Found' });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;