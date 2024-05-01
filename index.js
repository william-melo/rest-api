const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const app = express()
// Puerto

const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies.js')
// Aqui usamos el middleware propio de express para el JSON
app.use(express.json())
// USAMOS EL MIDDLEWARE DE CORS, LO MALO ES QUE POR DEFECTO EN LAS CABECERAS PONE "*" OSEA QUE ACEPTA TODOS LOS ORIGINS
// PERO NO NOS AYUDA MUCHO, ENTONCES DEBEMOS VALIDARLO
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'https://william-melo.github.io',
      'http://localhost:1234'] // <-- Replace with your own accepted origins

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}
))

app.disable('x-powered-by')
app.get('/movies/page', (req, res) => {
  const { page, limit } = req.query
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const paginatedMovies = movies.slice(startIndex, endIndex)
  res.json(paginatedMovies)
})

app.get('/movies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')

  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  // Send back the list of movies as JSON
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) res.json(movie)
  res.status(404).send(`No se encontró la película con ID "${id}"`)
})

// Metodo crear pelicula
app.post('/movies', (req, res) => {
  // Validacion de esquema con zod
  const result = validateMovie(req.body)
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  // Sin el middleware app.use(express.json) estos datos del body no se podrian acceder.
  // OJO SIEMPRE ESCRIBIRLO ANTES
  // Creamos el id con el modulo crypto
  // UUID stands for universal unique identifier
  // Ya que validamos correctamente con el esquema podemos hacer la copia tranquilamente
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'No se ha encontrado la película' })
  }
  movies.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted' })
})

// Actualizar una pelicula por su id
app.patch('/movies/:id', (req, res) => {
  // Validamos parcialmente las info del body
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  // Buscamos la pelicula por el indice
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'La película no existe' })
  }

  // Ahora copiamos la movie anterior y la nueva info
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie
  res.json(updateMovie)

  // Con Object.assign reemplazaremos los campos que vengan en el cuerpo de la peticion
  // Si no viene un campo lo dejamos como estaba antes
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`))
