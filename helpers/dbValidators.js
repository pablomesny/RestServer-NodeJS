const { Category, Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/user');


const isRoleValid = async(role = '') => {
    const roleExists = await Role.findOne({ role });
    if( !roleExists ) {
        throw new Error(`El rol ${ role } no está registrado en la DB`);
    }
}

const isEmailValid = async(email = '') => {
    const emailExists = await User.findOne({ email });
    if( emailExists ) {
        throw new Error(`El email ${ email } ya se encuentra registrado`)
    }
}

const userByIdExists = async( id = '' ) => {
    const userExists = await User.findById( id );
    if( !userExists ) {
        throw new Error(`El UserID ${ id } no existe`);
    }
}

const categoryExists = async( category = '' ) => {
    const categoryName = category.toUpperCase();
    const categoryExists = await Category.findOne({ category: categoryName });
    if( !categoryExists ) {
        throw new Error(`La categoría ${ categoryName } no existe`)
    }
}

const categoryByIdExists = async( id = '' ) => {
    const categoryExists = await Category.findById( id );
    if( !categoryExists ) {
        throw new Error( `La categoría ${ id } no existe` );
    }
}

const productByIdExists = async( id = '' ) => {
    const productExists = await Product.findById( id );
    if( !productExists ) {
        throw new Error(`El producto ${ id } no existe`)
    }
}

const collectionsAllowed = async( collection = '', collectionList = [] ) => {

    if( !collectionList.includes(collection) ) {
        throw new Error(`La colección ${ collection } no está permitida. Colecciones permitidas: ${ collectionList }`)
    }

    return true;
}

module.exports = {
    collectionsAllowed,
    isEmailValid,
    isRoleValid,
    userByIdExists,
    categoryExists,
    categoryByIdExists,
    productByIdExists
}