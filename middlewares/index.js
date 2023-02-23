const validateFields = require('../middlewares/validate-fields');
const validateRoles = require('../middlewares/validate-roles');
const validateJWT = require('./validateJWT');
const validateFile = require('./validate-file');


module.exports = {
    ...validateFields,
    ...validateFile,
    ...validateJWT,
    ...validateRoles
}