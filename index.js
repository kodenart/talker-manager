const express = require('express');
const { 
  errorHandler,
 } = require('./middlewares');
 const routerTalker = require('./routes/talker');
 const loginRouter = require('./routes/login');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use('/talker', routerTalker);

app.use('/login', loginRouter);
// 
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Online');
});
