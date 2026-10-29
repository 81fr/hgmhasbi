import EasySpeech from 'easy-speech';
import { cleanTextForSpeech } from './aiService.js';

/* ------------------------------------------------------------------ *
 *  مكتبة الأصوات المجانية ومحركات النطق المتقدمة (Traouf Voice Library)
 *  • مكتبة الاستوديو البشري المسجل (Human Studio Soundbank) — جودة نقية 100%
 *  • محرك EasySpeech مفتوح المصدر لإدارة أصوات المتصفح وعلاج مشاكل كروم
 *  • مواءمة نبرات الشخصيات (Pitch & Formant Modulation) وترتيب أولويات السحاب
 * ------------------------------------------------------------------ */

export const STUDIO_PERSONAS = {
  fahad: { id: 'fahad', label: 'فهد', gender: 'رجالي', tone: 'وقور ورسمي', file: 'audio/voices/fahad.mp3' },
  sultan: { id: 'sultan', label: 'سلطان', gender: 'رجالي', tone: 'واثق وحيوي', file: 'audio/voices/sultan.mp3' },
  salman: { id: 'salman', label: 'سلمان', gender: 'رجالي', tone: 'تنفيذي قيادي', file: 'audio/voices/salman.mp3' },
  majed: { id: 'majed', label: 'ماجد', gender: 'رجالي', tone: 'ميداني ودود', file: 'audio/voices/majed.mp3' },
  hamed: { id: 'hamed', label: 'حامد', gender: 'رجالي', tone: 'خبير مالي', file: 'audio/voices/hamed.mp3' },
  noura: { id: 'noura', label: 'نورة', gender: 'نسائي', tone: 'دافئ وواضح', file: 'audio/voices/noura.mp3' },
  sara: { id: 'sara', label: 'سارة', gender: 'نسائي', tone: 'ذكي ومتحمس', file: 'audio/voices/sara.mp3' },
  lulwa: { id: 'lulwa', label: 'لولوة', gender: 'نسائي', tone: 'ناعم ودقيق', file: 'audio/voices/lulwa.mp3' },
  aisha: { id: 'aisha', label: 'عائشة', gender: 'نسائي', tone: 'مهني وواثق', file: 'audio/voices/aisha.mp3' },
  reem: { id: 'reem', label: 'ريم', gender: 'نسائي', tone: 'تنفيذي راقي', file: 'audio/voices/reem.mp3' }
};

export const STUDIO_DIALECTS = {
  white: { id: 'white', label: 'سعودي أبيض', file: 'audio/voices/dialect_white.mp3' },
  najdi: { id: 'najdi', label: 'نجدي أصيل', file: 'audio/voices/dialect_najdi.mp3' },
  hijazi: { id: 'hijazi', label: 'حجازي ودود', file: 'audio/voices/dialect_hijazi.mp3' },
  eastern: { id: 'eastern', label: 'شرقاوي حساوي', file: 'audio/voices/dialect_eastern.mp3' },
  southern: { id: 'southern', label: 'جنوبي مرحب', file: 'audio/voices/dialect_southern.mp3' },
  northern: { id: 'northern', label: 'شمالي كرم', file: 'audio/voices/dialect_northern.mp3' },
  gulf: { id: 'gulf', label: 'خليجي تنفيذي', file: 'audio/voices/dialect_gulf.mp3' },
  formal: { id: 'formal', label: 'فصحى إدارية سعودية', file: 'audio/voices/dialect_formal.mp3' }
};

export const PERSONA_MODULATION = {
  fahad: { pitch: 0.95, rate: 0.95 },
  sultan: { pitch: 1.15, rate: 1.05 },
  salman: { pitch: 0.82, rate: 0.90 },
  majed: { pitch: 1.05, rate: 1.00 },
  hamed: { pitch: 0.92, rate: 0.92 },
  noura: { pitch: 1.02, rate: 0.98 },
  sara: { pitch: 1.15, rate: 1.05 },
  lulwa: { pitch: 0.90, rate: 0.90 },
  aisha: { pitch: 0.98, rate: 0.98 },
  reem: { pitch: 1.05, rate: 0.95 }
};

let easySpeechInitialized = false;
let currentAudioElement = null;

/** يُنشئ المسار الدقيق لملفات الصوت مع مراعاة مسار GitHub Pages */
export function getStudioAudioUrl(relativePath) {
  const base = import.meta.env?.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : base + '/';
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${cleanBase}${cleanPath}`;
}

/** تهيئة مكتبة EasySpeech بشكل آمن في المتصفح */
export async function initVoiceLibrary() {
  if (typeof window === 'undefined') return false;
  if (easySpeechInitialized) return true;

  try {
    const ok = await EasySpeech.init({ maxTimeout: 4000, interval: 200 });
    easySpeechInitialized = ok;
    return ok;
  } catch (err) {
    console.warn('EasySpeech init warning:', err);
    return false;
  }
}

/** إيقاف أي تشغيل صوتي حالي */
export function stopAllSpeech() {
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch (e) { /* ignore */ }
    currentAudioElement = null;
  }

  try {
    EasySpeech.cancel();
  } catch (e) { /* ignore */ }

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  }
}

/** تشغيل مقطع استوديو بشري مسجل بجودة نقية 100% فورية */
export function playStudioAudio(filePath, { rate = 1.0, onEnd } = {}) {
  stopAllSpeech();
  const url = getStudioAudioUrl(filePath);

  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(url);
      currentAudioElement = audio;
      audio.playbackRate = Math.max(0.7, Math.min(1.5, rate));

      audio.onended = () => {
        currentAudioElement = null;
        if (onEnd) onEnd();
        resolve(true);
      };

      audio.onerror = (e) => {
        currentAudioElement = null;
        console.warn('Studio audio playback error for:', url, e);
        reject(new Error('Audio load error'));
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          currentAudioElement = null;
          console.warn('Audio play restricted by browser policy:', err);
          reject(err);
        });
      }
    } catch (err) {
      reject(err);
    }
  });
}

/** تشغيل استوديو لشخصية محددة */
export function playPersonaStudio(voiceId, options = {}) {
  const persona = STUDIO_PERSONAS[voiceId] || STUDIO_PERSONAS.fahad;
  return playStudioAudio(persona.file, options);
}

/** تشغيل استوديو لعينة لهجة محددة */
export function playDialectStudio(dialectId, options = {}) {
  const dialect = STUDIO_DIALECTS[dialectId] || STUDIO_DIALECTS.white;
  return playStudioAudio(dialect.file, options);
}

import { norm } from './aiConfig.js';

/** مكتبة الإجابات السريعة المسجلة استوديو فائق النقاء للإجابة الفورية بدون استهلاك حصص */
export const STUDIO_QA_ANSWERS = {
  warehouse: {
    id: 'warehouse',
    label: 'المستودع والنواقص',
    male: 'audio/voices/answer_warehouse_male.mp3',
    female: 'audio/voices/answer_warehouse_female.mp3',
    salman: 'audio/voices/answer_warehouse_salman.mp3',
    questions: ['وضع المستودع والنواقص', 'المستودع والنواقص', 'وش وضع المستودع', 'نواقص المستودع', 'نواقص المخزون', 'تقرير المستودع'],
    answerPhrases: ['المستودع وضعه ممتاز ومستقر', 'ورق التصوير', 'عشرون صنفا برصيد الفين وخمس مئة وحدة', 'صنف واحد فقط وصل لحد اعادة الطلب']
  },
  assets: {
    id: 'assets',
    label: 'قيمة الأصول الثابتة',
    male: 'audio/voices/answer_assets_male.mp3',
    female: 'audio/voices/answer_assets_female.mp3',
    salman: 'audio/voices/answer_assets_salman.mp3',
    questions: ['كم الاصول الثابتة', 'الاصول الثابتة وقيمتها', 'قيمة الاصول الثابتة', 'كم عدد الاصول الثابتة', 'اجمالي الاصول'],
    answerPhrases: ['476 اصلا بتكلفة اجمالية 110.19 مليون', 'الاصول الثابتة عندنا 476 اصلا', '110.19 مليون']
  },
  custody: {
    id: 'custody',
    label: 'أكثر موظف عنده عهد',
    male: 'audio/voices/answer_custody_male.mp3',
    female: 'audio/voices/answer_custody_female.mp3',
    salman: 'audio/voices/answer_custody_salman.mp3',
    questions: ['اكثر موظف عنده عهد', 'مين اكثر موظف عنده عهد', 'اكثر موظف عهدة', 'من اكثر موظف عهدا', 'صاحب اكثر عهدة'],
    answerPhrases: ['نواف عبيد ذياب الحربي ب 107 عهدة', 'اكثر موظف عنده عهدة هو نواف عبيد', '107 عهدة مسجلة وموثقة']
  },
  journals: {
    id: 'journals',
    label: 'توازن قيود اليومية',
    male: 'audio/voices/answer_journals_male.mp3',
    female: 'audio/voices/answer_journals_female.mp3',
    salman: 'audio/voices/answer_journals_salman.mp3',
    questions: ['هل القيود متوازنة', 'قيود متوازنة', 'توازن قيود اليومية', 'القيود اليومية متوازنة', 'هل قيودنا متوازنة'],
    answerPhrases: ['قيود اليومية متوازنة تماما والمدين يطابق الدائن', 'المدين يطابق الدائن بنسبة مئة في المئة']
  },
  register: {
    id: 'register',
    label: 'فتح سجل الأصول',
    male: 'audio/voices/answer_register_male.mp3',
    female: 'audio/voices/answer_register_female.mp3',
    salman: 'audio/voices/answer_register_salman.mp3',
    questions: ['افتح لي سجل الاصول', 'افتح سجل الاصول', 'سجل الاصول الثابتة', 'اعرض سجل الاصول'],
    answerPhrases: ['تم فتح سجل الاصول الثابتة', 'سجل الاصول الثابتة وتقدر تطلع']
  },
  role: {
    id: 'role',
    label: 'مهام المستشار التنفيذي',
    male: 'audio/voices/answer_role_salman.mp3',
    female: 'audio/voices/answer_role_salman.mp3',
    salman: 'audio/voices/answer_role_salman.mp3',
    questions: ['ما هي مهامك', 'ماهي مهامك', 'وش مهامك', 'من انت', 'تعريف بنفسك', 'عرفنا بنفسك', 'مهامك يا سلمان'],
    answerPhrases: ['مرحبا بكم طال عمركم انا سلمان مستشاركم التنفيذي', 'مهمتي تحليل محفظة الاصول والعهد ومراقبة توازن القيود']
  }
};

/** دالة فحص وتحديد ما إذا كان السؤال أو الإجابة يطابق بنك أصوات الاستوديو البشري */
export function findMatchingQA(text = '', question = '') {
  const normQ = question ? norm(question) : '';
  const normA = text ? norm(text) : '';

  // 1. الأولوية الأولى: مطابقة السؤال الصريح إذا تم تمريره
  if (normQ) {
    for (const key of Object.keys(STUDIO_QA_ANSWERS)) {
      const item = STUDIO_QA_ANSWERS[key];
      if (item.questions.some(q => normQ.includes(norm(q)))) {
        return key;
      }
    }
  }

  // 2. فحص ما إذا كان النص المنطوق نفسه يمثل السؤال (بشرط ألا يتجاوز طوله 60 حرفاً لمنع مطابقة النصوص الطويلة أو الإيجازات)
  if (normA && normA.length < 60) {
    for (const key of Object.keys(STUDIO_QA_ANSWERS)) {
      const item = STUDIO_QA_ANSWERS[key];
      if (item.questions.some(q => normA.includes(norm(q)))) {
        return key;
      }
    }
  }

  // 3. مطابقة العبارات المفتاحية الفريدة للإجابة المحددة حصراً (بدون كلمات عامة كالمخزون أو أصناف)
  for (const key of Object.keys(STUDIO_QA_ANSWERS)) {
    const item = STUDIO_QA_ANSWERS[key];
    if (item.answerPhrases.some(phrase => normA.includes(norm(phrase)))) {
      return key;
    }
  }

  return null;
}

/** تشغيل إجابة استوديو سريعة بصوت بشري أصيل ومناسب للشخصية المختارة */
export function playQAStudio(qaKey, { voiceId = 'salman', rate = 1.0, onEnd } = {}) {
  const qa = STUDIO_QA_ANSWERS[qaKey];
  if (!qa) return Promise.reject(new Error('Unknown QA key'));
  
  if (voiceId === 'salman' && qa.salman) {
    return playStudioAudio(qa.salman, { rate, onEnd });
  }

  const isFemale = ['noura', 'sara', 'lulwa', 'aisha', 'reem'].includes(voiceId);
  const file = isFemale ? qa.female : (qa[voiceId] || qa.male);
  return playStudioAudio(file, { rate, onEnd });
}

/** جلب جميع الأصوات المجانية المتاحة للمتصفح مصنفة حسب الجودة */
export function getAvailableVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  try {
    const list = EasySpeech.voices() || window.speechSynthesis.getVoices() || [];
    return list.map(v => {
      const name = v.name || '';
      const isNatural = name.includes('Natural') || name.includes('Online') || name.includes('Neural');
      const isArabic = (v.lang || '').toLowerCase().startsWith('ar');
      return {
        name: v.name,
        lang: v.lang,
        isArabic,
        isNatural,
        voiceURI: v.voiceURI,
        tier: isNatural ? 'سحابي طبيعي (Natural Cloud)' : (isArabic ? 'محلي معياري (Local SAPI)' : 'أخرى')
      };
    });
  } catch (e) {
    return [];
  }
}

/** اختيار أفضل صوت عربي طبيعي في المتصفح — تم حظره نهائياً للقضاء التام والنهائي على صوت الرجل الآلي والمحافظة على الأصوات البشرية المسجلة فقط */
export function pickBestBrowserVoice(voiceId = 'fahad') {
  // منع قاطع لأي محرك صوتي داخلي للمتصفح لتفادي أي نبرة ميكانيكية أو صوت رجل آلي
  return null;
}

/** التحدث باستخدام مكتبة EasySpeech المتقدمة — مع ضمان عدم استخدام أي صوت آلي ميكانيكي */
export async function speakEasySpeech(text, { voiceId = 'fahad', rate = 1.0, onStart, onEnd } = {}) {
  await initVoiceLibrary();
  stopAllSpeech();

  const clean = cleanTextForSpeech(text);
  if (!clean) return false;

  const targetVoice = pickBestBrowserVoice(voiceId);
  if (!targetVoice) {
    // لا يتوفر صوت طبيعي، نتجنب الصوت الآلي ونُرجع فشلاً للتحول للبديل البشري الاستوديو
    throw new Error('No natural neural browser voice available');
  }

  const mod = PERSONA_MODULATION[voiceId] || { pitch: 1.0, rate: 1.0 };
  const effectiveRate = Math.max(0.7, Math.min(1.4, (rate || 1.0) * mod.rate));
  const effectivePitch = Math.max(0.6, Math.min(1.6, mod.pitch));

  try {
    if (onStart) onStart();
    await EasySpeech.speak({
      text: clean,
      voice: targetVoice,
      rate: effectiveRate,
      pitch: effectivePitch,
      volume: 1.0
    });
    if (onEnd) onEnd();
    return true;
  } catch (err) {
    console.warn('EasySpeech synthesis error:', err);
    if (onEnd) onEnd();
    throw err;
  }
}
