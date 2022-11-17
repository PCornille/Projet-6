const http = require('http');
const express=require('express');
const app=express();
const port=3000;
const dbMdp="tou2Z1XCDRxHrK7R";
const mongoose=require('mongoose');
const _url=require('url');
const cors = require('cors');
const bcrypt=require('bcrypt');
const path = require('path');
const helmet=require('helmet');

const User=require('./models/User');

mongoose.connect("mongodb+srv://A01:"+dbMdp+"@cluster0.oko9cjg.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.set('port', port);
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
app.use(cors());
app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

const userRoutes=require('./Routes/UserRoutes');
const sauceRoutes=require('./Routes/SauceRoutes');

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
server.listen(port);

