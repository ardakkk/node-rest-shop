const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://node-shop:' + process.env.MONGO_ATLAS_PW + '@cluster0-shard-00-00-vkyh1.mongodb.net:27017,cluster0-shard-00-01-vkyh1.mongodb.net:27017,cluster0-shard-00-02-vkyh1.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',{
    useMongoClient: true
});
mongoose.Promise = global.Promise;
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authoriuzation');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
   const error = new Error('Not Found'); 
   error.status = 404;
   next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
       error:{
           message: error.message
       } 
    });
});

module.exports = app;