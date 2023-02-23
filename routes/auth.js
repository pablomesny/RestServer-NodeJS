const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [
    check('email', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login );

router.post('/google', [
    check('id_token', 'El id_token de google es necesario').not().isEmpty(),
    validateFields
], googleSignIn );





module.exports = router;