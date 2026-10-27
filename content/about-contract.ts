export const aboutId = 'about-doefin'
export const aboutAnchor = (heading: string) => heading.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
export const aboutSectionAnchor = (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && !['main', 'v3-mobile-menu', 'article-body'].includes(value) && !value.startsWith('v3-navigation-')
