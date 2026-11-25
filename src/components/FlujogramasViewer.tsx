import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  Monitor,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  ExternalLink,
  X,
  GitBranch,
  Layers
} from 'lucide-react';

export interface FlujogramaSlide {
  page: number;
  code: string;
  title: string;
  category: string;
  imagePath: string;
}

export const ORIGINAL_PDF_URL = '/assets/aistudio/Plan_de_G_nero_en_Defensa_0d36ef7f.pdf';

export const FLUJOGRAMAS_SLIDES: FlujogramaSlide[] = [
  {
    page: 1,
    code: 'LÁMINA 01',
    title: 'Portada: Rutas y Flujogramas — Plan de Género en el Sector Defensa (2026)',
    category: 'Portada',
    imagePath: '/flujogramas/flujograma-01.png'
  },
  {
    page: 2,
    code: 'LÁMINA 02',
    title: 'El Ecosistema del Plan de Género',
    category: 'Visión General',
    imagePath: '/flujogramas/flujograma-02.png'
  },
  {
    page: 3,
    code: 'LÁMINA 03',
    title: '[1] Consejo de Género en el Sector Defensa',
    category: 'Estructura Institucional',
    imagePath: '/flujogramas/flujograma-03.png'
  },
  {
    page: 4,
    code: 'LÁMINA 04',
    title: '[2] Transversalización Ley 348 (Régimen Disciplinario)',
    category: 'Régimen Disciplinario',
    imagePath: '/flujogramas/flujograma-04.png'
  },
  {
    page: 5,
    code: 'LÁMINA 05',
    title: '[3] Protocolo de Acoso Laboral y Sexual',
    category: 'Protocolo Acoso',
    imagePath: '/flujogramas/flujograma-05.png'
  },
  {
    page: 6,
    code: 'LÁMINA 06',
    title: '[4] Protocolo de Violencia Intrafamiliar (VIF) — Ruta de Acción',
    category: 'Protocolo VIF',
    imagePath: '/flujogramas/flujograma-06.png'
  },
  {
    page: 7,
    code: 'LÁMINA 07',
    title: '[4] Protocolo VIF — Matriz de Derivación Médica y Legal',
    category: 'Protocolo VIF',
    imagePath: '/flujogramas/flujograma-07.png'
  },
  {
    page: 8,
    code: 'LÁMINA 08',
    title: '[5] Manual Administrativo para Unidades de Género',
    category: 'Gestión Administrativa',
    imagePath: '/flujogramas/flujograma-08.png'
  },
  {
    page: 9,
    code: 'LÁMINA 09',
    title: '[6] Manual de Buenas Prácticas y Lenguaje Administrativo',
    category: 'Buenas Prácticas',
    imagePath: '/flujogramas/flujograma-09.png'
  },
  {
    page: 10,
    code: 'LÁMINA 10',
    title: '[7] Guía de Inspección con Enfoque de Género',
    category: 'Inspección y Control',
    imagePath: '/flujogramas/flujograma-10.png'
  },
  {
    page: 11,
    code: 'LÁMINA 11',
    title: 'Inventario Oficial de Formularios de Activación',
    category: 'Formularios',
    imagePath: '/flujogramas/flujograma-11.png'
  },
  {
    page: 12,
    code: 'LÁMINA 12',
    title: 'Guía Fácil: Llenado, Actores y Derivación de Formularios',
    category: 'Formularios',
    imagePath: '/flujogramas/flujograma-12.png'
  },
  {
    page: 13,
    code: 'LÁMINA 13',
    title: 'Conclusión y Garantías de Protección',
    category: 'Cierre y Garantías',
    imagePath: '/flujogramas/flujograma-13.png'
  }
];

export const FlujogramasViewer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'presentation' | 'grid'>('presentation');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const currentSlide = FLUJOGRAMAS_SLIDES[currentIndex];
  const totalSlides = FLUJOGRAMAS_SLIDES.length;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
    setZoomLevel(100);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
    setZoomLevel(100);
  };

  const selectSlide = (index: number, openPresentation = false) => {
    setCurrentIndex(index);
    setZoomLevel(100);
    if (openPresentation) {
      setViewMode('presentation');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
        setZoomLevel(100);
        return;
      }
      if (viewMode === 'presentation' || isLightboxOpen) {
        if (e.key === 'ArrowRight') {
          setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
          setZoomLevel(100);
        } else if (e.key === 'ArrowLeft') {
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
          setZoomLevel(100);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isLightboxOpen, totalSlides]);

  return (
    <div className="w-full flex flex-col bg-[#080d14] text-slate-100">
      {/* Top Toolbar */}
      <div className="bg-[#0b121c] border-b border-slate-800 px-4 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <GitBranch className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                RUTAS Y FLUJOGRAMAS — PLAN DE GÉNERO EN EL SECTOR DEFENSA
              </span>
              <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                ORIGINALES SIN MODIFICACIÓN
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              13 láminas doctrinales oficiales reproducidas íntegramente del documento fuente
            </p>
          </div>
        </div>

        {/* Mode Switcher & PDF Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg bg-[#070b10] border border-slate-800 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('presentation')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'presentation'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Presentación</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Ver Todos (13)</span>
            </button>
          </div>

          <a
            href={ORIGINAL_PDF_URL}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Abrir el PDF original completo en una pestaña nueva"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Abrir PDF</span>
          </a>

          <a
            href={ORIGINAL_PDF_URL}
            download="Plan_de_Genero_en_Defensa_Flujogramas.pdf"
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Descargar archivo PDF original sin modificaciones"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar PDF</span>
          </a>
        </div>
      </div>

      {/* Main Viewer Body */}
      {viewMode === 'presentation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[74vh]">
          {/* Left Index Sidebar */}
          <aside className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-800/90 bg-[#090e16] flex flex-col max-h-[300px] lg:max-h-[78vh]">
            <div className="px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono uppercase text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Índice de Flujogramas
              </span>
              <span className="text-cyan-400 font-bold">
                {currentIndex + 1} / {totalSlides}
              </span>
            </div>

            <div className="overflow-y-auto p-2 space-y-1.5 flex-1">
              {FLUJOGRAMAS_SLIDES.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={slide.page}
                    type="button"
                    onClick={() => selectSlide(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-cyan-500/15 border-cyan-400/70 text-white shadow-sm'
                        : 'bg-[#0d141f]/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-6 h-6 rounded font-mono text-[11px] font-bold flex items-center justify-center mt-0.5 ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {String(slide.page).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-xs font-bold leading-snug ${
                          isActive ? 'text-cyan-200' : 'text-slate-200'
                        }`}
                      >
                        {slide.title}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                        {slide.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Slide Display Area */}
          <div className="lg:col-span-9 flex flex-col bg-[#070b11] p-3 sm:p-5">
            {/* Active Slide Info & Zoom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-800/80">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 font-mono text-[10px] font-bold text-cyan-300">
                    {currentSlide.code}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {currentSlide.category}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white mt-1 truncate">
                  {currentSlide.title}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
                  disabled={zoomLevel <= 75}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 cursor-pointer"
                  title="Alejar"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 py-1 rounded bg-[#0c1219] border border-slate-800 font-mono text-xs text-cyan-300 min-w-[52px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                  disabled={zoomLevel >= 200}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 cursor-pointer"
                  title="Acercar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                {zoomLevel !== 100 && (
                  <button
                    type="button"
                    onClick={() => setZoomLevel(100)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer"
                    title="Restablecer zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="ml-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Ver flujograma en pantalla completa"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ampliar</span>
                </button>
              </div>
            </div>

            {/* Unmodified Flowchart Frame */}
            <div className="flex-1 overflow-auto rounded-xl border border-slate-800 bg-[#0b1018] flex items-center justify-center p-2 sm:p-4 min-h-[420px]">
              <div
                className="transition-all duration-200 flex items-center justify-center"
                style={{ width: `${zoomLevel}%`, minWidth: zoomLevel > 100 ? `${zoomLevel}%` : 'auto' }}
              >
                <img
                  src={currentSlide.imagePath}
                  alt={currentSlide.title}
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-full h-auto max-h-[65vh] object-contain rounded-lg shadow-2xl border border-slate-700/60 bg-white cursor-zoom-in"
                  style={zoomLevel > 100 ? { maxHeight: 'none' } : undefined}
                />
              </div>
            </div>

            {/* Bottom Prev / Next Navigation */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-cyan-400" />
                <span>Anterior</span>
              </button>

              {/* Quick Page Dots */}
              <div className="hidden sm:flex items-center gap-1.5 flex-wrap justify-center">
                {FLUJOGRAMAS_SLIDES.map((s, idx) => (
                  <button
                    key={s.page}
                    type="button"
                    onClick={() => selectSlide(idx)}
                    title={`${s.code}: ${s.title}`}
                    className={`w-7 h-7 rounded font-mono text-[11px] font-bold transition-all cursor-pointer border ${
                      idx === currentIndex
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow'
                        : 'bg-[#0e1622] text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {s.page}
                  </button>
                ))}
              </div>

              <span className="sm:hidden font-mono text-xs text-slate-400">
                {currentIndex + 1} / {totalSlides}
              </span>

              <button
                type="button"
                onClick={goNext}
                className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View: All 13 Unmodified Flowcharts */
        <div className="p-4 sm:p-6 bg-[#070b11] overflow-y-auto max-h-[76vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {FLUJOGRAMAS_SLIDES.map((slide, idx) => (
              <div
                key={slide.page}
                onClick={() => selectSlide(idx, true)}
                className={`group rounded-xl border overflow-hidden bg-[#0d1420] transition-all cursor-pointer flex flex-col ${
                  idx === currentIndex
                    ? 'border-cyan-400/80 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 hover:border-cyan-500/60 hover:shadow-xl'
                }`}
              >
                <div className="relative aspect-video bg-white overflow-hidden border-b border-slate-800">
                  <img
                    src={slide.imagePath}
                    alt={slide.title}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-[1.01] transition-transform duration-200"
                  />
                </div>
                <div className="p-3.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 font-mono text-[10px] font-bold text-cyan-300">
                        {slide.code}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 truncate">
                        {slide.category}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-2">
                      {slide.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                      setZoomLevel(100);
                      setIsLightboxOpen(true);
                    }}
                    className="shrink-0 p-2 rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-slate-700 transition-colors cursor-pointer"
                    title="Abrir en pantalla completa"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col"
          onClick={() => {
            setIsLightboxOpen(false);
            setZoomLevel(100);
          }}
        >
          {/* Lightbox Header */}
          <div
            className="px-4 sm:px-6 py-3 bg-[#080d14] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 font-mono text-xs font-bold text-cyan-300 shrink-0">
                {currentSlide.code} / 13
              </span>
              <span className="text-sm font-bold text-white truncate">
                {currentSlide.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                title="Alejar"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-cyan-300 min-w-[48px] text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(250, z + 25))}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                title="Acercar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setZoomLevel(100);
                }}
                className="ml-2 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-200 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Cerrar</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Canvas */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentSlide.imagePath}
              alt={currentSlide.title}
              className="rounded-lg shadow-2xl bg-white object-contain transition-all duration-200"
              style={{
                width: zoomLevel === 100 ? 'auto' : `${zoomLevel}%`,
                maxWidth: zoomLevel === 100 ? '96vw' : 'none',
                maxHeight: zoomLevel === 100 ? '82vh' : 'none'
              }}
            />
          </div>

          {/* Lightbox Footer Controls */}
          <div
            className="px-4 sm:px-6 py-3 bg-[#080d14] border-t border-slate-800 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={goPrev}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span>Anterior</span>
            </button>
            <span className="font-mono text-xs text-slate-400">
              Use las flechas ← / → del teclado para navegar • ESC para salir
            </span>
            <button
              type="button"
              onClick={goNext}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
