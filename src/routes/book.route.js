import e from 'express'
import Book from '../models/book.model.js'

const router = e.Router()

// MIDDLEWARE
const getBook = async (req, res, next) => {
	let book
	const { id } = req.params

	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		return res.status(400).json({
			message: 'El ID del libro no es válido',
		})
	}

	try {
		book = await Book.findById(id)
		if (!book) {
			return res.status(404).json({
				message: 'El libro no fue encontrado',
			})
		}
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		})
	}

	res.book = book
	next()
}

// obtener un libro [get ID:?]
router.get('/:id', getBook, async (req, res) => {
	res.json(res.book)
})

// Obtener todos los libros [GET ALL]
router.get('/', async (req, res) => {
	try {
		const books = await Book.find()
		console.log('GET ALL: ', books)

		if (books.length === 0) {
			return res.status(204).json([])
		}
		res.json(books)
	} catch (error) {
		res.status(500).json({ message: error.message })
		console.error('Hubo un error al listar los libros')
	}
})

// modificar un libro por completo (todos los campos) [put ID:?]
router.put('/:id', getBook, async (req, res) => {
	try {
		const book = res.book
		book.title = req.body.title || null
		book.author = req.body.author || null
		book.genre = req.body.genre || null
		book.release_date = req.body.release_date || null

		const updatedBook = await book.save()
		res.json(updatedBook)
	} catch (error) {
		res.status(500).json({
			message: error.message,
		})
	}
})

// modificar un libro parcialmente (al menos un campo) [patch ID:?]
router.patch('/:id', getBook, async (req, res) => {
	if (!req.body.title && !req.body.author && !req.body.genre && !req.body.release_date) {
		return res.status(400).json({
			message: 'Al menos uno de los campos debe ser enviado...',
		})
	}

	try {
		const book = res.book
		book.title = req.body.title || book.title
		book.author = req.body.author || book.author
		book.genre = req.body.genre || book.genre
		book.release_date = req.body.release_date || book.release_date

		const updatedBook = await book.save()
		res.json(updatedBook)
	} catch (error) {
		res.status(500).json({
			message: error.message,
		})
	}
})

// Crear un nuevo libro (recurso) [POST]
router.post('/', async (req, res) => {
	const { title, author, genre, release_date } = req?.body
	if (!title || !author || !genre || !release_date) {
		return res.status(400).json({
			message: 'Todos los campos son necesarios para atender su solicitud.',
		})
	}

	const book = new Book({
		title,
		author,
		genre,
		release_date,
	})

	try {
		const newBook = await book.save()
		console.log(newBook)

		res.status(201).json(newBook)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
})

router.delete('/:id', getBook, async (req, res) => {
	try {
		let book = res.book
		await Book.deleteOne(book._id)
		res.json({
			message: `El libro ${book.title} ha sido eliminado con éxito`,
		})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

export default router
