const dbValidators = require('./dbValidators');
const generateJWT = require('./generateJWT');
const googleVerify = require('./google-verify');
const loadFile = require('./load-file');


module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleVerify,
    ...loadFile
}