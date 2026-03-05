/** Interfaces de estado local de edição do painel Admin. */

export type AdminTab = "overview" | "projects" | "skills" | "experiences" | "messages" | "profile";

export interface ProfileData {
  id: number;
  bio: { pt: string; en: string };
}

export interface EditingProject {
  id?: number;
  titlePt: string;
  titleEn: string;
  slug: string;
  descriptionPt: string;
  descriptionEn: string;
  contentPt: string;
  contentEn: string;
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  techStack: string;
  featured: boolean;
}

export interface EditingSkill {
  id?: number;
  name: string;
  category: string;
  iconUrl: string;
  proficiency: number;
}

export interface EditingExperience {
  id?: number;
  company: string;
  rolePt: string;
  roleEn: string;
  startDate: string;
  endDate: string;
  descriptionPt: string;
  descriptionEn: string;
  achievementsPt: string;
  achievementsEn: string;
}

/** Estado inicial vazio para um novo projeto. */
export const EMPTY_PROJECT: EditingProject = {
  titlePt: "", titleEn: "", slug: "",
  descriptionPt: "", descriptionEn: "",
  contentPt: "", contentEn: "",
  imageUrl: "", githubUrl: "", liveUrl: "",
  techStack: "", featured: false,
};

/** Estado inicial vazio para uma nova experiência. */
export const EMPTY_EXPERIENCE: EditingExperience = {
  company: "", rolePt: "", roleEn: "", startDate: "", endDate: "",
  descriptionPt: "", descriptionEn: "", achievementsPt: "", achievementsEn: "",
};
