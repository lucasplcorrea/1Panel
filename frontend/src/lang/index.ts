import { createI18n } from 'vue-i18n';
import zh from './modules/zh';
import tw from './modules/tw';
import en from './modules/en';
import ptBr from './modules/pt-br';

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('lang') || 'en',
    fallbackLocale: 'en',
    globalInjection: true,
    messages: {
        zh,
        tw,
        en,
        'pt-br': ptBr,
    },
    warnHtmlMessage: false,
});

export default i18n;
