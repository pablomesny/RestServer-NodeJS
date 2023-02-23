const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const { User } = require('../models');


const usersGet = async( req = request, res = response ) => {

    const { limit = 5, from = 0 } = req.query;

    const [ total, users ] = await Promise.all([
        User.countDocuments({ state: true }),
        User.find({ state: true })
            .skip( Number(from) )
            .limit( Number(limit) )
    ])
        
    res.json({
        total,
        users
    });
}

const usersPut = async( req = request, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    if( password ) {
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, rest );

    res.json(user);
}

const usersPost = async( req = request, res = response ) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Verificar si el correo existe
    const emailExists = await User.findOne({ email });
    if( emailExists ) {
        return res.status(400).json({
            msg: 'Ese correo ya está registrado'
        })
    }


    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync( password, salt );

    // Guardar en DB
    await user.save();

    res.status(201).json({
        user
    });
}

const usersDelete = async( req = request, res = response ) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, { state: false });

    res.json({
        user
    });
}

const usersPatch = ( req = request, res = response ) => {
    res.json({
        msg: 'patch API'
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch
}