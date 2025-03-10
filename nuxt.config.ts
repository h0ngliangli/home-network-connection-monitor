// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  nitro: {
    experimental: {
      database: true,
    },
  },
  app: {
    head: {
      title: "Home network monitor",
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  devServer: {
    port: 3001,
  }
})
