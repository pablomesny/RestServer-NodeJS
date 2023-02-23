const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const permittedCollections = [
    'categories',
    'products',
    'roles',
    'users'
];

const searchUsers = async( term = '' , res = response ) => {

    const isMongoId = ObjectId.isValid( term );

    if( isMongoId ) {
        const user = await User.findById( term );

        return res.json({
            results: ( user ) ? [ user ] : []
        });
    }

    const regex = new RegExp( term, 'i' );

    const users = await User.find({ 
        $or: [
            { name: regex },
            { email: regex }
        ], 
        $and: [
            { state: true }
        ]
    });

    res.json({
        results: ( users ) ? [ users ] : []
    })

}

const searchCategories = async( term, res = response ) => {

    const isMongoId = ObjectId.isValid( term );

    if( isMongoId ) {
        const category = Category.findById( term );

        return res.json({
            results: ( category ) ? [ category ] : []
        })
    }

    const regex = new RegExp( term, 'i' );

    const categories = await Category.find({ name: regex, state: true });

    res.json({
        results: ( categories ) ? [ categories ] : []
    })
}

const searchProducts = async( term, res = response ) => {

    const isMongoId = ObjectId.isValid( term );

    if( isMongoId ) {
        const products = await Product.findById( term )
                                        .populate('category', 'name');

        return res.json({
            results: ( products ) ? [ products ] : []
        })
    }

    const regex = new RegExp( term, 'i' );

    const products = await Product.find({ name: regex, state: true })
                                    .populate('category', 'name');

    res.json({
        results: ( products ) ? [ products ] : []
    })

}


const search = async( req = request, res = response ) => {

    const { collection, term } = req.params;

    if( !permittedCollections.includes( collection ) ) {
        return res.status(400).json({
            msg: `Permitted collections are: ${ permittedCollections }`
        })
    }

    switch (collection) {

        case 'categories':
            searchCategories( term, res );
        break;

        case 'products':
            searchProducts( term, res );
        break;
            
        case 'users':
            searchUsers( term, res );
        break;

        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
    }

}



module.exports = {
    search
}