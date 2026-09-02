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

export interface LogoIcon {
  imgPath: string;
}

export interface Ability {
  imgPath: string;
  title: string;
  desc: string;
}

export interface TechStackImg {
  name: string;
  imgPath: string;
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
  logoPath: string;
  title: string;
  date: string;
  responsibilities: string[];
}

export interface ExpLogo {
  name: string;
  imgPath: string;
}

export interface Testimonial {
  name: string;
  mentions: string;
  review: string;
  imgPath: string;
}

export interface SocialImg {
  name: string;
  imgPath: string;
}
