import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'

const require = createRequire(import.meta.url)
export const readJSON = (path) => require(`./${path}`)

const movies = readJSON('../movies.json')

// En los modelos vamos a aplicar la logica del negocio
// Creamos metodos estaticos para cada accion
export class MovieModel {
  static getAll ({ genre }) {
    if (genre) {
      return movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return movies
  }

  static async getPagination ({ page = 1, limit }) {
    if (limit !== undefined && page > 0 && limit > 0) {
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      return movies.slice(startIndex, endIndex)
    } else {
      // Handle invalid or missing parameters
      return []
    }
  }

  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }
    movies.push(newMovie)

    return newMovie
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) return false

    movies.splice(movieIndex, 1)
    return true
  }

  static async update ({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false

    // Ahora copiamos la movie anterior y la nueva info
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input
    }

    return movies[movieIndex]
  }
}
