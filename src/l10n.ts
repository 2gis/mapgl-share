
import locales from '../locales/index';


const defaultLocale = 'en';

export function l (s: string, locale = defaultLocale) {
    return s.replace(/%(\S+)%/g, (_, v) => locales[v]?.[locale] ?? locales[v]?.[defaultLocale] ?? v);
}