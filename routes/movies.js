import { Router } from 'express'
import { MovieController } from '../controllers/movie.js'

export const moviesRouter = Router()

// Routes
// ruta paginacion ✅✅
moviesRouter.get('/page', MovieController.getPagination)

// ruta getAll ✅✅
moviesRouter.get('/', MovieController.getAll)

// ruta buscar movie por id ✅✅
moviesRouter.get('/:id', MovieController.getById)

// crear movie ✅✅
moviesRouter.post('/', MovieController.create)

// eliminar movie ✅✅
moviesRouter.delete('/:id', MovieController.delete)

// actualizar movie ✅✅
moviesRouter.patch('/:id', MovieController.update)
