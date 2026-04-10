export class LocaleManager {
  private static currentLocale: 'zh-Hans' | 'zh-Hant' | 'en' = 'zh-Hans';

  static setLocale(flag: string) {
    if (flag === 'zht' || flag === 'zh-Hant' || flag === 'tw' || flag === 'hk') {
      this.currentLocale = 'zh-Hant';
    } else if (flag === 'en' || flag === 'english') {
      this.currentLocale = 'en';
    } else {
      this.currentLocale = 'zh-Hans';
    }
  }

  static getLocale() {
    return this.currentLocale;
  }

  static injectPrompt(): string {
    if (this.currentLocale === 'zh-Hant') {
      return "【重要提示】请使用繁体中文（zh-Hant）输出所有面向用户的解释、评语和反馈文本，切勿使用简体字。";
    }
    if (this.currentLocale === 'en') {
      return "【IMPORTANT】Please output all user-facing explanations, feedback, and diagnostic comments strictly in English.";
    }
    return "【重要提示】请使用简体中文（zh-Hans）输出解释与评语。";
  }
}
