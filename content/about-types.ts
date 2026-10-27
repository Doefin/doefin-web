import type { Author } from './authors'

export type AboutSection = { id: string; heading: string; paragraphs: string[] }
export type AboutContent = { sections: AboutSection[]; author: Author }
