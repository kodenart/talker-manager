const express = require('express');
const bodyParser = require('body-parser');
const { readJson } = require('./helpers/fsJson');
const { generateToken } = require('./helpers/tokenGenerator');
const { 
  errorHandler,
validateAuth,
talkerValidation,
addTalker,
updateTalker,
deleteTalker,
validateToken,
searchByName,
 } = require('./middlewares');

const talkerPath = './talker.json';
const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (req, res, next) => {
  readJson(talkerPath)
    .then((content) => res.status(200).json(content))
    .catch((err) => next(err));
});

app.get('/talker/search', validateToken, searchByName);

app.get('/talker/:id', (req, res, next) => {
  const { id } = req.params;

  readJson(talkerPath)
    .then((content) => {
      const talker = content.find((e) => e.id === Number(id));
      if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
      res.status(200).json(talker);
    })
    .catch((err) => next(err));
});

app.post('/login', validateAuth, (req, res) => {
  const token = generateToken();
  res.status(200).json({ token });
});

app.post('/talker', talkerValidation, addTalker, (req, res) => {
  const { talker } = req;
  const { id, name, age, talk } = talker;
  res.status(201).json({ id, name, age, talk });
});

app.put('/talker/:id', talkerValidation, updateTalker, (req, res) => {
  const { talker } = req;
  const { id, name, age, talk } = talker;
  res.status(200).json({ id, name, age, talk });
});

app.delete('/talker/:id', validateToken, deleteTalker, (req, res) => {
  res.status(204).end();
});

// 
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Online');
});
