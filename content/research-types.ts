export type V3ResearchSection = { id: string; heading: string; paragraphs: string[] }
export type V3ResearchReport = { slug: string; title: string; summary: string; seoSummary?: string; publishedAt: string; sections: V3ResearchSection[] }
export type V3Methodology = { slug: 'difficulty-index'; sections: V3ResearchSection[] }
