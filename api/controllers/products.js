const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req,res,next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                   return {
                    name: dpc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost/products/' + doc._id
                    }
                   }
                })
            }
            console.log(docs)
            // if(docs.length >= 0){
                res.status(200).json(docs); 
            // }else{
            //     res.status(404).json({
            //        message:"Not found!" 
            //     });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    
}

exports.products_create_product = (req,res,next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
     });
     product.save().then(result=> {
        console.log(result);
        res.status(200).json({
            message:'Created product successfully!',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'POST',
                    url: 'http://localhost/products/' + result._id
                }
            }
        });
     }).catch(err => {
         res.status(500).json({
             error
         });
     });
}

exports.get_product = (req,res,next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + doc._id
                }
            });   
        }else{
            res.status(404).json({
               message: "No valid entry found for provided ID"  
            });
        }
    })
    .catch(err => {
        res.status(500).json({error: err});
    });
}
exports.products_update_product = (req,res,next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({
         _id: id
    },{ $set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {  
                type: 'GET',
                url: 'http://localhost:3000/products' + result._id 
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });
 }
 exports.products_delete_product = (req,res,next) => {
    const id = req.params.productId;
    Product.remove({
        _id: id
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted!',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: {name: 'String', price: 'Number'}
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            error: err
        }); 
    });
}
 