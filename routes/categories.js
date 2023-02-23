const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { categoryByIdExists } = require('../helpers/dbValidators');

const router = Router();


// Obtener todas las categorías - público
router.get( '/', getCategories );

// Obtener una categoría por id - público
router.get( '/:id', [
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( categoryByIdExists ),
    validateFields
], getCategory );


// Crear una nueva categoría - privado ( cualquier persona con un token válido )
router.post( '/', [
    validateJWT,
    check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
    validateFields
], createCategory );


// Actualizar un registro por id - privado ( cualquiera con un token válido )
router.put( '/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( categoryByIdExists ),
    validateFields
], updateCategory );


// Borrar una categoría - privado ( admin )
router.delete( '/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( categoryByIdExists ),
    validateFields
], deleteCategory )




module.exports = router;