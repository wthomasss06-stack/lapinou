/** @type {import('next').NextConfig} */
const path = require('path')
const fs = require('fs')

// Charger WAVE_NUMBER_NEXURA depuis le fichier d'environnement de la racine
const rootDir = path.resolve(__dirname, '..')
const envFile = process.env.NODE_ENV === 'production' && fs.existsSync(path.join(rootDir, '.env.production'))
  ? '.env.production'
  : '.env'

const envPath = path.join(rootDir, envFile)
let whatsappNumber = '2250701234567'

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8')
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('WAVE_NUMBER_NEXURA=')) {
      const parts = trimmed.split('=')
      if (parts.length > 1) {
        const val = parts.slice(1).join('=').split('#')[0].trim().replace(/['"]/g, '')
        if (val) {
          whatsappNumber = val
        }
      }
      break
    }
  }
}

const nextConfig = {
  env: {
    NEXT_PUBLIC_WHATSAPP: whatsappNumber,
  },
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
}

module.exports = nextConfig
