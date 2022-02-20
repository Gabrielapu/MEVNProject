import mongoose from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;


const ROLES = {
  values: ['ADMIN', 'USER'],
  message: '{VALUE} no es un rol válido'
}

const userSchema = new Schema({
  name: { type: String, required: [ true, 'El nombre es obligatorio']},
  email: { 
    type: String, 
    required: [ true, 'El correo es obligatorio'],
    unique: true
  },
  password: { type: String, required: [ true, 'La contraseña es obligatoria']},
  date: { type: Date, default: Date.now },
  role: { type: String, default: 'USER', enum: ROLES },
  active: { type: Boolean, default: true }
});

// Permite validar que el email sea unico y entrega un mensaje de error
userSchema.plugin(
  uniqueValidator,
  { message: 'El {PATH} ya existe' } 
)

// Permite eliminar la contraseña encriptada para asi no retornarla
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = mongoose.model('User', userSchema)

export default User