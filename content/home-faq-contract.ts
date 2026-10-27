export const faqText = (v: unknown): v is string => typeof v === 'string' && !!v.trim() && !/[\u0000-\u001f\u007f]/.test(v)
export const safeFaqHref = (v: unknown): v is string => typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && !/[\\\u0000-\u0020]/.test(v) && !/%(?:2f|5c|2e)/i.test(v) && !/(?:^|\/)\.\.?\//.test(v)
