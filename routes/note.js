import express from 'express'
import Note from '../models/note';
const { 
  verifyAuthentication
} = require('../middlewares/authentication')
const router = express.Router()

// Add new note
router.post('/new-note', verifyAuthentication, async(req, res) => {
  const body = req.body;
  body.userId = req.user._id
  try {
    const createdNote = await Note.create(body);
    res.status(200).json(createdNote)
  } catch (error) {
    return res.status(500).json({
      menssage: 'Ocurrio un error al guardar la nota',
      error
    })
  }
})

// Get by id
router.get('/note/:id', async(req, res) => {
  const _id = req.params.id
  console.log(_id);
  
  try {
    const note = await Note.findOne({_id});
    res.status(200).json(note)
  } catch (error) {
    return res.status(400).json({
      message: 'Ocurrio un error al obtener la nota',
      error
    })
  }
})

// Get all notes
router.get('/note', verifyAuthentication, async (req, res) => {
  const userId = req.user._id
  try {
    const notes = await Note.find({ userId });
    res.status(200).json(notes)
  } catch (error) {
    return res.status(400).json({
      message: 'Ocurrio un error al obtener la nota',
      error
    })
  }
})

// Delete a note
router.delete('/note/:id', async(req, res) => {
  const _id = req.params.id
  try {
    const deletedNote = await Note.findByIdAndDelete({_id})
    if(!deletedNote) {
      return res.status(400).json({
        mensaje: 'No se encontró el id indicado',
        error
      })
    }
    res.json({
      message: 'Nota eliminada correctamente',
      deletedNote
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Ocurrio un error al eliminar la nota',
      error
    })
  }
})

// Update a note
router.put('/note/:id', async(req, res) => {
  const _id = req.params.id
  const { body } = req

  try {
    const note = await Note.findByIdAndUpdate(
      _id,
      body,
      { new: true }
    )

    res.json({
      message: 'Nota actualizada correctamente',
      note
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Ocurrio un error al editar la nota',
      error
    })
  }
})

module.exports = router;