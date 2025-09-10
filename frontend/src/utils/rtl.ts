/**
 * RTL language support utilities
 */

export const RTLLanguages = ['ar', 'he', 'fa', 'ur'] as const;
type RTLLanguage = typeof RTLLanguages[number];

/** Check if language is RTL */
export const isRTL = (lang: string): lang is RTLLanguage => 
  (RTLLanguages as readonly string[]).includes(lang);

/** Get text direction */
export const getTextDirection = (lang: string): 'rtl' | 'ltr' =>
  isRTL(lang) ? 'rtl' : 'ltr';

/** Apply direction to document */
export const applyTextDirection = (lang: string): void => {
  const dir = getTextDirection(lang);
  const html = document.documentElement;
  
  html.dir = dir;
  html.lang = lang;
  html.classList.toggle('rtl', dir === 'rtl');
  html.classList.toggle('ltr', dir !== 'rtl');
};

/** Get margin/padding direction */
export const getSpacing = (dir: 'ltr' | 'rtl', type: 'm' | 'p' = 'm') => 
  dir === 'rtl' ? { [`${type}r`]: 'auto' } : { [`${type}l`]: 'auto' };

/** Get start/end for flexbox */
export const getFlexDirection = (dir: 'ltr' | 'rtl') => ({
  start: dir === 'rtl' ? 'flex-end' : 'flex-start',
  end: dir === 'rtl' ? 'flex-start' : 'flex-end'
});
