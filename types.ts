
export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  role?: string;
  demoUrl?: string;
  sourceUrl?: string;
  imageUrl: string;
  colorScheme: string; // Tailwind gradient classes
}

export interface FileItem {
  name: string;
  icon: string;
  iconColor: string;
  isActive?: boolean;
}

export enum TabType {
  HOME = 'home.tsx',
  PROJECTS = 'projects.json',
  STYLE = 'style.css'
}
