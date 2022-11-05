const { response, request} = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');


const usuarioGet = async (req, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const query = {estado: true}

    const [total, usuarios] = await Promise.all([ 
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
         total,
         usuarios
    })
}

const usuarioPut = async (req, res = response) => {

    const { id }= req.params;
    //Excluye datos que no quiero actualizar
    const{_id, password, google, correo, ...resto} = req.body;

    //Todo validar contra bd
    if ( password ){
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}
const usuarioPost = async (req, res = response) => {

    const { nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );


    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt);

    //Guardar en BD

    await usuario.save();

    res.json({
        usuario
    });
}
const usuarioDelete = async (req, res = response) => {

    const { id } = req.params

    //Fisicaamente lo borramos
   // const usuario = await Usuario.findByIdAndDelete( id );

   //Eliminar cambianndo el estado del usuario
   const usuario = await Usuario.findByIdAndUpdate( id, {estado: false});

   
    res.json({
        usuario
    })
}
const usuarioPatch = (req, res = response) => {
    res.json({
        msg: 'Patch Api - Controlador '
    })
}


module.exports = { 
    usuarioGet,
    usuarioPut,
    usuarioPost,
    usuarioDelete,
    usuarioPatch
}