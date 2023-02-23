const { Router } = require('express');
const { check } = require('express-validator');

const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/users');
const { isRoleValid, isEmailValid, userByIdExists } = require('../helpers/dbValidators');
const { 
    validateJWT, 
    validateFields, 
    hasRole, 
    isAdminRole 
} = require('../middlewares');

// const { validateFields } = require('../middlewares/validate-fields');
// const { isAdminRole, hasRole } = require('../middlewares/validate-roles');
// const validateJWT = require('../middlewares/validateJWS');


const router = Router();

router.get( '/', usersGet );

router.put( '/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userByIdExists ),
    check('role').custom( isRoleValid ),
    validateFields
], usersPut );

router.post( '/', [
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom( isEmailValid ),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'El password debe contener más de 6 letras').isLength({ min: 6 }),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isRoleValid ),
    validateFields
], usersPost );

router.delete( '/:id', [
    validateJWT,
    // isAdminRole,
    hasRole('USER_ROLE', 'ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userByIdExists ),
    validateFields
], usersDelete );

router.patch( '/', usersPatch );


module.exports = router;

 