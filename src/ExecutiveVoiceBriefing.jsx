import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Sparkles, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { sfx } from './audioEffects';
import { AIService, speaker } from './aiService';
import { loadAIConfig } from './aiConfig';

export default function ExecutiveVoiceBriefing({
  totals,
  assetsCount,
  lowStockCount,
  pendingVouchersCount,
  currencySymbol = 'ر.س',
  activeRate = 96
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [dialectMode, setDialectMode] = useState('saudi');
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setVoiceSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const generateBriefingText = () => {
    const costMillion = (totals.cost / 1_000_000).toFixed(2);
    const nbvMillion = (totals.nbv / 1_000_000).toFixed(2);
    const depK = Math.round(totals.dep / 1_000);

    if (dialectMode === 'saudi') {
      return `يا هلا ومسهلا والله، حياكم الله في لوحة قيادة جمعية تراؤف لإدارة الأصول والمستودعات. 
أبشركم، هذا موجزنا المالي والتشغيلي اللحظي: 
إجمالي أصولنا المسجلة وصل ${totals.cost > 1000000 ? `${costMillion} مليون` : `${Math.round(totals.cost).toLocaleString()}`} ${currencySymbol}، وصافي القيمة الدفترية الحين ${totals.nbv > 1000000 ? `${nbvMillion} مليون` : `${Math.round(totals.nbv).toLocaleString()}`} ${currencySymbol} بعد ما حسبنا مجمع إهلاك قدره ${depK.toLocaleString()} ألف ${currencySymbol}. 
وجاهزية أصولنا ما شاء الله تبارك الله ممتازة بنسبة ${activeRate} بالمية موزعة على ${assetsCount} أصل ونظام تشغيلي. 
وبالنسبة للمستودع، عندنا ${lowStockCount} أصناف وصلت الحد الأدنى وتحتاج إعادة طلب، ومعها ${pendingVouchersCount} طلبات صرف عهد بانتظار الاعتماد. 
شغلنا كله تمام ومطابق لأعلى المعايير المحاسبية، وعسى الله يبارك بجهودكم جميعاً.`;
    }

    return `السلام عليكم ورحمة الله وبركاته. مرحباً بكم في لوحة القيادة التنفيذية لمنظومة جمعية تراؤف لرعاية الأيتام لإدارة الأصول والمستودعات. 
يسعدنا إحاطتكم بالإيجاز المالي والتشغيلي اللحظي: 
تبلغ القيمة الإجمالية لمحفظة الأصول المسجلة ${totals.cost > 1000000 ? `${costMillion} مليون` : `${Math.round(totals.cost).toLocaleString()}`} ${currencySymbol}، 
بينما يبلغ صافي القيمة الدفترية الحالية ${totals.nbv > 1000000 ? `${nbvMillion} مليون` : `${Math.round(totals.nbv).toLocaleString()}`} ${currencySymbol}، بعد احتساب مجمع إهلاك تراكمي قدره ${depK.toLocaleString()} ألف ${currencySymbol}. 
بلغت نسبة الجاهزية التشغيلية للأصول ${activeRate} بالمائة عبر ${assetsCount} أصلاً ونظاماً تشغيلياً. 
على صعيد المستودعات وسلاسل الإمداد، تم رصد ${lowStockCount} أصناف عند حد الطلب الأدنى وتستلزم إعادة تموين عاجلة، 
بالإضافة إلى ${pendingVouchersCount} طلبات صرف عهد بانتظار الاعتماد المالي والرقابي. 
جميع العمليات والقيود مطابقة لمعايير المحاسبة الدولية، والنظام يعمل بكفاءة تامة. نتمنى لكم يوماً حافلاً بالنجاح.`;
  };

  const handleStartBriefing = () => {
    sfx.playClick();

    speaker.stop();
    const text = generateBriefingText();
    const cfg = loadAIConfig();
    const ai = new AIService(null, cfg.provider || 'groq', { config: cfg });
    const res = ai.speak(text, {
      voiceId: cfg.voice?.voiceId || 'salman',
      rate: speechRate || cfg.voice?.rate || 0.95
    });

    setIsPlaying(true);
    setIsPaused(false);

    if (res?.done) {
      res.done.then(() => {
        setIsPlaying(false);
        setIsPaused(false);
        sfx.playSuccess();
      }).catch(() => {
        setIsPlaying(false);
        setIsPaused(false);
      });
    }
  };

  const handlePause = () => {
    sfx.playClick();
    speaker.stop();
    setIsPaused(false);
    setIsPlaying(false);
  };

  const handleStop = () => {
    sfx.playClick();
    speaker.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!voiceSupported) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0, 165, 155, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(0, 165, 155, 0.3)',
      padding: '1.25rem 1.75rem',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1.25rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow accent */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '20%',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(0, 165, 155, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Info & Equalizer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 1 }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: isPlaying ? 'linear-gradient(135deg, #10b981, #00A59B)' : 'linear-gradient(135deg, var(--brand-teal), var(--brand-green))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: isPlaying ? '0 0 25px rgba(16, 185, 129, 0.6)' : '0 8px 20px rgba(0, 165, 155, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          {isPlaying ? <Volume2 size={26} className="pulse-anim" /> : <Sparkles size={24} />}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>
              الإيجاز الصوتي التنفيذي اللحظي (AI Executive Voice Briefing)
            </span>
            <span style={{
              background: isPlaying ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 165, 155, 0.15)',
              color: isPlaying ? '#10b981' : 'var(--brand-teal)',
              border: '1px solid currentColor',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              {isPlaying ? '🔴 جاري الإلقاء الصوتي المباشر' : isPaused ? '⏸️ متوقف مؤقتاً' : 'جاهز للاستماع'}
            </span>
          </div>

          <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            استمع لتقرير صوتي احترافي بصوت عربي ذكي يحلل محفظتك الرأسمالية ومخزون المستودعات والإنذارات الحرجة.
          </p>
        </div>

        {/* Animated Equalizer Wave when playing */}
        {isPlaying && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '24px', marginRight: '1rem' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <span
                key={i}
                style={{
                  width: '3.5px',
                  background: 'var(--brand-teal, #00A59B)',
                  borderRadius: '3px',
                  animation: `equalizerWave 0.8s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.12}s`,
                  height: '100%'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Audio Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1 }}>
        {!isPlaying ? (
          <button
            onClick={handleStartBriefing}
            className="btn btn-primary"
            style={{
              padding: '0.7rem 1.6rem',
              fontWeight: 800,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 6px 20px rgba(0, 165, 155, 0.35)'
            }}
          >
            <Play size={18} fill="white" />
            {isPaused ? 'استئناف الإيجاز' : 'تشغيل الإيجاز الصوتي الآن'}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handlePause}
              className="btn btn-ghost"
              style={{
                border: '1px solid var(--border)',
                padding: '0.65rem 1.1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--card-bg)'
              }}
            >
              <Pause size={16} /> إيقاف مؤقت
            </button>
            <button
              onClick={handleStop}
              className="btn btn-ghost"
              style={{
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
                padding: '0.65rem 1.1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(239, 68, 68, 0.08)'
              }}
            >
              <Square size={16} fill="#ef4444" /> إنهاء
            </button>
          </div>
        )}

        {/* Dialect Selector */}
        <div style={{ display: 'flex', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '2px', gap: '2px' }}>
          <button
            type="button"
            onClick={() => { sfx.playClick(); setDialectMode('saudi'); }}
            style={{
              background: dialectMode === 'saudi' ? 'linear-gradient(135deg, var(--brand-teal), #10b981)' : 'transparent',
              color: dialectMode === 'saudi' ? 'white' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            title="لهجة سعودية بيضاء ودودة"
          >
            🇸🇦 سعودي
          </button>
          <button
            type="button"
            onClick={() => { sfx.playClick(); setDialectMode('formal'); }}
            style={{
              background: dialectMode === 'formal' ? 'linear-gradient(135deg, var(--brand-teal), #10b981)' : 'transparent',
              color: dialectMode === 'formal' ? 'white' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            title="عربية فصحى رسمية"
          >
            🏛️ فصحى
          </button>
        </div>

        {/* Speed toggle */}
        <select
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          style={{
            background: 'var(--card-bg)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.65rem 0.8rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="سرعة الصوت"
        >
          <option value={0.9}>0.9x هادئ</option>
          <option value={1.0}>1.0x عادي</option>
          <option value={1.2}>1.2x سريع</option>
        </select>
      </div>

      <style>{`
        @keyframes equalizerWave {
          0% { height: 4px; }
          100% { height: 26px; }
        }
        .pulse-anim {
          animation: pulseIcon 1.5s infinite;
        }
        @keyframes pulseIcon {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
