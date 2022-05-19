const express = require('express');

const { 
talkerValidation,
addTalker,
updateTalker,
deleteTalker,
validateToken,
searchByName,
 } = require('../middlewares');

const router = express.Router();
const { readJson } = require('../helpers/fsJson');

const talkerPath = './talker.json';

router.get('/', (req, res, next) => {
  readJson(talkerPath)
    .then((content) => res.status(200).json(content))
    .catch((err) => next(err));
});

router.get('/search', validateToken, searchByName);

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  readJson(talkerPath)
    .then((content) => {
      const talker = content.find((e) => e.id === Number(id));
      if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
      res.status(200).json(talker);
    })
    .catch((err) => next(err));
});

router.post('/', talkerValidation, addTalker, (req, res) => {
  const { talker } = req;
  const { id, name, age, talk } = talker;
  res.status(201).json({ id, name, age, talk });
});

router.put('/:id', talkerValidation, updateTalker, (req, res) => {
  const { talker } = req;
  const { id, name, age, talk } = talker;
  res.status(200).json({ id, name, age, talk });
});

router.delete('/:id', validateToken, deleteTalker, (req, res) => {
  res.status(204).end();
});

module.exports = router;