import express from 'express'
import mongoose from 'mongoose'
import bookRouter from './routes/book.route.js'
import bodyParser from 'body-parser'
import env from 'dotenv'

env.config()

const app = express()
app.use(bodyParser.json())

// Conexion a la base de datos
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection

app.use('/books', bookRouter)

const port = process.env.PORT || 8081

app.listen(port, () => {
	console.log(`Escuchando en el puerto ${port}`)
})
