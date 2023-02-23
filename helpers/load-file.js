const path = require('path');
const { v4: uuidv4 } = require('uuid');

const loadFile = ( files, validExtensions = [ 'png', 'jpg', 'pdf', 'jpeg', 'gif', 'md' ], folder = '' ) => {

    return new Promise( ( resolve, reject ) => {

        const { file } = files;

        const fileSplitted = file.name.split('.');
        const fileExtension = fileSplitted[ fileSplitted.length - 1];

        // Validar la extension
        if( !validExtensions.includes(fileExtension) ) {
            return reject(`La extensión .${ fileExtension } del archivo no está permitida. Extensiones válidas: ${ validExtensions }`)
        }

        const tempName = `${ uuidv4() }.${ fileExtension }`;
        const uploadPath = path.join( __dirname, '../uploads/', folder, tempName );

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject({ err });
            }

            resolve( tempName );
        });

    })

    

}



module.exports = {
    loadFile
}