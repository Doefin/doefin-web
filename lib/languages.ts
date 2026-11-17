export const languages = {
  en: { tag: 'en-GB', openGraph: 'en_GB', name: 'English', code: 'EN', path: '/en', flag: 'gb' },
  spn: { tag: 'es', openGraph: 'es_ES', name: 'Español', code: 'ES', path: '/spn', flag: 'es' },
  por: { tag: 'pt-BR', openGraph: 'pt_BR', name: 'Português', code: 'PT', path: '/por', flag: 'br' },
  chin: { tag: 'zh-Hans', openGraph: 'zh_CN', name: '简体中文', code: '中文', path: '/chin', flag: 'cn' },
} as const

export type Language = keyof typeof languages

export const homeAlternates = {
  'x-default': '/',
  'en-GB': '/',
  es: languages.spn.path,
  'pt-BR': languages.por.path,
  'zh-Hans': languages.chin.path,
}

export function formatMessage(message: string, values: Record<string, string | number>) {
  return message.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : placeholder,
  )
}
