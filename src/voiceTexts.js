/* ------------------------------------------------------------------ *
 *  بيانات الصوت المركزية (مصدر الحقيقة الوحيد لكل النظام)
 *  • خريطة الشخصيات ← أصوات Edge العصبية (10 أصوات عربية مختلفة فعلاً)
 *  • نصوص بنك الاستوديو (الإيجاز، الإجابات السريعة، العينات)
 *  يُستخدم هذا الملف في المتصفح وفي سكربت توليد البنك (Node) معاً — بدون أي استيراد.
 * ------------------------------------------------------------------ */

/** كل شخصية = صوت Edge عصبي مستقل + ضبط نبرة/سرعة خفيف لتمييزها أكثر */
export const PERSONA_VOICES = {
  fahad:  { edge: 'ar-SA-HamedNeural',    gender: 'male',   pitch: 0,  rate: -0.03 },
  sultan: { edge: 'ar-AE-HamdanNeural',   gender: 'male',   pitch: 2,  rate: 0.06 },
  salman: { edge: 'ar-OM-AbdullahNeural', gender: 'male',   pitch: -6, rate: -0.08 },
  majed:  { edge: 'ar-KW-FahedNeural',    gender: 'male',   pitch: 0,  rate: 0 },
  hamed:  { edge: 'ar-QA-MoazNeural',     gender: 'male',   pitch: -2, rate: -0.04 },
  noura:  { edge: 'ar-KW-NouraNeural',    gender: 'female', pitch: 0,  rate: -0.02 },
  sara:   { edge: 'ar-AE-FatimaNeural',   gender: 'female', pitch: 3,  rate: 0.06 },
  lulwa:  { edge: 'ar-OM-AyshaNeural',    gender: 'female', pitch: -2, rate: -0.08 },
  aisha:  { edge: 'ar-SA-ZariyahNeural',  gender: 'female', pitch: 0,  rate: -0.03 },
  reem:   { edge: 'ar-QA-AmalNeural',     gender: 'female', pitch: 0,  rate: -0.03 }
};

export const DEFAULT_PERSONA = 'salman';

/** يحوّل أي معرّف إلى شخصية صحيحة (لا يخلط أبداً بين شخصية وأخرى) */
export function resolvePersonaId(id) {
  return PERSONA_VOICES[id] ? id : DEFAULT_PERSONA;
}

export const PERSONA_META = {
  fahad:  { label: 'فهد',    opener: 'يا هلا ومسهلا، معكم فهد مستشاركم المالي في جمعية تراؤف.' },
  sultan: { label: 'سلطان',  opener: 'يا هلا والله، معكم سلطان، أبشروا بالأخبار الطيبة!' },
  salman: { label: 'سلمان',  opener: 'مرحباً بكم طال عمركم، معكم سلمان المستشار التنفيذي بجمعية تراؤف.' },
  majed:  { label: 'ماجد',   opener: 'حيّاكم الله، معكم ماجد من الميدان في جمعية تراؤف.' },
  hamed:  { label: 'حامد',   opener: 'السلام عليكم، معكم حامد الخبير المحاسبي في جمعية تراؤف.' },
  noura:  { label: 'نورة',   opener: 'أهلاً وسهلاً بكم، معكم نورة من جمعية تراؤف.' },
  sara:   { label: 'سارة',   opener: 'مرحباً بكم، معكم سارة من جمعية تراؤف، وأخبارنا اليوم رائعة!' },
  lulwa:  { label: 'لولوة',  opener: 'يا هلا ومسهلا، معكم لولوة من جمعية تراؤف.' },
  aisha:  { label: 'عائشة',  opener: 'السلام عليكم، معكم عائشة مستشارة التدقيق المالي في جمعية تراؤف.' },
  reem:   { label: 'ريم',    opener: 'حيّاكم الله جميعاً، معكم ريم من جمعية تراؤف.' }
};

/** نص الإيجاز التنفيذي لكل شخصية */
export function briefingText(personaId) {
  const m = PERSONA_META[resolvePersonaId(personaId)];
  return `${m.opener} أستعرض معكم الإيجاز المالي والتشغيلي اللحظي: محفظة الأصول المسجلة وصلت مئة وعشرة ملايين وتسعة عشر ألف ريال، ونسبة صحة وموثوقية الأصول مئة بالمئة عبر أربع مئة وستة وسبعين أصلاً، والقيود اليومية متوازنة، والمستودع مستقر والعمليات منضبطة تماماً.`;
}

/** نصوص الإجابات السريعة المسجلة (تُولَّد بصوت كل شخصية) */
export function qaText(key, personaId) {
  const m = PERSONA_META[resolvePersonaId(personaId)];
  switch (key) {
    case 'warehouse':
      return 'المستودع وضعه ممتاز ومستقر، إجمالي الأصناف عشرون صنفاً برصيد ألفين وخمس مئة وحدة، ويوجد صنف واحد فقط وصل لحد إعادة الطلب وهو ورق التصوير، ولا توجد أي أصناف نافدة حالياً.';
    case 'assets':
      return 'الأصول الثابتة عندنا أربع مئة وستة وسبعون أصلاً، بتكلفة إجمالية مئة وعشرة ملايين وتسعة عشر ألف ريال سعودي.';
    case 'custody':
      return 'أكثر موظف عنده عهدة هو نواف عبيد ذياب الحربي، بمئة وسبع عهد مسجلة وموثقة.';
    case 'journals':
      return 'نعم، قيود اليومية متوازنة تماماً، والمدين يطابق الدائن بنسبة مئة في المئة.';
    case 'register':
      return 'أبشر، تم فتح سجل الأصول الثابتة، وتقدر تطلع على كل التفاصيل والبيانات الحين.';
    case 'role':
      return `مرحباً بكم، أنا ${m.label}، مستشاركم الذكي في جمعية تراؤف، مهمتي تحليل محفظة الأصول والعهد، ومراقبة توازن القيود والمستودعات، وتقديم التقارير.`;
    default:
      return '';
  }
}

export const QA_KEYS = ['warehouse', 'assets', 'custody', 'journals', 'register', 'role'];
export const DIALECT_KEYS = ['white', 'najdi', 'hijazi', 'eastern', 'southern', 'northern', 'gulf', 'formal'];

/** مسار ملف البنك (نسبي لمجلد public) */
export const BANK_BASE = 'audio/bank';
export function bankFile(personaId, name) {
  return `${BANK_BASE}/${resolvePersonaId(personaId)}/${name}.mp3`;
}
