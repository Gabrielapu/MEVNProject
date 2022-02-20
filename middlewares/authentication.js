const jwt = require('jsonwebtoken');

const verifyAuthentication = (req, res, next) => {
  const { token } = req.query;
  jwt.verify(token, 'secret', (error, decoded) => {
    if(error) {
      return res.status(401).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }

    req.user = decoded.data;

    next();
  })
}

const verifyAdminRole = (req, res, next) => {
  const { role } = req.user;
  console.log(role)
  if (role === 'ADMIN') {
    next()
  } else {
    return res.status(401).json({
      mensaje: 'El usuario no es administrador',
    })
  }
}

module.exports = { verifyAuthentication, verifyAdminRole };