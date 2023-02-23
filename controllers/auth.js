const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const generateJWT = require('../helpers/generateJWT');
const googleVerify = require('../helpers/google-verify');

const login = async( req = request, res = response ) => {

    const { email, password } = req.body;

    try {

        // Verificar si el email existe
        const user = await User.findOne({ email });

        if( !user ) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos - email'
            });
        }

        // Verificar si el usuario está activo
        if( user.state === false ) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos - state: false'
            })
        }

        // Verificar la contraseña
        const validPassword = bcrypt.compareSync( password, user.password);
        if( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos - password incorrecto'
            })
        }

        // Generar JWT
        const token = await generateJWT( user.id );
        
        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {

        const { name, img, email } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        if( !user ) {

            // Crear usuario
            const data = {
                name,
                email,
                img,
                password: 'any123',
                google: true,
                role: 'USER_ROLE'
            };

            user = new User( data );
            await user.save();
        }

        // Si el usuario en DB ya existe
        if( !user.state ) {
            return res.status(401).json({
                msg: 'Hable con el administrador - Usuario bloqueado'
            });
        }

        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token de google no se pudo verificar'
        })
    }

}




module.exports = {
    login,
    googleSignIn
}