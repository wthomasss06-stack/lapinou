// web/app/robots.ts
// Convention Next.js App Router — auto-servi sur /robots.txt.
// Les crawlers IA (GPTBot, ClaudeBot, PerplexityBot...) sont explicitement
// autorisés — c'est le levier GEO principal côté robots.txt : si ces bots
// sont bloqués, ChatGPT/Perplexity/Gemini ne peuvent pas indexer le site
// pour répondre aux questions sur Chez Florence.
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

const AI_CRAWLERS = [
  'GPTBot',            // OpenAI — indexation
  'ChatGPT-User',       // OpenAI — navigation pour le compte d'un utilisateur
  'OAI-SearchBot',      // OpenAI — recherche
  'ClaudeBot',          // Anthropic — indexation
  'Claude-User',        // Anthropic — navigation pour le compte d'un utilisateur
  'anthropic-ai',        // Anthropic — ancien user-agent, conservé par compatibilité
  'PerplexityBot',      // Perplexity
  'Google-Extended',    // Google — entraînement/aperçus IA (distinct de Googlebot, déjà autorisé)
  'Applebot-Extended',  // Apple Intelligence
  'CCBot',              // Common Crawl — alimente de nombreux entraînements LLM
  'Meta-ExternalAgent', // Meta AI
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/'] },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
