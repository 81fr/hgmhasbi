import EasySpeech from 'easy-speech';
import { cleanTextForSpeech } from './aiService.js';
import { bankFile, resolvePersonaId, PERSONA_VOICES } from './voiceTexts.js';

/* ------------------------------------------------------------------ *
 *  مكتبة الأصوات المجانية ومحركات النطق المتقدمة (Traouf Voice Library)
 *  • مكتبة الاستوديو البشري المسجل (Human Studio Soundbank) — جودة نقية 100%
 *  • محرك EasySpeech مفتوح المصدر لإدارة أصوات المتصفح وعلاج مشاكل كروم
 *  • مواءمة نبرات الشخصيات (Pitch & Formant Modulation) وترتيب أولويات السحاب
 * ------------------------------------------------------------------ */

export const STUDIO_PERSONAS = {
  fahad: { id: 'fahad', label: 'فهد', gender: 'رجالي', tone: 'وقور ورسمي', file: bankFile('fahad', 'sample') },
  sultan: { id: 'sultan', label: 'سلطان', gender: 'رجالي', tone: 'واثق وحيوي', file: bankFile('sultan', 'sample') },
  salman: { id: 'salman', label: 'سلمان', gender: 'رجالي', tone: 'تنفيذي قيادي', file: bankFile('salman', 'sample') },
  majed: { id: 'majed', label: 'ماجد', gender: 'رجالي', tone: 'ميداني ودود', file: bankFile('majed', 'sample') },
  hamed: { id: 'hamed', label: 'حامد', gender: 'رجالي', tone: 'خبير مالي', file: bankFile('hamed', 'sample') },
  noura: { id: 'noura', label: 'نورة', gender: 'نسائي', tone: 'دافئ وواضح', file: bankFile('noura', 'sample') },
  sara: { id: 'sara', label: 'سارة', gender: 'نسائي', tone: 'ذكي ومتحمس', file: bankFile('sara', 'sample') },
  lulwa: { id: 'lulwa', label: 'لولوة', gender: 'نسائي', tone: 'ناعم ودقيق', file: bankFile('lulwa', 'sample') },
  aisha: { id: 'aisha', label: 'عائشة', gender: 'نسائي', tone: 'مهني وواثق', file: bankFile('aisha', 'sample') },
  reem: { id: 'reem', label: 'ريم', gender: 'نسائي', tone: 'تنفيذي راقي', file: bankFile('reem', 'sample') }
};

/** عينات اللهجات — الملف يُحدَّد بحسب الشخصية المختارة (dialect_<key>) */
export const STUDIO_DIALECTS = {
  white: { id: 'white', label: 'سعودي أبيض' },
  najdi: { id: 'najdi', label: 'نجدي أصيل' },
  hijazi: { id: 'hijazi', label: 'حجازي ودود' },
  eastern: { id: 'eastern', label: 'شرقاوي حساوي' },
  southern: { id: 'southern', label: 'جنوبي مرحب' },
  northern: { id: 'northern', label: 'شمالي كرم' },
  gulf: { id: 'gulf', label: 'خليجي تنفيذي' },
  formal: { id: 'formal', label: 'فصحى إدارية سعودية' }
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

/** تشغيل عينة الشخصية المحددة بصوتها هي فقط */
export function playPersonaStudio(voiceId, options = {}) {
  return playStudioAudio(bankFile(resolvePersonaId(voiceId), 'sample'), options);
}

/** تشغيل عينة لهجة بصوت الشخصية المختارة (options.voiceId) */
export function playDialectStudio(dialectId, options = {}) {
  const dialect = STUDIO_DIALECTS[dialectId] || STUDIO_DIALECTS.white;
  return playStudioAudio(bankFile(resolvePersonaId(options.voiceId), `dialect_${dialect.id}`), options);
}

/** تشغيل الإيجاز التنفيذي بصوت الشخصية المختارة */
export function playBriefingStudio(voiceId, options = {}) {
  return playStudioAudio(bankFile(resolvePersonaId(voiceId), 'briefing'), options);
}

import { norm } from './aiConfig.js';

/** مكتبة الإجابات السريعة المسجلة استوديو فائق النقاء للإجابة الفورية بدون استهلاك حصص */
export const STUDIO_QA_ANSWERS = {
  warehouse: {
    id: 'warehouse',
    label: 'المستودع والنواقص',
    questions: ['وضع المستودع والنواقص', 'المستودع والنواقص', 'وش وضع المستودع', 'نواقص المستودع', 'نواقص المخزون', 'تقرير المستودع'],
    answerPhrases: ['المستودع وضعه ممتاز ومستقر', 'ورق التصوير', 'عشرون صنفا برصيد الفين وخمس مئة وحدة', 'صنف واحد فقط وصل لحد اعادة الطلب']
  },
  assets: {
    id: 'assets',
    label: 'قيمة الأصول الثابتة',
    questions: ['كم الاصول الثابتة', 'الاصول الثابتة وقيمتها', 'قيمة الاصول الثابتة', 'كم عدد الاصول الثابتة', 'اجمالي الاصول'],
    answerPhrases: ['476 اصلا بتكلفة اجمالية 110.19 مليون', 'الاصول الثابتة عندنا 476 اصلا', '110.19 مليون']
  },
  custody: {
    id: 'custody',
    label: 'أكثر موظف عنده عهد',
    questions: ['اكثر موظف عنده عهد', 'مين اكثر موظف عنده عهد', 'اكثر موظف عهدة', 'من اكثر موظف عهدا', 'صاحب اكثر عهدة'],
    answerPhrases: ['نواف عبيد ذياب الحربي ب 107 عهدة', 'اكثر موظف عنده عهدة هو نواف عبيد', '107 عهدة مسجلة وموثقة']
  },
  journals: {
    id: 'journals',
    label: 'توازن قيود اليومية',
    questions: ['هل القيود متوازنة', 'قيود متوازنة', 'توازن قيود اليومية', 'القيود اليومية متوازنة', 'هل قيودنا متوازنة'],
    answerPhrases: ['قيود اليومية متوازنة تماما والمدين يطابق الدائن', 'المدين يطابق الدائن بنسبة مئة في المئة']
  },
  register: {
    id: 'register',
    label: 'فتح سجل الأصول',
    questions: ['افتح لي سجل الاصول', 'افتح سجل الاصول', 'سجل الاصول الثابتة', 'اعرض سجل الاصول'],
    answerPhrases: ['تم فتح سجل الاصول الثابتة', 'سجل الاصول الثابتة وتقدر تطلع']
  },
  role: {
    id: 'role',
    label: 'تعريف المستشار الذكي ومهامه',
    questions: ['ما هي مهامك', 'ماهي مهامك', 'وش مهامك', 'من انت', 'تعريف بنفسك', 'عرفنا بنفسك', 'مهامك يا سلمان'],
    answerPhrases: ['مستشاركم الذكي في جمعية تراؤف', 'مهمتي تحليل محفظة الاصول والعهد ومراقبة توازن القيود']
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

/** تشغيل إجابة استوديو سريعة بصوت الشخصية المختارة فقط (لا استبدال بشخصية أخرى) */
export function playQAStudio(qaKey, { voiceId, rate = 1.0, onEnd } = {}) {
  if (!STUDIO_QA_ANSWERS[qaKey]) return Promise.reject(new Error('Unknown QA key'));
  return playStudioAudio(bankFile(resolvePersonaId(voiceId), `qa_${qaKey}`), { rate, onEnd });
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

/** اختيار أفضل صوت عربي طبيعي في المتصفح لمطابقة الشخصية — استبعاد الصوت الآلي الميكانيكي قطعياً */
export function pickBestBrowserVoice(voiceId = 'fahad') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = (typeof EasySpeech.voices === 'function' && EasySpeech.voices()) || window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;

  const isFemale = PERSONA_VOICES[voiceId]?.gender === 'female';

  // البحث حصراً عن الأصوات السحابية الطبيعية (Natural / Online / Neural)
  const naturalVoices = voices.filter(v => {
    const name = (v.name || '').toLowerCase();
    const lang = (v.lang || '').toLowerCase();
    const isAr = lang.startsWith('ar') || name.includes('arabic');
    const isNat = name.includes('natural') || name.includes('online') || name.includes('neural') || name.includes('cloud');
    const isRobotic = name.includes('naayf') || name.includes('desktop') || name.includes('sapi');
    return isAr && isNat && !isRobotic;
  });

  if (!naturalVoices.length) {
    // منع إرجاع أي صوت آلي ميكانيكي (مثل Microsoft Naayf)
    return null;
  }

  // 1. صوت نسائي طبيعي إن كانت الشخصية نسائية
  if (isFemale) {
    const naturalFemale = naturalVoices.find(v => {
      const n = (v.name || '').toLowerCase();
      return n.includes('zariyah') || n.includes('salma') || n.includes('fatima') || n.includes('noura');
    });
    if (naturalFemale) return naturalFemale;
  } else {
    const naturalMale = naturalVoices.find(v => {
      const n = (v.name || '').toLowerCase();
      return n.includes('hamed') || n.includes('shakir') || n.includes('fahed');
    });
    if (naturalMale) return naturalMale;
  }

  return naturalVoices[0] || null;
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
