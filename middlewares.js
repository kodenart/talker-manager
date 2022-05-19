const errorHandler = (err, req, res, _next) => {
  res.status(500).json({ error: err.message });
};

const validateAuth = (req, res, next) => {
  const { email, password } = req.body;
  const emailRegex = /^[A-Za-z0-9+_.-]+@[^@\s]+.[\w]$/;
  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  if (!emailRegex.test(email)) {
    return (
        res.status(400)
          .json({ message: 'O "email" deve ter o formato "email@email.com"' })); 
    }
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length < 6) {
    return res.status(400)
    .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  next();
};

module.exports = { errorHandler, validateAuth };