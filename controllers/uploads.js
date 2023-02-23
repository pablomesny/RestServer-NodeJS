const path = require('path');
const fs = require('fs');
const { request, response } = require('express');
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { loadFile } = require('../helpers');
const { User, Product } = require('../models');

const uploadFile = async( req = request, res = response ) => {

    try {

        // const validExtensions = [ 'txt', 'md', 'pdf' ];
        // const name = await loadFile( req.files, validExtensions, 'pdf' );
        const name = await loadFile( req.files, undefined, 'pdfs' );

        res.json({
            name
        })

    } catch (error) {
        res.status(400).json({ msg: error });
    }
    
}

const updateFile = async( req = request, res = response ) => {

    const { collection, id } = req.params;

    let model;

    switch( collection ) {

        case 'users':
            model = await User.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el ID ${ id }`
                })
            }

        break;

        case 'products':
            model = await Product.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el ID ${ id }`
                })
            }

        break;

        default:
            return res.status(500).json({
                msg: 'Esta colección no fue validada'
            })

    }

    // Limpiar imágenes previas
    if( model.img ) {
        const imagePath = path.join( __dirname, '../uploads', collection, model.img );
        if( fs.existsSync( imagePath ) ) {
            fs.unlinkSync( imagePath );
        }
    }    

    try {
        
        const name = await loadFile( req.files, [ 'jpg', 'jpeg', 'png' ], collection );
        model.img = name;
    
        await model.save();
    
        res.json( model );

    } catch (error) {
        res.status(400).json({
            msg: error
        })
    }

}

const getImage = async( req = request, res = response ) => {

    const { collection, id } = req.params;

    let model;

    switch( collection ) {

        case 'users':
            model = await User.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el ID ${ id }`
                })
            }

        break;

        case 'products':
            model = await Product.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el ID ${ id }`
                })
            }

        break;

        default:
            return res.status(500).json({
                msg: 'Esta colección no fue validada'
            })

    }

    // Limpiar imágenes previas
    if( model.img ) {
        const imagePath = path.join( __dirname, '../uploads', collection, model.img );
        if( fs.existsSync( imagePath ) ) {
            return res.sendFile( imagePath );
        }
    }    

    const imagePath = path.join( __dirname, '../uploads/noimage/no-image.jpg');

    res.sendFile( imagePath );

}

const updateFileCloudinary = async( req = request, res = response ) => {

    const { collection, id } = req.params;

    let model;

    switch( collection ) {

        case 'users':
            model = await User.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el ID ${ id }`
                })
            }

        break;

        case 'products':
            model = await Product.findById( id );
            if( !model ) {
                return res.status(400).json({
                    msg: `No existe un producto con el ID ${ id }`
                })
            }

        break;

        default:
            return res.status(500).json({
                msg: 'Esta colección no fue validada'
            })

    }

    // Limpiar imágenes previas
    if( model.img ) {

        // Borrar imagen de cloudinary
        const nameArr = model.img.split('/');
        const name = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split('.');

        cloudinary.uploader.destroy( public_id ); // Sin await, no es necesario esperar que se procese
        
    }

    
    try {

        const { tempFilePath } = req.files.file;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        model.img = secure_url;
    
        await model.save();

        res.json( secure_url );
        
    } catch (error) {
        
        res.status(400).json( error );

    }

}




module.exports = {
    uploadFile,
    updateFile,
    updateFileCloudinary,
    getImage
}