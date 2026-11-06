export interface Project {
  title: string;
  category: string;
  description: string;
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  videoSources?: { src: string; type: "video/webm" | "video/mp4" }[];
  technologies: string[];
  sourceUrl: string;
  previewUrl: string;
}

export const projectsData = [
  {
    title: "Vue Jobs",
    category: "Frontend Development",
    description:
      "A Vue job board for browsing vacancies, saving listings and publishing offers. Built with reusable components, routing and CRUD operations.",
    imageSrc: "/images/projects/vue-jobs.webp",
    imageWidth: 960,
    imageHeight: 540,
    technologies: ["Vue.js", "JavaScript", "CRUD", "Frontend", "Netlify"],
    sourceUrl: "https://github.com/lenuary/my-vue-project",
    previewUrl: "https://vue-projecttest.netlify.app/",
  },
  {
    title: "EcoSnap",
    category: "Android Development",
    description:
      "An Android app for keeping track of groceries and reducing food waste. Scan products, check expiry dates and get reminders before food goes to waste.",
    imageSrc: "/images/projects/ecosnap.webp",
    imageWidth: 457,
    imageHeight: 475,
    technologies: ["Kotlin", "Android", "Jetpack Compose", "MVVM", "Google ML Kit"],
    sourceUrl: "https://github.com/lenuary/Ecosnap",
    previewUrl: "https://github.com/lenuary/Ecosnap",
  },
  {
    title: "Cyber Jumping",
    category: "Unity Game",
    description:
      "A 2D platformer made with Unity and C#, with custom levels, player movement and menus set in a pixel-art cyberpunk city.",
    imageSrc: "/images/projects/cyber-jumping-poster.webp",
    imageWidth: 800,
    imageHeight: 450,
    videoSources: [
      { src: "/images/projects/cyber-jumping.webm", type: "video/webm" },
      { src: "/images/projects/cyber-jumping.mp4", type: "video/mp4" },
    ],
    technologies: ["Unity", "C#", "Platformer", "Pixel Art", "Game Design"],
    sourceUrl: "https://github.com/lenuary/Cyber-Jumping-Unity-2D-Game",
    previewUrl: "https://github.com/lenuary/Cyber-Jumping-Unity-2D-Game",
  },
  {
    title: "3D Virtual Portfolio",
    category: "Interactive Web Application",
    description:
      "This portfolio: a Three.js room with holographic panels and animated camera transitions, built with Vue, Nuxt and GSAP.",
    imageSrc: "/images/projects/virtual-portfolio.webp",
    imageWidth: 960,
    imageHeight: 540,
    technologies: ["Vue 3", "Three.js", "GSAP", "Tailwind CSS", "TypeScript"],
    sourceUrl: "https://github.com/lenuary",
    previewUrl: "https://github.com/lenuary",
  },
] satisfies [Project, ...Project[]];
