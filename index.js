const express = require('express');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');
const addRouter = require('./routes/add');
const homeRouter = require('./routes/home');
const coursesRouter = require('./routes/courses');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/orders');
const authRouter = require('./routes/auth');

const varMiddleWar = require('./middleware/variables');
const userMiddleWare = require('./middleware/user');

const app = express();
const DBconnect =
  'mongodb+srv://edocrach32:vpUjnGEdj9TOSv1y@restapp.dcyndln.mongodb.net/?retryWrites=true&w=majority';
const store = new MongoDBStore({
  collection: 'user-session',
  uri: DBconnect,
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store,
  })
);

app.use(csurf());
app.use(varMiddleWar);
app.use(userMiddleWare);
app.use(flash());

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
app.use('/orders', orderRouter);
app.use('/auth', authRouter);

async function start() {
  const port = process.env.PORT || 3000;

  try {
    await mongoose.connect(
      DBconnect,
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
