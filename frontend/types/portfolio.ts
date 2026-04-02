export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  imageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  published: boolean;
}

export interface Reference {
  id: string;
  name: string;
  role: string;
  company: string;
  comment: string;
  linkedIn?: string;
  featured: boolean;
  published: boolean;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  published: boolean;
}