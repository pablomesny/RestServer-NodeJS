const { request, response } = require('express');
const { Product, Category } = require('../models');

const createProduct = async( req = request, res = response ) => {

    const { state, user, ...body } = req.body;
    
    const name = body.name.toUpperCase();

    const productExists = await Product.findOne({ name });

    if( productExists ) {
        return res.status(400).json({
            msg: `El producto ${ name } ya existe`
        })
    }

    const data = {
        name,
        user: req.user._id,
        category: body.category,
        price: body.price
    }

    const product = new Product( data );
    await product.save();

    res.status(201).json({
        product
    })
}

const getProducts = async( req = request, res = response ) => {

    const { limit = 10, from = 0 } = req.body;

    const [ total, products ] = await Promise.all([
        Product.countDocuments({ state: true }),
        Product.find({ state: true })
                    .skip( Number(from) )
                    .limit( Number(limit) )
                    .populate( 'user', 'name')
                    .populate( 'category', 'name')
    ])

    res.status(200).json({
        total,
        products
    })

}

const getProductById = async( req = request, res = response ) => {

    const { id } = req.params;

    const product = await Product.findById( id )
                                    .populate( 'user', 'name' )
                                    .populate( 'category', 'name' );

    res.status(200).json({
        product
    })
}

const updateProduct = async( req = request, res = response ) => {

    const { id } = req.params;
    const { user, state, ...data } = req.body;

    if( data.name ) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate( id, data, { new: true } );

    res.status(200).json({
        product
    })
}

const deleteProduct = async( req = request, res = response ) => {

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate( id, { state: false }, { new: true } );

    res.status(200).json({
        product
    })

}




module.exports = {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct
}