export interface NavLink {
  name: string;
  link: string;
}

export interface WordItem {
  text: string;
  imgPath: string;
}

export interface CounterItem {
  value: number;
  suffix: string;
  label: string;
}

export interface Ability {
  imgPath: string;
  title: string;
  desc: string;
}

export interface TechStackIcon {
  name: string;
  modelPath: string;
  scale: number;
  rotation: [number, number, number];
}

export interface ExpCard {
  review: string;
  imgPath: string;
  /** Height class for the card logo — logos differ in how much transparent
   *  padding they bake in, so they need per-asset sizing to look even. */
  imgHeightClass?: string;
  logoPath: string;
  company: string;
  title: string;
  date: string;
  responsibilities: string[];
}

export interface EducationCard {
  institution: string;
  qualification: string;
  date: string;
  review: string;
  logoPath: string;
  /** Height class for the logo inside its chip. These marks are dark artwork
   *  on transparent backgrounds with differing amounts of built-in padding,
   *  so each needs its own scale to read at the same size. */
  logoHeightClass?: string;
}

export interface SocialLink {
  name: string;
  imgPath: string;
  url: string;
}
