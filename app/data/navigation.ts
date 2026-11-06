export const portfolioSections = [
  { id: "home", label: "Home", title: "Home", number: "01" },
  { id: "about", label: "About", title: "About me", number: "02" },
  { id: "projects", label: "Projects", title: "Projects", number: "03" },
  { id: "contact", label: "Contact", title: "Contact", number: "04" },
] as const;

export type SectionId = (typeof portfolioSections)[number]["id"];
