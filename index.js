const express = require('express');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const addRouter = require('./routes/add');
const homeRouter = require('./routes/home');
const coursesRouter = require('./routes/courses');
const cartRouter = require('./routes/cart');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(handlebars),
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use('/', homeRouter);
app.use('/add', addRouter);
app.use('/courses', coursesRouter);
app.use('/cart', cartRouter);

async function start() {
  console.log(process.env.PORT);
  const port = process.env.PORT || 3000;
  const DBconnect =
    'mongodb+srv://edocrach32:vpUjnGEdj9TOSv1y@restapp.dcyndln.mongodb.net/?retryWrites=true&w=majority';
  const DB =
    'mongodb://' +
    process.env.MONGO_LOGIN +
    ':' +
    process.env.MONGO_PASSWORD +
    '@' +
    process.env.MONGO_HOST +
    ':' +
    process.env.MONGO_PORT +
    '/' +
    process.env.MONGO_AUTHDATABASE;
  console.log(DB);
  try {
    await mongoose.connect(
      DB,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      () => {
        console.log(`Data Base is connected.`);
      }
    );
    app.listen(3000, () => {
      console.log(`server is running on port http://localhost:${port}/`);
    });
  } catch (err) {
    console.log(err);
  }
}
start();
