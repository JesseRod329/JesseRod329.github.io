export interface Project {
  slug: string;
  title: string;
  date: string;
  roles: string[];
  collab: string;
  summary: string;
  stack: string[];
  links: {
    repo?: string;
    live?: string;
  };
  hidden?: boolean;
  gallery?: string[];
  image?: string;
}
