const { request, response } = require('express');
const { Category } = require('../models');

const createCategory = async( req = request, res = response ) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if( categoryDB ) {
        return res.status(400).json({
            msg: `La categoría ${ categoryDB.name } ya existe`
        })
    }

    // Generar data a guardar
    const data = {
        name,
        user: req.user._id
    }

    const category = new Category( data );
    await category.save();

    res.status(201).json({
        category
    });
}

// getCategories - paginado - total - populate
const getCategories = async( req = request, res = response ) => {

    const { limit = 5, from = 0 } = req.query;

    const [ total, categories ] = await Promise.all([
        Category.countDocuments({ state: true }),
        Category.find({ state: true })
            .skip( Number(from) )
            .limit( Number(limit) )
            .populate('user', 'name' )
    ])

    res.status(200).json({
        total,
        categories
    });
}


// getCategory - populate { category }
const getCategory = async( req = request, res = response ) => {

    const { id } = req.params;

    const category = await Category.findById( id )
                                    .populate('user', 'name');

    res.status(200).json({
        category
    })
}


// updateCategory - solo recibir nombre
const updateCategory = async( req = request, res = response ) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        category
    })
}


// deleteCategory - state: false
const deleteCategory = async( req = request, res = response ) => {

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate( id, { state: false }, { new: true });

    res.json({
        category
    });
}





module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}