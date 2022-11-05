
const {Router } = require('express');
const { check } = require('express-validator');
const { usuarioGet, 
        usuarioPut, 
        usuarioPost, 
        usuarioDelete, 
        usuarioPatch } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, existeUsuarioPorID } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usuarioGet);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio y debe ser mayor a 6 caracteres').isLength({ min: 6}),
        check('correo').custom(emailExiste).isEmail(),
       // check('rol', 'El rol es valido').not().isIn(['ADMIN_ROLE', 'USER_ROLE']),
       check('rol').custom(esRoleValido),
        validarCampos
], usuarioPost);

router.put('/:id',[
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom( existeUsuarioPorID),
        check('rol').custom(esRoleValido),
        validarCampos
], usuarioPut);

router.delete('/:id',[
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom( existeUsuarioPorID),
        validarCampos
], usuarioDelete);
router.patch('/', usuarioPatch);


module.exports = router;