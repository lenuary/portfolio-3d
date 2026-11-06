export interface HomeHighlight {
  icon: string;
  label: string;
  kind: "location" | "stack" | "current-work";
}

export const homeData = {
  greeting: "Hello, 👋",
  namePrefix: "I am ",
  name: "Łukasz",
  role: "Full-Stack Developer | GameDev Enthusiast",
  introParagraphs: [
    "I build web applications and tools that are fast, easy to use, and thoughtfully designed.",
    "I work with Vue, Nuxt, and Firebase, connecting frontend and backend to turn ideas into useful applications.",
  ],
  highlights: [
    { icon: "📍", label: "Poland", kind: "location" },
    { icon: "</>", label: "Vue / Nuxt / Unity", kind: "stack" },
    { icon: "🚀", label: "Currently building AI and web projects.", kind: "current-work" },
  ] satisfies HomeHighlight[],
};
