<script lang="ts">
import LanguageSwitcher from '@unofficial-krds/svelte/language-switcher';
import { localParam } from './shared';
// Each option links to this same example page in the other language, so choosing English really shows the English page.
const locale = new URL(location.href).searchParams.get('lang') === 'en' ? 'en' : 'ko';
</script>
<LanguageSwitcher currentLocale={locale} options={[{ locale: 'ko', nativeLabel: '한국어', translatedLabel: '한국어', href: localParam('lang', 'ko') }, { locale: 'en', nativeLabel: 'English', translatedLabel: '영어', href: localParam('lang', 'en') }]} />
<p lang={locale}>{locale === 'ko' ? '한국어 예제' : 'English example'}</p>
