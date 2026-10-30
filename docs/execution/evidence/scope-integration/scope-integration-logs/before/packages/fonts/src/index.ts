/** Official, unmodified Pretendard GOV assets. Import @krds-native/fonts/fonts.css to opt in. */
export const pretendardGovFamily = 'Pretendard GOV' as const;
export const pretendardGovFontUrls = {
  regular: new URL('../fonts/PretendardGOV-Regular.woff2', import.meta.url).href,
  medium: new URL('../fonts/PretendardGOV-Medium.woff2', import.meta.url).href,
  bold: new URL('../fonts/PretendardGOV-Bold.woff2', import.meta.url).href,
} as const;
export const pretendardGovStylesheetUrl = new URL('../fonts.css', import.meta.url).href;
