interface SocialLink {
  name: string;
  url: string;
  icon: "github" | "linkedin";
}

export const contactData = {
  description:
    "Have a project in mind, want to work together, or just want to say hello? Send me a message.",
  email: "lenuarykontakt@gmail.com",
  location: "Poland",
  status: "Available for work",
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/lenuary",
      icon: "github",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: "linkedin",
    },
  ] satisfies SocialLink[],
};
