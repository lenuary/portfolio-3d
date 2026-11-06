export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      // Styles use flat selectors; the Tailwind module's nesting plugin is unnecessary.
      "tailwindcss/nesting": false,
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: "Łukasz | Full-stack developer",
      meta: [
        {
          name: "description",
          content:
            "Web applications, Unity games and interactive 3D projects by Łukasz, a full-stack developer and IT student based in Poland.",
        },
      ],
    },
  },
});
