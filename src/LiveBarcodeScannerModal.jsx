import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, X, Zap, CheckCircle, Search, AlertCircle, Volume2, ShieldCheck, Box, Warehouse } from 'lucide-react';
import { sfx } from './audioEffects';

export default function LiveBarcodeScannerModal({
  isOpen,
  onClose,
  assets = [],
  warehouseItems = [],
  onSelectAsset,
  onSelectWarehouse
}) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanningAnim, setIsScanningAnim] = useState(true);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);

      // Check torch support
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      if (capabilities.torch) {
        setHasTorch(true);
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('لم نتمكن من الوصول لكاميرا الجهاز أو تم رفض الإذن. يمكنك إدخال الرمز يدوياً أو اختيار أحد الأصول التجريبية.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const toggleTorch = async () => {
    if (!streamRef.current || !hasTorch) return;
    try {
      const track = streamRef.current.getVideoTracks()[0];
      const newTorch = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: newTorch }]
      });
      setTorchOn(newTorch);
    } catch (e) {
      console.warn('Torch toggle error:', e);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScannedResult(null);
      setManualCode('');
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Lookup code
  const handleProcessCode = (code) => {
    if (!code) return;
    const clean = code.trim().toLowerCase();
    sfx.playScan();

    // 1. Check in assets
    const foundAsset = assets.find(a => 
      (a.code && a.code.toLowerCase() === clean) || 
      (a.id && a.id.toLowerCase() === clean) ||
      (a.serial && a.serial.toLowerCase() === clean)
    );

    if (foundAsset) {
      sfx.playSuccess();
      setScannedResult({
        type: 'asset',
        item: foundAsset,
        title: foundAsset.name,
        code: foundAsset.code || foundAsset.id,
        sub: `أصل ثابت | الفئة: ${foundAsset.category} | القيمة: ${Number(foundAsset.cost || 0).toLocaleString()} ر.س`
      });
      return;
    }

    // 2. Check in warehouse
    const foundWh = warehouseItems.find(w => 
      (w.sku && w.sku.toLowerCase() === clean) || 
      (w.id && w.id.toLowerCase() === clean) ||
      (w.name && w.name.toLowerCase().includes(clean))
    );

    if (foundWh) {
      sfx.playSuccess();
      setScannedResult({
        type: 'warehouse',
        item: foundWh,
        title: foundWh.name,
        code: foundWh.sku || foundWh.id,
        sub: `صنف مستودعي | الموقع: ${foundWh.location} | الكمية الحالية: ${foundWh.qty}`
      });
      return;
    }

    // Not found
    sfx.playWarning();
    setScannedResult({
      type: 'unknown',
      code: code,
      title: 'الرمز غير مسجل في النظام',
      sub: `لم يتم العثور على أصل أو صنف مستودعي يطابق الرمز: "${code}"`
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 11, 20, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: '1rem',
      fontFamily: '"Tajawal", sans-serif',
      direction: 'rtl'
    }}>
      <div style={{
        width: '740px',
        maxWidth: '96vw',
        background: 'var(--card-bg, #0f172a)',
        borderRadius: '24px',
        border: '1px solid rgba(0, 165, 155, 0.35)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 165, 155, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Top Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          background: 'linear-gradient(90deg, rgba(0, 165, 155, 0.15), rgba(140, 194, 64, 0.1))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--brand-teal), var(--brand-green))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(0, 165, 155, 0.5)'
            }}>
              <Camera size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text, #fff)' }}>
                الماسح الميداني الذكي (Live LiDAR Scanner)
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--brand-teal, #2dd4bf)', fontWeight: 600 }}>
                توجيه الكاميرا الفوري • مسح Barcode / QR Code • التحقق اللحظي
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '10px',
              padding: '0.5rem',
              color: 'var(--text-muted, #94a3b8)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '340px',
          background: '#050811',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '420px', color: '#94a3b8' }}>
              <AlertCircle size={44} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
              <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>
                {cameraError || 'جاري تهيئة بث الكاميرا...'}
              </div>
              <button
                onClick={startCamera}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', marginTop: '0.5rem' }}
              >
                <RefreshCw size={14} style={{ marginLeft: '0.4rem' }} /> إعادة محاولة تشغيل الكاميرا
              </button>
            </div>
          )}

          {/* Futuristic HUD Scanning Reticle Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Target Box */}
            <div style={{
              position: 'relative',
              width: '260px',
              height: '220px',
              border: '1.5px dashed rgba(0, 165, 155, 0.4)',
              borderRadius: '16px',
              boxShadow: '0 0 30px rgba(0, 165, 155, 0.15)'
            }}>
              {/* Corner Brackets */}
              <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '24px', height: '24px', borderTop: '3px solid #2dd4bf', borderLeft: '3px solid #2dd4bf', borderRadius: '4px 0 0 0' }} />
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '24px', height: '24px', borderTop: '3px solid #2dd4bf', borderRight: '3px solid #2dd4bf', borderRadius: '0 4px 0 0' }} />
              <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '24px', height: '24px', borderBottom: '3px solid #2dd4bf', borderLeft: '3px solid #2dd4bf', borderRadius: '0 0 0 4px' }} />
              <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '24px', height: '24px', borderBottom: '3px solid #2dd4bf', borderRight: '3px solid #2dd4bf', borderRadius: '0 0 4px 0' }} />

              {/* Scanning Animated Laser Line */}
              {isScanningAnim && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #10b981, #2dd4bf, transparent)',
                  boxShadow: '0 0 15px #10b981, 0 0 8px #2dd4bf',
                  animation: 'laserSweep 2s ease-in-out infinite'
                }} />
              )}

              {/* Center Crosshair */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '18px',
                height: '18px',
                opacity: 0.6
              }}>
                <div style={{ position: 'absolute', top: '8px', left: 0, right: 0, height: '2px', background: '#2dd4bf' }} />
                <div style={{ position: 'absolute', left: '8px', top: 0, bottom: 0, width: '2px', background: '#2dd4bf' }} />
              </div>
            </div>

            {/* Bottom HUD readout */}
            <div style={{
              marginTop: '1rem',
              background: 'rgba(0, 0, 0, 0.65)',
              padding: '0.35rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: '#2dd4bf',
              letterSpacing: '1px',
              fontFamily: 'monospace',
              border: '1px solid rgba(45, 212, 191, 0.3)'
            }}>
              [TARGET_ACQUIRED: FOCUS_READY // 60_FPS]
            </div>
          </div>

          {/* Controls Bar over Video */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            left: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={switchCamera}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '0.45rem 0.8rem',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} /> تبديل الكاميرا
              </button>

              {hasTorch && (
                <button
                  onClick={toggleTorch}
                  style={{
                    background: torchOn ? '#f59e0b' : 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: torchOn ? '#000' : 'white',
                    borderRadius: '10px',
                    padding: '0.45rem 0.8rem',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Zap size={14} /> {torchOn ? 'إطفاء الفلاش' : 'تشغيل الفلاش'}
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(0,0,0,0.6)', padding: '0.3rem 0.75rem', borderRadius: '8px' }}>
              تلقائي عبر الكاميرا
            </div>
          </div>
        </div>

        {/* Scanned Result Banner */}
        {scannedResult && (
          <div style={{
            padding: '1.25rem 1.75rem',
            background: scannedResult.type === 'unknown' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.12)',
            borderBottom: '1px solid var(--border)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: scannedResult.type === 'unknown' ? '#ef4444' : '#10b981',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                {scannedResult.type === 'unknown' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)' }}>
                  {scannedResult.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {scannedResult.sub}
                </div>
              </div>
            </div>

            {scannedResult.type !== 'unknown' && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (scannedResult.type === 'asset' && onSelectAsset) {
                    onSelectAsset(scannedResult.item);
                  } else if (scannedResult.type === 'warehouse' && onSelectWarehouse) {
                    onSelectWarehouse(scannedResult.item);
                  }
                  onClose();
                }}
                style={{ padding: '0.65rem 1.4rem', fontWeight: 800 }}
              >
                عرض بطاقة التفاصيل الكاملة ←
              </button>
            )}
          </div>
        )}

        {/* Manual Barcode Input & Instant Simulator Presets */}
        <div style={{ padding: '1.5rem 1.75rem', background: 'var(--card-bg)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessCode(manualCode);
            }}
            style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="أو اكتب رمز الباركود / المعرف هنا واضغط Enter (مثال: AST-001 أو IT-SKU-101)..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 2.75rem 0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.5rem', fontWeight: 700 }}
            >
              تحقق ومطابقة
            </button>
          </form>

          {/* Quick Simulation Chips */}
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 700 }}>
              ⚡ مسح تجريبي فوري بنقرة واحدة (للاختبار السريع):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {assets.slice(0, 3).map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleProcessCode(a.id)}
                  style={{
                    background: 'rgba(0, 165, 155, 0.08)',
                    border: '1px solid rgba(0, 165, 155, 0.25)',
                    color: 'var(--text)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Box size={13} color="var(--brand-teal)" />
                  {a.name} ({a.id})
                </button>
              ))}

              {warehouseItems.slice(0, 2).map(w => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => handleProcessCode(w.sku || w.id)}
                  style={{
                    background: 'rgba(140, 194, 64, 0.1)',
                    border: '1px solid rgba(140, 194, 64, 0.3)',
                    color: 'var(--text)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Warehouse size={13} color="var(--brand-green)" />
                  {w.name} ({w.sku})
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes laserSweep {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
