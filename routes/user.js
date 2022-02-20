import express from 'express'
import User from '../models/user';
const { 
  verifyAuthentication, 
  verifyAdminRole 
} = require('../middlewares/authentication')
const router = express.Router()
const bcrypt = require('bcrypt');
const _ = require('underscore');
const saltRounds = 10;

// POST
router.post('/new-user', async(req, res) => {
  const body = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }

  // Encripta la contraseña
  body.password = bcrypt.hashSync(req.body.password, saltRounds)

  try {
    const user = await User.create(body);
    res.json(user)
  } catch (error) {
    return res.status(500).json({
      message: 'Ocurrio un error al intentar guardar un usuario',
      error
    })
  }
})

// PUT
router.put('/user/:id', [verifyAuthentication, verifyAdminRole], async(req, res) => {
  let { id } = req.params;
  let body = _.pick(req.body, ['name', 'email', 'password', 'active']);

  if(body.password) {
    body.password = bcrypt.hashSync(req.body.password, saltRounds)
  }

  try {
    // {new:true} nos devuelve el usuario actualizado
    const user = await User
      .findByIdAndUpdate(
        id, 
        body, 
        {new: true, runValidators: true }       
      );
    return res.json(user);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error al actualizar',
      error
    })
  }
});

module.exports = router