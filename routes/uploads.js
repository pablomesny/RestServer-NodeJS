const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateFile } = require('../middlewares');
const { uploadFile, updateFile, getImage, updateFileCloudinary } = require('../controllers/uploads');
const { collectionsAllowed } = require('../helpers');

const router = Router();


router.post( '/', [
    validateFile
], uploadFile );

router.put( '/:collection/:id', [
    validateFile,
    check('id', 'No es un ID de mongo válido').isMongoId(),
    check('collection').custom( c => collectionsAllowed( c, [ 'users', 'products' ] ) ),
    validateFields
], /* updateFile */ updateFileCloudinary );

router.get( '/:collection/:id', [
    check('id', 'No es un ID de Mongo válido').isMongoId(),
    check('collection').custom( c => collectionsAllowed( c, [ 'users', 'products' ])),
    validateFields
], getImage );



module.exports = router;