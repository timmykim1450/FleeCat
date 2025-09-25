export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: 'Not Found' })
}

export const errorHandler = (err, req, res, next) => {
  console.error('🚨', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  })
}
