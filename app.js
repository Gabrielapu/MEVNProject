import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import history from 'connect-history-api-fallback'
import mongoose from 'mongoose'

const app = express();

// Conexion a DB
const uri = 'mongodb://localhost:27017/4learnBD'
//const uri = 'mongodb+srv://MisNotas:cyvdX2CRo3crNCv4@misnotas.nbgg4.mongodb.net/MisNotas?retryWrites=true&w=majority'
const options = {};
mongoose.connect(uri, options).then(
  () => { console.log('Conectado a DB') },
  err => { console.log(err) }
);


// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./routes/note'))
app.use('/api', require('./routes/user'))
app.use('/login', require('./routes/login'))
// Rutas
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// Middleware para Vue.js router modo history
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log('Example app listening on port'+ app.get('port'));
});