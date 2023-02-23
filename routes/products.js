const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { createProduct, getProducts, getProductById, deleteProduct, updateProduct } = require('../controllers/product');
const { productByIdExists, categoryExists, categoryByIdExists } = require('../helpers/dbValidators');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const router = Router();

// Get productos - paginación - populate - público
router.get( '/', getProducts );

// Get productos - ID - populate - público
router.get( '/:id', [
    check('id', 'El ID es obligatorio').not().isEmpty(),
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( productByIdExists ),
    validateFields
], getProductById );

// Post productos - privado
router.post( '/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un ID de Mongo válido').isMongoId(),
    check('category').custom( categoryByIdExists ),
    validateFields
], createProduct );

// Put productos - privado
router.put( '/:id', [
    validateJWT,
    check('id').custom( productByIdExists ),
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    validateFields
], updateProduct );

// Delete productos - privado
router.delete( '/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('id').custom( productByIdExists ),
    validateFields
], deleteProduct );



module.exports = router;