import express from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { moviesRouter } from './routes/movies.js'

const app = express()
// Puerto
// Aqui usamos el middleware propio de express para el JSON
app.use(express.json())
// USAMOS EL MIDDLEWARE DE CORS, LO MALO ES QUE POR DEFECTO EN LAS CABECERAS PONE "*" OSEA QUE ACEPTA TODOS LOS ORIGINS
// PERO NO NOS AYUDA MUCHO, ENTONCES DEBEMOS VALIDARLO
app.use(corsMiddleware())

app.use('/movies', moviesRouter)

app.disable('x-powered-by')

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`))
