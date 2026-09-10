export type NewsCategory =
  | "Models"
  | "Features"
  | "Developer"
  | "Research"
  | "Creative";

export interface News {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  category: NewsCategory;
  url: string;
  image: string;
}