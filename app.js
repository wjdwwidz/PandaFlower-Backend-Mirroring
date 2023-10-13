const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const https = require('https');
const fs = require('fs');
const app = express();
const options = {
    key: fs.readFileSync('./keys/private.pem'),
    cert: fs.readFileSync('./keys/public.pem')
}


dotenv.config();

const passportLocal = require('./middlewares/passportLocal');
const passportJwt = require('./middlewares/passportJwt');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');
const categoryRouter = require('./routes/categoryRouter');
const subCategoryRouter = require('./routes/subCategoryRouter');
const itemRouter = require('./routes/itemRouter');
const cartRouter = require('./routes/cartRouter');
const adminRouter = require('./routes/adminRouter');
const guestRouter = require('./routes/guestRouter');

const server = https.createServer(options, app);

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log('MongoDB에 연결되었습니다.');
  })
  .catch((error) => {
    console.error('MongoDB 연결 실패:', error);
  });

app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/uploads', express.static('uploads'));

passportLocal();
passportJwt();

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/api/users', userRouter);

app.use('/api/categories', categoryRouter);

app.use('/api/subcategories', subCategoryRouter);

app.use('/api/items', itemRouter);

app.use('/api/cart', cartRouter);

app.use('/api/order', orderRouter);

app.use('/api/admin', adminRouter);

app.use('/api/guest', guestRouter);

app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is listening Port on ${process.env.PORT}`);
});
