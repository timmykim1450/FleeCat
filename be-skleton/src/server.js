import 'dotenv/config'

import { createServer } from 'http'
import app from './app.js'


console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'OK' : 'MISSING')


const PORT = process.env.PORT || 8000

const server = createServer(app)
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
