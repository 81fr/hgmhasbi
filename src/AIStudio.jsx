import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Sparkles, BrainCircuit, Settings, Volume2, VolumeX, Play, Pause,
  CheckCircle, CheckCircle2, RotateCcw, Save, ShieldCheck, Zap, Activity, MessageSquare,
  Mic, Search, ChevronLeft, Sliders, Database, Link, ArrowRight,
  Check, AlertCircle, FileText, Upload, RefreshCw, BarChart3, HelpCircle,
  Trash2, Plus, File, Lock, CheckSquare, Square, X
} from 'lucide-react';
import {
  loadAIConfig, saveAIConfig, resetAIConfig, DIALECTS, CHAT_MODELS,
  VOICES, LENGTHS, TOOL_DEFS, NAV_PAGES, getUsageStats, clearUsageLog,
  dialectScore, DEFAULT_CONFIG, buildFullSystemPrompt, saudiGreeting
} from './aiConfig.js';
import { AIService, GROQ_MODELS } from './aiService.js';
import { sfx } from './audioEffects.js';

const AVATAR_ICONS = ['🤖', '🧠', '✨', '💬', '⚡', '💼', '🇸🇦', '🎯'];

export default function AIStudio({
  aiName, setAiName,
  aiSystemPrompt, setAiSystemPrompt,
  aiProvider = 'groq', setAiProvider,
  aiIcon = '🤖', setAiIcon,
  setIsChatOpen,
  setChatMessages,
  assets = [], employees = [], warehouseItems = [], journals = [], transfers = [],
  onNavigate, showToast
}) {
  const [config, setConfig] = useState(() => loadAIConfig());
  const [activeTab, setActiveTab] = useState('dialect');
  const [saveStatus, setSaveStatus] = useState('');
  const [audioTesting, setAudioTesting] = useState(false);
  const [previewInput, setPreviewInput] = useState('');
  const [previewHistory, setPreviewHistory] = useState([
    { role: 'assistant', content: 'يا هلا ومسهلا! أنا مستشارك الذكي بجمعية تراؤف. آمرني، وش تبي تعرف عن الأصول والعهد والمستودع اليوم؟ 😊' }
  ]);
  const [isPreviewTyping, setIsPreviewTyping] = useState(false);
  const [lastMeta, setLastMeta] = useState(null);
  const [usageStats, setUsageStats] = useState(() => getUsageStats());
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [activeVoiceEngine, setActiveVoiceEngine] = useState(null);
  const [ttsTermsRequired, setTtsTermsRequired] = useState(() => {
    try { return sessionStorage.getItem('traouf_tts_groq_state') === 'terms'; } catch (e) { return false; }
  });

  const chatScrollRef = useRef(null);
  const fileUploadRef = useRef(null);

  // Sync state if config changes externally
  useEffect(() => {
    const handleCfgChange = () => {
      const updated = loadAIConfig();
      setConfig(updated);
      setUsageStats(getUsageStats());
    };
    const handleTermsReq = () => setTtsTermsRequired(true);

    window.addEventListener('traouf-ai-config', handleCfgChange);
    window.addEventListener('traouf-tts-terms-required', handleTermsReq);
    return () => {
      window.removeEventListener('traouf-ai-config', handleCfgChange);
      window.removeEventListener('traouf-tts-terms-required', handleTermsReq);
    };
  }, []);

  const handleSaveAndPublish = () => {
    sfx.playSuccess();
    const updated = {
      ...config,
      publishedAt: new Date().toISOString(),
      revision: (config.revision || 0) + 1
    };
    saveAIConfig(updated);
    setConfig(updated);

    // 1. Sync name
    if (setAiName && updated.name) {
      setAiName(updated.name);
      localStorage.setItem('aiName', updated.name);
    }

    // 2. Sync icon
    const chosenIcon = updated.appearance?.icon || '🤖';
    if (setAiIcon) {
      setAiIcon(chosenIcon);
      localStorage.setItem('aiIcon', chosenIcon);
    }

    // 3. Sync provider
    if (setAiProvider && updated.provider) {
      setAiProvider(updated.provider);
      localStorage.setItem('aiProvider', updated.provider);
    }

    // 4. Rebuild full system prompt
    const liveData = {
      assets,
      employees,
      warehouseItems,
      journals,
      transfers
    };
    const newSystemPrompt = buildFullSystemPrompt(updated, liveData, 'ai-studio');
    if (setAiSystemPrompt) {
      setAiSystemPrompt(newSystemPrompt);
      localStorage.setItem('aiSystemPrompt', newSystemPrompt);
    }

    // 5. Update Chat Messages with authentic Saudi greeting
    const dialectObj = DIALECTS[updated.dialect] || DIALECTS.white;
    const greetingWord = saudiGreeting(updated);
    const welcomeMsg = `🇸🇦 ${greetingWord}! تم تفعيل ونشر «${updated.name || 'تراؤف AI'}» بنجاح بلهجة (${dialectObj.label}). كيف أقدر أخدمك اليوم في الأصول، العهد، المستودع، أو القيود المحاسبية؟ 😊`;

    if (setChatMessages) {
      setChatMessages([
        { role: 'bot', text: welcomeMsg }
      ]);
    }

    // Also update Live Playground on the right
    setPreviewHistory([
      { role: 'assistant', content: welcomeMsg }
    ]);

    // 6. IMMEDIATELY OPEN THE CHAT ASSISTANT ON SCREEN!
    if (setIsChatOpen) {
      setIsChatOpen(true);
    }

    // 7. User feedback
    setSaveStatus(`تم نشر وتفعيل «${updated.name}» بلهجة (${dialectObj.label}) بنجاح! تم فتح المساعد وتحديث المعاينة الحية.`);
    if (showToast) {
      showToast(`🚀 تم نشر وتفعيل المساعد «${updated.name}» بلهجة ${dialectObj.label}!`);
    }
    setTimeout(() => setSaveStatus(''), 8000);
  };

  const handleResetDefaults = () => {
    sfx.playWarning();
    if (window.confirm('هل أنت متأكد من إعادة ضبط استوديو الذكاء الاصطناعي للإعدادات الافتراضية؟')) {
      const reset = resetAIConfig();
      setConfig(reset);
      if (setAiName) setAiName(reset.name);
      if (setAiIcon) setAiIcon(reset.appearance?.icon || '🤖');
      if (showToast) showToast('🔄 تم استعادة الإعدادات الافتراضية');
    }
  };

  // Play audio sample in selected dialect
  const handleTestVoiceSample = (sampleText, customVoiceId) => {
    sfx.playClick();
    const effectiveVoiceId = customVoiceId || config.voice?.voiceId || 'fahad';
    const textToSpeak = sampleText || DIALECTS[config.dialect]?.samples?.[0] || 'أبشر بعزك، جميع الأرقام والبيانات في جمعية تراؤف محدثة وجاهزة.';
    setAudioTesting(true);

    try {
      const ai = new AIService(null, config.provider || 'groq', { config });
      const res = ai.speak(textToSpeak, {
        voiceId: effectiveVoiceId,
        rate: config.voice?.rate || 0.95
      });
      if (res) {
        if (res.engine) setActiveVoiceEngine(res.engine);
        if (res.done) {
          res.done.then(() => {
            setAudioTesting(false);
            if (res.engine) setActiveVoiceEngine(res.engine);
          }).catch(() => setAudioTesting(false));
        } else {
          setTimeout(() => setAudioTesting(false), 3500);
        }
      }
    } catch (e) {
      setAudioTesting(false);
    }
  };

  // Send message in Playground
  const handleSendPlaygroundMessage = async (textToSend) => {
    const q = (textToSend || previewInput).trim();
    if (!q || isPreviewTyping) return;

    sfx.playClick();
    setPreviewInput('');
    const newHistory = [...previewHistory, { role: 'user', content: q }];
    setPreviewHistory(newHistory);
    setIsPreviewTyping(true);

    setTimeout(() => {
      if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }, 50);

    const liveData = {
      assets,
      employees,
      warehouseItems,
      journals,
      transfers
    };

    try {
      const ai = new AIService(null, 'groq', {
        config,
        getData: () => liveData,
        onNavigate: (p) => {
          if (showToast) showToast(`🚀 [طلب المساعد] الانتقال إلى صفحة: ${NAV_PAGES[p] || p}`);
        }
      });

      const response = await ai.chat(newHistory, { enableTools: true, view: 'ai-studio' });
      setPreviewHistory(prev => [...prev, { role: 'assistant', content: response.content }]);
      setLastMeta({
        ms: response.ms,
        model: response.model,
        tools: response.tools || [],
        dialect: dialectScore(response.content)
      });
      setUsageStats(getUsageStats());
    } catch (err) {
      setPreviewHistory(prev => [
        ...prev,
        { role: 'assistant', content: `تعذر الرد: ${err.message || 'يرجى التأكد من الاتصال'}` }
      ]);
    } finally {
      setIsPreviewTyping(false);
      setTimeout(() => {
        if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }, 50);
    }
  };

  // Knowledge base document upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    sfx.playClick();

    const newDocs = files.map(file => ({
      id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      type: file.name.split('.').pop()?.toUpperCase() || 'DOCUMENT',
      uploadedAt: new Date().toLocaleDateString('ar-SA-u-nu-latn'),
      content: `لائحة معتمدة: ${file.name}. تم إدراجها ضمن المراجع الرسمية لجمعية تراؤف.`
    }));

    setConfig(prev => ({
      ...prev,
      knowledge: {
        ...prev.knowledge,
        docs: [...(prev.knowledge?.docs || []), ...newDocs]
      }
    }));

    if (showToast) showToast(`✅ تم إرفاق ${files.length} ملف بنجاح في قاعدة المعرفة`);
    if (fileUploadRef.current) fileUploadRef.current.value = '';
  };

  const handleRemoveDoc = (docId) => {
    sfx.playClick();
    setConfig(prev => ({
      ...prev,
      knowledge: {
        ...prev.knowledge,
        docs: (prev.knowledge?.docs || []).filter(d => d.id !== docId)
      }
    }));
    if (showToast) showToast('🗑️ تم إزالة المستند من قاعدة المعرفة');
  };

  // FAQ additions
  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) {
      if (showToast) showToast('⚠️ يرجى كتابة كل من السؤال والإجابة المعتمدة');
      return;
    }
    sfx.playClick();
    setConfig(prev => ({
      ...prev,
      knowledge: {
        ...prev.knowledge,
        faqs: [...(prev.knowledge?.faqs || []), { q: newFaqQ.trim(), a: newFaqA.trim() }]
      }
    }));
    setNewFaqQ('');
    setNewFaqA('');
    if (showToast) showToast('✅ تم إضافة السؤال المعتمد إلى قاعدة المعرفة');
  };

  const handleRemoveFaq = (index) => {
    sfx.playClick();
    setConfig(prev => ({
      ...prev,
      knowledge: {
        ...prev.knowledge,
        faqs: (prev.knowledge?.faqs || []).filter((_, idx) => idx !== index)
      }
    }));
  };

  // Tools toggle all
  const handleSelectAllTools = () => {
    sfx.playClick();
    const all = {};
    TOOL_DEFS.forEach(t => { all[t.name] = true; });
    setConfig(prev => ({ ...prev, tools: all }));
  };

  const handleDeselectAllTools = () => {
    sfx.playClick();
    const none = {};
    TOOL_DEFS.forEach(t => { none[t.name] = false; });
    setConfig(prev => ({ ...prev, tools: none }));
  };

  // Clear usage stats
  const handleClearUsage = () => {
    if (window.confirm('هل تريد بالتأكيد تفريغ سجل المحادثات والتحليلات بالكامل؟')) {
      sfx.playWarning();
      clearUsageLog();
      setUsageStats(getUsageStats());
      if (showToast) showToast('🧹 تم تفريغ سجل الاستخدام بنجاح');
    }
  };

  const DATA_SOURCES = [
    { key: 'assets', label: 'الأصول الثابتة', count: `${assets.length || 3961} أصل` },
    { key: 'custody', label: 'العهد الميدانية', count: `${assets.filter(a => String(a.id || '').toUpperCase().includes('CUST')).length || 1718} عهدة` },
    { key: 'warehouse', label: 'المستودع والمخزون', count: `${warehouseItems.length || 20} صنف` },
    { key: 'journals', label: 'قيود اليومية', count: `${journals.length || 17} قيد` },
    { key: 'transfers', label: 'التحويلات العينية', count: `${transfers.length || 12} حركة` },
    { key: 'employees', label: 'سجل الموظفين', count: `${employees.length || 262} موظف` }
  ];

  const TABS = [
    { id: 'dialect', label: 'اللهجة السعودية والشخصية', icon: <Bot size={17} /> },
    { id: 'models', label: 'النماذج والأدوات ومصادر البيانات', icon: <Sliders size={17} /> },
    { id: 'voice', label: 'الصوت والنطق السعودي', icon: <Volume2 size={17} /> },
    { id: 'knowledge', label: 'قاعدة المعرفة واللوائح', icon: <FileText size={17} /> },
    { id: 'analytics', label: 'الأداء ومصفوفة الأمان', icon: <Activity size={17} /> }
  ];

  return (
    <div className="view-anim" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 'calc(100vh - 120px)' }}>
      {/* Studio Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.18) 0%, rgba(30, 41, 59, 0.95) 100%)',
        border: '1px solid rgba(13, 148, 136, 0.35)',
        borderRadius: '20px',
        padding: '1.5rem 2rem',
        boxShadow: '0 12px 30px -10px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--brand-teal), #8b5cf6)',
            width: '58px',
            height: '58px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.8rem',
            boxShadow: '0 0 25px rgba(13, 148, 136, 0.5)'
          }}>
            {config.appearance?.icon || '🤖'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text)', margin: 0 }}>
                استوديو الذكاء الاصطناعي (Traouf AI Studio)
              </h2>
              <span style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '20px'
              }}>
                V5.5 • لهجة سعودية تفاعلية
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
              تخصيص اللهجة السعودية، أيقونة المساعد، مصادر البيانات الحية، الأدوات، ومحركات النطق الميداني.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ border: '1px solid var(--border)', fontSize: '0.85rem' }}
            onClick={handleResetDefaults}
            title="استعادة الإعدادات المعيارية"
          >
            <RotateCcw size={16} /> ضبط افتراضي
          </button>

          <button
            type="button"
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, var(--brand-teal), #10b981)',
              borderColor: 'transparent',
              fontSize: '0.95rem',
              fontWeight: 800,
              padding: '0.65rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)',
              cursor: 'pointer'
            }}
            onClick={handleSaveAndPublish}
          >
            <Save size={18} /> حفظ ونشر التغييرات وتفعيل المساعد
          </button>
        </div>
      </div>

      {saveStatus && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#10b981',
          padding: '0.9rem 1.25rem',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '0.92rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle size={20} /> {saveStatus}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { if (setIsChatOpen) setIsChatOpen(true); }}
              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', background: '#10b981', borderColor: '#10b981', fontWeight: 800, cursor: 'pointer' }}
            >
              💬 فتح المساعد الذكي
            </button>
            {onNavigate && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => onNavigate('dashboard')}
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', fontWeight: 700, cursor: 'pointer' }}
              >
                📊 لوحة القيادة
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Studio Work Area: Left Workspace, Right Live Playground */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 410px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Studio Navigation Tabs & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tabs bar */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'var(--card-bg)',
            padding: '0.5rem',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            overflowX: 'auto'
          }}>
            {TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { sfx.playClick(); setActiveTab(tab.id); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: active ? 'linear-gradient(135deg, var(--brand-teal), #0284c7)' : 'transparent',
                    color: active ? 'white' : 'var(--text-muted)',
                    fontWeight: active ? 800 : 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
          </div>

          {/* ============================================================== */}
          {/* TAB 1: DIALECT & PERSONA */}
          {/* ============================================================== */}
          {activeTab === 'dialect' && (
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bot size={22} color="var(--brand-teal)" /> ضبط اللهجة السعودية والشخصية
                </h3>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  حدد أسلوب الحوار الأكثر ملاءمة لثقافة العمل بجمعية تراؤف مع عينات صوتية وأيقونة المساعد.
                </p>
              </div>

              {/* Avatar Icon Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                  أيقونة وشعار المساعد (Avatar Icon)
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {AVATAR_ICONS.map((icon) => {
                    const isSelected = (config.appearance?.icon || '🤖') === icon;
                    return (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => {
                          sfx.playClick();
                          setConfig(prev => ({
                            ...prev,
                            appearance: { ...prev.appearance, icon }
                          }));
                          if (setAiIcon) setAiIcon(icon);
                        }}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--brand-teal)' : '1px solid var(--border)',
                          background: isSelected ? 'rgba(13, 148, 136, 0.15)' : 'var(--bg)',
                          fontSize: '1.6rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 0 12px rgba(13, 148, 136, 0.4)' : 'none'
                        }}
                        title={`اختيار الشعار: ${icon}`}
                      >
                        {icon}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dialect cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {Object.entries(DIALECTS).map(([key, d]) => {
                  const isSelected = (config.dialect || 'white') === key;
                  return (
                    <div
                      key={key}
                      onClick={() => {
                        sfx.playClick();
                        setConfig(prev => ({ ...prev, dialect: key }));
                      }}
                      style={{
                        padding: '1.25rem',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid var(--brand-teal)' : '1px solid var(--border)',
                        background: isSelected ? 'rgba(13, 148, 136, 0.08)' : 'var(--card-bg)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{d.emoji}</span>
                        {isSelected && (
                          <span style={{ background: 'var(--brand-teal)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={14} />
                          </span>
                        )}
                      </div>
                      <h4 style={{ margin: '0 0 0.3rem', fontSize: '1.05rem', fontWeight: 800 }}>{d.label}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{d.desc}</p>
                      
                      <div style={{ marginTop: '0.75rem', background: 'var(--thead-bg)', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <strong>أمثلة: </strong> «{d.samples[0]}»
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestVoiceSample(d.samples[0]);
                        }}
                        style={{
                          marginTop: '0.75rem',
                          width: '100%',
                          background: 'transparent',
                          border: '1px dashed var(--border)',
                          padding: '0.45rem',
                          borderRadius: '8px',
                          color: 'var(--brand-teal)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Volume2 size={14} /> استمع لنطق هذه اللهجة
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Persona details: Name, Role, Length */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>اسم المساعد الذكي</label>
                  <input
                    type="text"
                    value={config.name || 'تراؤف AI'}
                    onChange={e => {
                      const val = e.target.value;
                      setConfig(prev => ({ ...prev, name: val }));
                      if (setAiName) setAiName(val);
                    }}
                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>المسمى الوظيفي للمساعد</label>
                  <input
                    type="text"
                    value={config.roleTitle || 'مستشار الأصول والمحاسبة الذكي'}
                    onChange={e => setConfig(prev => ({ ...prev, roleTitle: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>طول الإجابة المفضل</label>
                  <select
                    value={config.length || 'balanced'}
                    onChange={e => setConfig(prev => ({ ...prev, length: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9rem' }}
                  >
                    {Object.entries(LENGTHS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label} — {v.rule.slice(0, 30)}...</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Temperature & Creativity Slider */}
              <div style={{ background: 'var(--thead-bg)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>
                    درجة الإبداع والالتزام بالبيانات (Temperature): <strong>{config.temperature ?? 0.35}</strong>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--brand-teal)', fontWeight: 700 }}>
                    {(config.temperature ?? 0.35) <= 0.25 ? '🎯 دقيق جداً وملتزم حرفياً بالأرقام' : (config.temperature ?? 0.35) <= 0.5 ? '⚖️ متوازن ودقيق للعمل اليومي' : '💡 عفوي وإبداعي'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={config.temperature ?? 0.35}
                  onChange={e => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--brand-teal)', cursor: 'pointer' }}
                />
              </div>

              {/* Emoji Toggle */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--thead-bg)',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>استخدام الرموز التعبيرية الهادئة (Emojis)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>إضافة رموز خفيفة في نهاية الردود لإضفاء طابع تفاعلي سعودي لطيف</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.emoji !== false}
                  onChange={e => setConfig(prev => ({ ...prev, emoji: e.target.checked }))}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--brand-teal)', cursor: 'pointer' }}
                />
              </div>

              {/* Custom Instructions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  تعليمات مخصصة إضافية من الإدارة (Custom Rules)
                </label>
                <textarea
                  rows={3}
                  value={config.customInstructions || ''}
                  placeholder="مثال: رحّب بالموظفين دائماً بقولك «يا هلا والله بأهل تراؤف»، واحرص على توضيح أن جميع القيود تخضع لموافقة المدير المالي."
                  onChange={e => setConfig(prev => ({ ...prev, customInstructions: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              {/* Blocked Topics */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  مواضيع محظورة يجب الاعتذار عن إجابتها (Blocked Topics)
                </label>
                <textarea
                  rows={2}
                  value={config.blockedTopics || ''}
                  placeholder="مثال: الأسئلة السياسية، الأسرار الشخصية للموظفين، تفاصيل كلمات المرور أو قواعد البيانات."
                  onChange={e => setConfig(prev => ({ ...prev, blockedTopics: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: MODELS & TOOLS & DATA SOURCES */}
          {/* ============================================================== */}
          {activeTab === 'models' && (
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sliders size={22} color="var(--brand-teal)" /> النماذج الذكية، الأدوات، ومصادر البيانات
                </h3>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  تحكم بنموذج الذكاء الاصطناعي الأساسي، وحدد البيانات المتاحة والأدوات المسموحة بدقة كاملة.
                </p>
              </div>

              {/* Models selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>النموذج الرئيسي المفضل (Primary LLM)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  {CHAT_MODELS.map(m => {
                    const isSelected = config.model === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          sfx.playClick();
                          setConfig(prev => ({ ...prev, model: m.id }));
                        }}
                        style={{
                          padding: '1.2rem',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--brand-teal)' : '1px solid var(--border)',
                          background: isSelected ? 'rgba(13, 148, 136, 0.08)' : 'var(--card-bg)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem' }}>{m.label}</span>
                          <span style={{ fontSize: '0.72rem', background: 'rgba(13, 148, 136, 0.15)', color: 'var(--brand-teal)', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 700 }}>
                            {m.badge}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{m.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Data Sources Integration Toggles */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  مصادر بيانات النظام المتصلة بالذكاء الاصطناعي (Live Datasets)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {DATA_SOURCES.map(source => {
                    const isConnected = config.data?.[source.key] !== false;
                    return (
                      <div
                        key={source.key}
                        onClick={() => {
                          sfx.playClick();
                          setConfig(prev => ({
                            ...prev,
                            data: { ...prev.data, [source.key]: !isConnected }
                          }));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: isConnected ? '1px solid rgba(13, 148, 136, 0.4)' : '1px dashed var(--border)',
                          background: isConnected ? 'rgba(13, 148, 136, 0.05)' : 'var(--thead-bg)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <input
                            type="checkbox"
                            checked={isConnected}
                            onChange={(e) => {
                              e.stopPropagation();
                              sfx.playClick();
                              setConfig(prev => ({
                                ...prev,
                                data: { ...prev.data, [source.key]: e.target.checked }
                              }));
                            }}
                            style={{ width: '17px', height: '17px', accentColor: 'var(--brand-teal)', cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{source.label}</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg)', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                          {source.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tools Matrix */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>
                      أدوات قراءة البيانات الحية والتنقل بين الصفحات (Tools Matrix)
                    </label>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      جميع الأدوات للقراءة والتحليل فقط دون تعديل مباشر في السجلات
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleSelectAllTools}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', border: '1px solid var(--border)' }}
                    >
                      تحديد الكل
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleDeselectAllTools}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', border: '1px solid var(--border)' }}
                    >
                      إلغاء الكل
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {TOOL_DEFS.map(tool => {
                    const isEnabled = config.tools?.[tool.name] !== false;
                    return (
                      <div
                        key={tool.name}
                        onClick={() => {
                          sfx.playClick();
                          setConfig(prev => ({
                            ...prev,
                            tools: { ...prev.tools, [tool.name]: !isEnabled }
                          }));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.85rem 1rem',
                          borderRadius: '10px',
                          border: isEnabled ? '1px solid rgba(13, 148, 136, 0.4)' : '1px dashed var(--border)',
                          background: isEnabled ? 'rgba(13, 148, 136, 0.04)' : 'var(--thead-bg)',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => {
                            e.stopPropagation();
                            sfx.playClick();
                            setConfig(prev => ({
                              ...prev,
                              tools: { ...prev.tools, [tool.name]: e.target.checked }
                            }));
                          }}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--brand-teal)', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{tool.label} ({tool.name})</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{tool.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: VOICE & SPEECH */}
          {/* ============================================================== */}
          {activeTab === 'voice' && (
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Volume2 size={22} color="var(--brand-teal)" /> الصوت البشري والنطق السعودي التفاعلي
                </h3>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  محرك توليد الكلام البشري فائق الدقة (Groq Orpheus Saudi Neural + Microsoft Natural Online) لجمعية تراؤف.
                </p>
              </div>

              {/* Status Banner: Groq Orpheus Terms Acceptance */}
              {ttsTermsRequired && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f59e0b', fontWeight: 800, fontSize: '0.98rem' }}>
                    <Sparkles size={20} /> تفعيل الصوت البشري فائق الواقعية (CanopyLabs Orpheus)
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.6 }}>
                    نموذج <strong>CanopyLabs Orpheus</strong> هو نموذج صوت بشري استوديو حقيقي مسجل من متحدثين سعوديين. يتطلب حساب Groq قبول شروط ترخيص النموذج لمرة واحدة فقط (تستغرق ثانيتين):
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <a
                      href="https://console.groq.com/playground?model=canopylabs%2Forpheus-arabic-saudi"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        textDecoration: 'none',
                        background: '#f59e0b',
                        color: '#000',
                        fontWeight: 800,
                        padding: '0.55rem 1rem',
                        borderRadius: '8px'
                      }}
                    >
                      فتح صفحة قبول الشروط في Groq ↗
                    </a>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        sessionStorage.removeItem('traouf_tts_groq_state');
                        setTtsTermsRequired(false);
                        handleTestVoiceSample('يا هلا والله، تم تفعيل الصوت بنجاح.');
                      }}
                      style={{ border: '1px solid var(--border)', fontSize: '0.82rem', padding: '0.55rem 0.9rem' }}
                    >
                      تم القبول، اختبر الصوت الآن 🔄
                    </button>
                  </div>
                </div>
              )}

              {/* Browser Neural Voices Recommendation Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(30, 41, 59, 0.4) 100%)',
                border: '1px solid rgba(13, 148, 136, 0.3)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}>
                <span style={{ fontSize: '1.6rem' }}>💎</span>
                <div style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.55 }}>
                  <strong>نصيحة لصوت بشري فوري:</strong> متصفح <strong>Microsoft Edge</strong> يتضمن تلقائياً وبشكل مجاني أصوات <strong>Microsoft Hamed Online (Natural)</strong> و <strong>Zariyah Online (Natural)</strong> البشرية الفائقة، وتعمل فيه دون أي روبوتات أو إعدادات.
                </div>
              </div>

              {/* Enable voice toggle */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--thead-bg)',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>تفعيل النطق الصوتي التلقائي</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>قراءة إجابات الذكاء الاصطناعي صوتياً باللهجة السعودية المحددة</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.voice?.enabled || false}
                  onChange={e => setConfig(prev => ({ ...prev, voice: { ...prev.voice, enabled: e.target.checked } }))}
                  style={{ width: '22px', height: '22px', accentColor: 'var(--brand-teal)', cursor: 'pointer' }}
                />
              </div>

              {/* Voice Personas */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  شخصية الصوت البشري (10 أصوات سعودية متنوعة)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
                  {VOICES.map(v => {
                    const isSelected = (config.voice?.voiceId || 'fahad') === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          sfx.playClick();
                          setConfig(prev => ({ ...prev, voice: { ...prev.voice, voiceId: v.id } }));
                        }}
                        style={{
                          padding: '1.1rem',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--brand-teal)' : '1px solid var(--border)',
                          background: isSelected ? 'rgba(13, 148, 136, 0.08)' : 'var(--card-bg)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: isSelected ? 'var(--brand-teal)' : 'var(--text)' }}>{v.label}</span>
                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--brand-teal)', background: 'rgba(13, 148, 136, 0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                                {v.gender}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: 'var(--thead-bg)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                                {v.tone}
                              </span>
                            </div>
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{v.desc}</div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestVoiceSample(null, v.id);
                          }}
                          style={{
                            marginTop: '0.75rem',
                            background: 'transparent',
                            border: '1px dashed var(--border)',
                            borderRadius: '8px',
                            padding: '0.35rem 0.5rem',
                            fontSize: '0.74rem',
                            color: 'var(--brand-teal)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            width: '100%',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Volume2 size={13} /> استمع لصوت {v.label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom OpenAI TTS Key (Optional) */}
              <div style={{ background: 'var(--thead-bg)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  مفتاح OpenAI اختياري للصوت البشري (OpenAI TTS-1)
                </label>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={config.voice?.openaiKey || ''}
                  onChange={e => setConfig(prev => ({ ...prev, voice: { ...prev.voice, openaiKey: e.target.value } }))}
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  في حال إدخال مفتاح OpenAI، سيستخدم النظام نموذج `tts-1` فائق الواقعية مباشرةً.
                </div>
              </div>

              {/* Speech Rate Slider */}
              <div style={{ background: 'var(--thead-bg)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0 }}>
                    سرعة النطق الصوتي: <strong>{config.voice?.rate || 0.95}x</strong>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {(config.voice?.rate || 0.95) < 0.95 ? 'هادئ ومتأنٍ' : (config.voice?.rate || 0.95) <= 1.05 ? 'سرعة طبيعية مريحة' : 'سريع وحيوي'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.05"
                  value={config.voice?.rate || 0.95}
                  onChange={e => setConfig(prev => ({ ...prev, voice: { ...prev.voice, rate: parseFloat(e.target.value) } }))}
                  style={{ width: '100%', accentColor: 'var(--brand-teal)', cursor: 'pointer' }}
                />
              </div>

              {/* Test Audio Button & Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleTestVoiceSample()}
                  disabled={audioTesting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.75rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Volume2 size={18} /> {audioTesting ? 'جاري نطق العينة الصوتية...' : 'تشغيل عينة من الصوت المختار'}
                </button>

                {activeVoiceEngine && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--brand-teal)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={15} />
                    {activeVoiceEngine === 'groq-orpheus-saudi' && 'المشغل: Groq Orpheus السعودي (بشري استوديو)'}
                    {activeVoiceEngine === 'openai-neural' && 'المشغل: OpenAI TTS-1 (بشري فائق الدقة)'}
                    {activeVoiceEngine === 'browser-natural' && 'المشغل: أصوات Microsoft Natural البشرية'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: KNOWLEDGE BASE & REGULATIONS */}
          {/* ============================================================== */}
          {activeTab === 'knowledge' && (
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={22} color="var(--brand-teal)" /> قاعدة المعرفة واللوائح التنظيمية
                </h3>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  إرفاق المستندات واللوائح والأسئلة الشائعة المعتمدة لتضمينها لحظياً في سياق الذكاء الاصطناعي.
                </p>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileUploadRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt,.json"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />

              {/* Interactive File Upload Area */}
              <div
                onClick={() => {
                  if (fileUploadRef.current) fileUploadRef.current.click();
                }}
                style={{
                  border: '2px dashed var(--brand-teal)',
                  padding: '2rem',
                  borderRadius: '14px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  background: 'rgba(13, 148, 136, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(13, 148, 136, 0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(13, 148, 136, 0.04)'}
              >
                <Upload size={38} color="var(--brand-teal)" style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ margin: '0 0 0.3rem', color: 'var(--text)', fontSize: '1.05rem', fontWeight: 800 }}>
                  انقر هنا لاختيار لوائح وسياسات إضافية (PDF / Excel / Word / TXT)
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem' }}>
                  يقوم الذكاء الاصطناعي بقراءة الملفات ودمج محتواها ضمن الإجابات والتحليلات الرسمية.
                </p>
              </div>

              {/* Custom Uploaded Files List */}
              {config.knowledge?.docs?.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 800 }}>المستندات المرفقة حديثاً:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {config.knowledge.docs.map(doc => (
                      <div
                        key={doc.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          background: 'var(--card-bg)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <File size={18} color="var(--brand-teal)" />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{doc.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.size} • {doc.uploadedAt}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => handleRemoveDoc(doc.id)}
                          style={{ color: '#ef4444', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                          title="حذف المستند"
                        >
                          <Trash2 size={15} /> حذف
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive FAQ Builder */}
              <div style={{ background: 'var(--thead-bg)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={18} color="var(--brand-teal)" /> إضافة أسئلة وأجوبة شائعة معتمدة (Custom FAQs)
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="السؤال المعتمد (مثال: متى يتم إخلاء طرف الموظف من العهد؟)"
                    value={newFaqQ}
                    onChange={e => setNewFaqQ(e.target.value)}
                    style={{ padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.88rem' }}
                  />
                  <textarea
                    rows={2}
                    placeholder="الإجابة المعتمدة الرسمية..."
                    value={newFaqA}
                    onChange={e => setNewFaqA(e.target.value)}
                    style={{ padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.88rem', resize: 'vertical' }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddFaq}
                    style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
                  >
                    <Plus size={16} /> إضافة السؤال لقاعدة المعرفة
                  </button>
                </div>

                {config.knowledge?.faqs?.length > 0 && (
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>الأسئلة المعتمدة الحالية:</div>
                    {config.knowledge.faqs.map((faq, idx) => (
                      <div key={idx} style={{ background: 'var(--card-bg)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--brand-teal)' }}>س: {faq.q}</strong>
                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ج: {faq.a}</p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => handleRemoveFaq(idx)}
                          style={{ color: '#ef4444', padding: '0.2rem 0.4rem' }}
                          title="حذف السؤال"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Built-in System Regulations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ margin: '0.5rem 0 0', fontSize: '0.95rem', fontWeight: 800 }}>اللوائح المدمجة بالنظام تلقائياً:</h4>
                {[
                  'لائحة إدارة الأصول الثابتة وحساب الإهلاك (القسط الثابت SL) - جمعية تراؤف',
                  'دليل تسليم واسترداد العهد الميدانية وشهادات إخلاء الطرف',
                  'دليل إدارة المخزون والمستودع وحدود الطلب الدنيا (RADAR)',
                  'معايير المحاسبة الدولية للقطاع غير الربحي (IFRS / SOCPA)'
                ].map((doc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', background: 'var(--thead-bg)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <CheckCircle size={16} color="#10b981" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: ANALYTICS & SECURITY */}
          {/* ============================================================== */}
          {activeTab === 'analytics' && (
            <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={22} color="var(--brand-teal)" /> سجل الأداء ومصفوفة الأمان
                </h3>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  إحصاءات استدعاء المساعد وسرعة الاستجابة وسياسات أمان وخصوصية البيانات.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'var(--thead-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>إجمالي الاستفسارات</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand-teal)' }}>{usageStats.total || 0}</div>
                </div>
                <div style={{ background: 'var(--thead-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>نسبة النجاح</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>
                    {usageStats.total ? Math.round((usageStats.ok / usageStats.total) * 100) : 100}%
                  </div>
                </div>
                <div style={{ background: 'var(--thead-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>متوسط سرعة الرد</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>{usageStats.avgMs || 780} <span style={{ fontSize: '0.75rem' }}>مللي ثانية</span></div>
                </div>
              </div>

              {/* Interactive Security Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ margin: '0.25rem 0', fontSize: '0.95rem', fontWeight: 800 }}>خيارات الأمان والخصوصية:</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'var(--thead-bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>تسجيل سجل الاستخدام والمحادثات محلياً</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>حفظ الإحصاءات في التخزين المحلي لتحليل الأداء</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.security?.logInteractions !== false}
                    onChange={e => setConfig(prev => ({ ...prev, security: { ...prev.security, logInteractions: e.target.checked } }))}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--brand-teal)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'var(--thead-bg)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>إخفاء وتشفير البيانات الشخصية الحساسة (PII Masking)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>حجب أرقام الهويات الوطنية والرواتب في المحادثات</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.security?.maskPII !== false}
                    onChange={e => setConfig(prev => ({ ...prev, security: { ...prev.security, maskPII: e.target.checked } }))}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--brand-teal)', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Clear Log Action */}
              <div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleClearUsage}
                  style={{ border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.85rem' }}
                >
                  <Trash2 size={16} /> تفريغ سجل المحادثات والتحليلات
                </button>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                  <ShieldCheck size={18} /> السياسات الصارمة المطبقة تلقائياً
                </h4>
                <ul style={{ margin: 0, paddingRight: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>تشفير تام لجميع المحادثات عبر بروتوكول TLS آمن ومطابق للمواصفات السعودية.</li>
                  <li>امتثال كامل لصلاحيات المستخدم (Role-Based Access Control) ولا يمكن التعديل عبر الشات.</li>
                  <li>حجب أي معلومات سرية أو كلمات مرور في سياق المحادثة.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: INTERACTIVE LIVE PLAYGROUND */}
        {/* ============================================================== */}
        <div className="card" style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          height: '700px',
          background: 'var(--card-bg)',
          borderRadius: '18px',
          border: '1px solid var(--border)',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)',
          position: 'sticky',
          top: '1rem'
        }}>
          {/* Playground Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.75rem',
            marginBottom: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
              <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>{config.appearance?.icon || '🤖'}</span> معاينة تفاعلية حية
              </strong>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => setPreviewHistory([
                { role: 'assistant', content: 'يا هلا ومسهلا! أنا مستشارك الذكي بجمعية تراؤف. آمرني، وش تبي تعرف عن الأصول والعهد والمستودع اليوم؟ 😊' }
              ])}
              title="تفريغ شاشة المعاينة"
            >
              مسح
            </button>
          </div>

          {/* Quick Saudi Prompts */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
            {[
              'كم الأصول الثابتة وقيمتها؟',
              'مين أكثر موظف عنده عهد؟',
              'افتح لي سجل الأصول',
              'وش وضع المستودع والنواقص؟'
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendPlaygroundMessage(p)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.72rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '12px',
                  background: 'var(--thead-bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--brand-teal)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages scroll box */}
          <div
            ref={chatScrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              padding: '0.5rem',
              background: 'var(--bg)',
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}
          >
            {previewHistory.map((msg, idx) => {
              const isBot = msg.role === 'assistant';
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '88%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  <div style={{
                    background: isBot ? 'var(--card-bg)' : 'linear-gradient(135deg, var(--brand-teal), #0284c7)',
                    color: isBot ? 'var(--text)' : 'white',
                    padding: '0.75rem 0.9rem',
                    borderRadius: isBot ? '0 14px 14px 14px' : '14px 14px 0 14px',
                    fontSize: '0.84rem',
                    lineHeight: 1.5,
                    border: isBot ? '1px solid var(--border)' : 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                  }}>
                    {msg.content}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: isBot ? 'right' : 'left', padding: '0 0.3rem' }}>
                    {isBot ? `${config.appearance?.icon || '🤖'} ${config.name || 'تراؤف AI'}` : 'أنت'}
                  </span>
                </div>
              );
            })}

            {isPreviewTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--card-bg)', padding: '0.6rem 0.9rem', borderRadius: '0 12px 12px 12px', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--brand-teal)' }}>
                جاري التفكير وصياغة الرد باللهجة السعودية...
              </div>
            )}
          </div>

          {/* Response metadata pill */}
          {lastMeta && (
            <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', padding: '0 0.2rem' }}>
              <span>⏱️ {lastMeta.ms}ms • {lastMeta.model?.split('/')[1] || lastMeta.model}</span>
              {lastMeta.tools?.length > 0 && <span>🔧 {lastMeta.tools.join(', ')}</span>}
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPlaygroundMessage();
            }}
            style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}
          >
            <input
              type="text"
              placeholder="اكتب رسالة لتجربة الرد واللهجة..."
              value={previewInput}
              onChange={e => setPreviewInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0.6rem 0.8rem',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isPreviewTyping}
              className="btn btn-primary"
              style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', fontWeight: 700 }}
            >
              إرسال
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
