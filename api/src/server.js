// api/src/server.js
const app    = require('./app')
const config = require('./config/env')

app.listen(config.port, () => {
  console.log(`🐇 rabbit-shop API — http://localhost:${config.port}`)
  console.log(`   Env: ${config.nodeEnv}`)
})

// Trigger restart: schema columns (stock/quantity) synchronized.

