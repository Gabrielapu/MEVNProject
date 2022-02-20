import User from '../models/user';
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();

router.post('/', async(req, res) => {
  const { body } = req;

  try {
    const user = await User.findOne({email: body.email});

    if(!user){
      return res.status(400).json({
        mensaje: 'Usuario o contraseña inválidos'
      });
    }

    if( !bcrypt.compareSync(body.password, user.password) ){
      return res.status(400).json({
        mensaje: 'Usuario o contraseña inválidos'
      });
    }

    // Generar Token
    const token = jwt.sign(
      { data: user }, 
      'secret', 
      { expiresIn: '30d'} // Expira en 30 días
    ) 

    return res.json({ user, token })
    
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    });
  }
})

module.exports = router;