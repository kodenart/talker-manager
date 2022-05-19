const { readJson, writeJson } = require('./helpers/fsJson');

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

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token não encontrado' });
  if (authorization.length !== 16) res.status(401).json({ message: 'Token inválido' });
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  if (name.length < 3) {
    return res.status(400)
        .json({ message: 'O "name" deve ter pelo menos 3 caracteres' }); 
    }

  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (age < 18) {
    return res.status(400)
      .json({ message: 'A pessoa palestrante deve ser maior de idade' }); 
    }

  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400)
      .json({ 
        message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
       }); 
    }
  const { watchedAt, rate } = talk;
  if (!watchedAt || !rate) {
    return res.status(400)
      .json({ 
        message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
       }); 
    }

  next();
};

const validateTalkInfos = (req, res, next) => {
  const { talk: { watchedAt = undefined, rate = undefined } } = req.body;
  // coloquei o ano entre 2000 e 2099, arbitrariamente
  const dateRegex = /(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(20[0-9]{2})/;
  if (!dateRegex.test(watchedAt)) {
    return res.status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' }); 
    }
  if (!(rate >= 1 && rate <= 5)) {
    return res.status(400).json({
        message: 'O campo "rate" deve ser um inteiro de 1 à 5',
      }); 
    }
  next();
};

const addTalker = (req, res, next) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  readJson('./talker.json').then((content) => {
    // auto increment alike
    const id = content.length + 1;
    const newTalkPerson = { name, age, id, talk: { watchedAt, rate } };
    content.push(newTalkPerson);
    writeJson('./talker.json', content)
      .then(() => {
        // setting req.talker so I can access on the next middleware.
        req.talker = newTalkPerson;
        next();
      })
      .catch((err) => next(err));
  }).catch((err) => next(err));
};

const talkerValidation = [validateToken, 
  validateName, validateAge,
   validateTalk, validateTalkInfos];

module.exports = { 
errorHandler,
validateAuth,
talkerValidation,
addTalker };