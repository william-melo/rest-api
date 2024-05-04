import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    // Send back the list of movies as JSON
    return res.json(movies)
  }

  static async getPagination (req, res) {
    const { page, limit } = req.query
    const paginatedMovies = await MovieModel.getPagination({ page, limit })
    return res.json(paginatedMovies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) {
      return res.json(movie)
    }
    return res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (!result.success) {
    // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create({ input: result.data })

    res.status(201).json(newMovie)
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await MovieModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'No se ha encontrado la película' })
    }

    return res.json({ message: 'Movie deleted' })
  }

  static async update (req, res) {
    // Validamos parcialmente las info del body
    const result = validatePartialMovie(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    // Buscamos la pelicula por el indice
    const { id } = req.params

    const updatedMovie = await MovieModel.update({ id, input: result.data })

    return res.json(updatedMovie)
  }
}
