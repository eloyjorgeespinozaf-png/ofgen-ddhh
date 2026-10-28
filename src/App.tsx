/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Shield, 
  Folder, 
  Folders, 
  Image as ImageIcon, 
  Camera, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  History,
  FileCheck,
  Clock,
  Trash2,
  Save,
  X,
  Share2
} from 'lucide-react';

interface DirectDocLink {
  id: string;
  code: string;
  title: string;
  category: string;
  filePath: string;
  filename: string;
  tab: 'anexos' | 'principal' | 'secundaria';
}

interface AuditLogEntry {
  id: string;
  docId: string;
  code: string;
  title: string;
  filename: string;
  category: string;
  timestamp: string;
}

interface AppDatabase {
  unitData: {
    granUnidad: string;
    pequenaUnidad: string;
    responsable: string;
    gestion: string;
  };
  stats: {
    totalDownloads: number;
    downloadsByDoc: Record<string, number>;
    lastDownloadByDoc: Record<string, string>;
  };
  auditLog: AuditLogEntry[];
  docStatus: Record<string, 'pendiente' | 'tramitado' | 'archivado'>;
}

const DB_KEY = 'ejercito_bolivia_db_v1';

const defaultDatabase: AppDatabase = {
  unitData: {
    granUnidad: 'ESTADO MAYOR GENERAL',
    pequenaUnidad: 'SECCIÓN DE GÉNERO Y DERECHOS HUMANOS',
    responsable: 'OFICIAL DE GÉNERO Y DERECHOS HUMANOS',
    gestion: '2026'
  },
  stats: {
    totalDownloads: 0,
    downloadsByDoc: {},
    lastDownloadByDoc: {}
  },
  auditLog: [],
  docStatus: {}
};

const directDocs: DirectDocLink[] = [
  // Pestaña 1: Anexos (9 archivos)
  {
    id: 'anexo_a',
    code: 'ANEXO A',
    title: 'FORMULARIO ÚNICO DE DENUNCIA DE INCIDENTES DE GÉNERO Y ACOSO',
    category: 'Anexos Normativos',
    filePath: 'Anexos/ANEXO A.docx',
    filename: 'ANEXO A.docx',
    tab: 'anexos'
  },
  {
    id: 'anexo_b',
    code: 'ANEXO B',
    title: 'FORMULARIO DE PARTE DE INCIDENTE DE GÉNERO',
    category: 'Anexos Normativos',
    filePath: 'Anexos/ANEXO B.docx',
    filename: 'ANEXO B.docx',
    tab: 'anexos'
  },
  {
    id: 'anexo_c',
    code: 'ANEXO C',
    title: 'GUÍA DE ENTREVISTA A LA PERSONA AFECTADA',
    category: 'Anexos Normativos',
    filePath: 'Anexos/ANEXO C.docx',
    filename: 'ANEXO C.docx',
    tab: 'anexos'
  },
  {
    id: 'anexo_d',
    code: 'ANEXO D',
    title: 'ACTA DE NOTIFICACIÓN Y ACEPTACIÓN DE MEDIDAS PRECAUTORIAS',
    category: 'Anexos Normativos',
    filePath: 'Anexos/ANEXO D.docx',
    filename: 'ANEXO D.docx',
    tab: 'anexos'
  },
  {
    id: 'anexo_e',
    code: 'ANEXO E',
    title: 'MATRIZ DE VALORACIÓN DE RIESGO',
    category: 'Anexos Normativos',
    filePath: 'Anexos/ANEXO E.docx',
    filename: 'ANEXO E.docx',
    tab: 'anexos'
  },
  {
    id: 'anexo_f',
    code: 'ANEXO F',
    title: 'OFICIO DE REMISIÓN A JURISDICCIÓN ORDINARIA (LEY 348)',
    category: 'Anexos Normativos',
    filePath: 'Anexos/ANEXO F.docx',
    filename: 'ANEXO F.docx',
    tab: 'anexos'
  },
  {
    id: 'anexo_g',
    code: 'ANEXO G',
    title: 'HOJA DE RUTA DE ATENCIÓN INTEGRAL Y DERIVACIÓN',
    category: 'Anexos Normativos',
    filePath: 'Anexos/ANEXO G.docx',
    filename: 'ANEXO G.docx',
    tab: 'anexos'
  },
  {
    id: 'anexo_h',
    code: 'ANEXO H',
    title: 'PLANILLA DE SEGUIMIENTO Y MONITOREO DE CASOS',
    category: 'Anexos Normativos',
    filePath: 'Anexos/ANEXO H.docx',
    filename: 'ANEXO H.docx',
    tab: 'anexos'
  },
  {
    id: 'anexo_i',
    code: 'ANEXO I',
    title: 'INFORME FINAL DE CONCLUSIONES Y EVALUACIÓN DISCIPLINARIA',
    category: 'Anexos Normativos',
    filePath: 'Anexos/ANEXO I.docx',
    filename: 'ANEXO I.docx',
    tab: 'anexos'
  },

  // Pestaña 2: Carpeta Principal (11 archivos)
  {
    id: 'cp_01',
    code: '001',
    title: '001 CARATULA, INDICE Y SEPARADORES OF GEN',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/001 CARATULA, INDICE Y SEPARADORES OF GEN.docx',
    filename: '001 CARATULA, INDICE Y SEPARADORES OF GEN.docx',
    tab: 'principal'
  },
  {
    id: 'cp_02',
    code: '01',
    title: '01 MISION',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/01 MISION.docx',
    filename: '01 MISION.docx',
    tab: 'principal'
  },
  {
    id: 'cp_03',
    code: '02',
    title: '02 ORGANIGRAMA',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/02 ORGANIGRAMA.docx',
    filename: '02 ORGANIGRAMA.docx',
    tab: 'principal'
  },
  {
    id: 'cp_04',
    code: '03',
    title: '03 ORGANIZACION',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/03 ORGANIZACION.docx',
    filename: '03 ORGANIZACION.docx',
    tab: 'principal'
  },
  {
    id: 'cp_05',
    code: '04',
    title: '04 MANUAL DE FUNCIONES',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/04 MANUAL DE FUNCIONES.docx',
    filename: '04 MANUAL DE FUNCIONES.docx',
    tab: 'principal'
  },
  {
    id: 'cp_06',
    code: '05',
    title: '05 NORMAS VIGENTES DE ACCION',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/05 NORMAS VIGENTES DE ACCION.docx',
    filename: '05 NORMAS VIGENTES DE ACCION.docx',
    tab: 'principal'
  },
  {
    id: 'cp_07',
    code: '06',
    title: '06 Plan de actividades',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/06 Plan de actividades.docx',
    filename: '06 Plan de actividades.docx',
    tab: 'principal'
  },
  {
    id: 'cp_08',
    code: '07',
    title: '07 HOJA DE FIRMAS',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/07 HOJA DE FIRMAS.docx',
    filename: '07 HOJA DE FIRMAS.docx',
    tab: 'principal'
  },
  {
    id: 'cp_09',
    code: '08',
    title: '08 HOJA DE REVISION',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/08 HOJA DE REVISION.docx',
    filename: '08 HOJA DE REVISION.docx',
    tab: 'principal'
  },
  {
    id: 'cp_10',
    code: '09',
    title: 'guia de inspeccion DDHH y GENERO',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/guia de inspeccion DDHH y GENERO.docx',
    filename: 'guia de inspeccion DDHH y GENERO.docx',
    tab: 'principal'
  },
  {
    id: 'cp_11',
    code: '10',
    title: 'INFORME DAMAS',
    category: 'Carpeta Principal',
    filePath: 'Carpeta Principal/INFORME DAMAS.docx',
    filename: 'INFORME DAMAS.docx',
    tab: 'principal'
  },

  // Pestaña 3: Carpeta Secundaria (6 archivos)
  {
    id: 'cs_01',
    code: '001',
    title: '001 Cuadro de Planes y Programas DD.HH.',
    category: 'Carpeta Secundaria',
    filePath: 'Carpeta Secundaria/001 Cuadro de Planes y Programas DD.HH.docx',
    filename: '001 Cuadro de Planes y Programas DD.HH.docx',
    tab: 'secundaria'
  },
  {
    id: 'cs_02',
    code: '002',
    title: '002 Cuadro Registro de Convenios DD.HH.',
    category: 'Carpeta Secundaria',
    filePath: 'Carpeta Secundaria/002 Cuadro Registro de Convenios DD.HH.docx',
    filename: '002 Cuadro Registro de Convenios DD.HH.docx',
    tab: 'secundaria'
  },
  {
    id: 'cs_03',
    code: '003',
    title: '003 Cuadro estadistico de violaciones DD.HH.',
    category: 'Carpeta Secundaria',
    filePath: 'Carpeta Secundaria/003 Cuadro estadistico de violaciones DD.HH.docx',
    filename: '003 Cuadro estadistico de violaciones DD.HH.docx',
    tab: 'secundaria'
  },
  {
    id: 'cs_04',
    code: '004',
    title: '004 LIBRO REGISTRO SEMANAL',
    category: 'Carpeta Secundaria',
    filePath: 'Carpeta Secundaria/004 LIBRO REGISTRO SEMANAL.docx',
    filename: '004 LIBRO REGISTRO SEMANAL.docx',
    tab: 'secundaria'
  },
  {
    id: 'cs_05',
    code: '005',
    title: 'caratulas secundaria',
    category: 'Carpeta Secundaria',
    filePath: 'Carpeta Secundaria/caratulas secundaria.docx',
    filename: 'caratulas secundaria.docx',
    tab: 'secundaria'
  },
  {
    id: 'cs_06',
    code: '006',
    title: 'indice secundaria',
    category: 'Carpeta Secundaria',
    filePath: 'Carpeta Secundaria/indice secundaria.docx',
    filename: 'indice secundaria.docx',
    tab: 'secundaria'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'anexos' | 'principal' | 'secundaria'>('anexos');
  const [lastDownloaded, setLastDownloaded] = useState<string | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // LocalStorage Database State
  const [db, setDb] = useState<AppDatabase>(() => {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading localStorage database, using defaults:', e);
    }
    return defaultDatabase;
  });

  // Persist DB state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.warn('Error saving database to localStorage:', e);
    }
  }, [db]);

  // Unit settings form state inside DB panel
  const [unitForm, setUnitForm] = useState(db.unitData);
  useEffect(() => {
    setUnitForm(db.unitData);
  }, [db.unitData]);

  // Custom shield image and background states with permanent storage
  const [shieldImg, setShieldImg] = useState<string | null>(() => {
    try {
      return localStorage.getItem('inst_shield_img');
    } catch {
      return null;
    }
  });

  const [bgImg, setBgImg] = useState<string | null>(() => {
    try {
      return localStorage.getItem('inst_app_bg');
    } catch {
      return null;
    }
  });

  const [sectionBgImg, setSectionBgImg] = useState<string | null>(() => {
    try {
      return localStorage.getItem('inst_sec_bg');
    } catch {
      return null;
    }
  });

  const shieldInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const sectionBgInputRef = useRef<HTMLInputElement>(null);

  // Programmatic download with exact original binary fidelity & DB registration
  const ejecutarDescargaSegura = async (doc: DirectDocLink) => {
    const rutaSegura = encodeURI(doc.filePath);
    const nombreArchivo = doc.filePath.substring(doc.filePath.lastIndexOf('/') + 1);

    try {
      // 1. Fetch original file as pure binary blob with official OpenXML Word MIME type
      const response = await fetch(rutaSegura);
      if (!response.ok) throw new Error('Servidor local no disponible');
      
      const originalBlob = await response.blob();
      const docxBlob = new Blob([originalBlob], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      const blobUrl = URL.createObjectURL(docxBlob);
      const enlace = document.createElement('a');
      enlace.href = blobUrl;
      enlace.setAttribute('download', nombreArchivo);
      enlace.style.display = 'none';
      document.body.appendChild(enlace);
      enlace.click();

      setTimeout(() => {
        document.body.removeChild(enlace);
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (err) {
      // 2. Direct DOM fallback for offline/file:// protocol
      const enlaceFallback = document.createElement('a');
      enlaceFallback.href = rutaSegura;
      enlaceFallback.setAttribute('download', nombreArchivo);
      enlaceFallback.style.display = 'none';
      document.body.appendChild(enlaceFallback);
      enlaceFallback.click();

      setTimeout(() => {
        document.body.removeChild(enlaceFallback);
      }, 500);
    }

    setLastDownloaded(doc.id);

    // 3. Register transaction into LocalStorage Database
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('es-BO')} ${now.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}`;

    setDb(prev => {
      const currentDocCount = (prev.stats.downloadsByDoc[doc.id] || 0) + 1;
      const newEntry: AuditLogEntry = {
        id: `log_${Date.now()}`,
        docId: doc.id,
        code: doc.code,
        title: doc.title,
        filename: doc.filename,
        category: doc.category,
        timestamp: formattedDate
      };

      return {
        ...prev,
        stats: {
          totalDownloads: prev.stats.totalDownloads + 1,
          downloadsByDoc: {
            ...prev.stats.downloadsByDoc,
            [doc.id]: currentDocCount
          },
          lastDownloadByDoc: {
            ...prev.stats.lastDownloadByDoc,
            [doc.id]: formattedDate
          }
        },
        auditLog: [newEntry, ...prev.auditLog].slice(0, 100), // Mantener los últimos 100 movimientos
        docStatus: {
          ...prev.docStatus,
          [doc.id]: 'tramitado'
        }
      };
    });
  };

  const toggleDocStatus = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDb(prev => {
      const current = prev.docStatus[docId] || 'pendiente';
      const next = current === 'pendiente' ? 'tramitado' : current === 'tramitado' ? 'archivado' : 'pendiente';
      return {
        ...prev,
        docStatus: {
          ...prev.docStatus,
          [docId]: next
        }
      };
    });
  };

  const saveUnitData = (e: React.FormEvent) => {
    e.preventDefault();
    setDb(prev => ({
      ...prev,
      unitData: unitForm
    }));
    alert('Configuración institucional guardada en la base de datos localStorage.');
  };

  const exportDatabaseJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `respaldo_db_gddhh_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const resetDatabase = () => {
    if (confirm('¿Está seguro de restablecer la base de datos local? Se borrará el historial de descargas y contadores.')) {
      setDb(defaultDatabase);
      localStorage.removeItem(DB_KEY);
      alert('Base de datos restablecida.');
    }
  };

  const optimizeAndStore = (file: File, key: string, maxDim: number, setter: (val: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          try {
            localStorage.setItem(key, compressed);
          } catch {}
          setter(compressed);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleShieldUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      optimizeAndStore(e.target.files[0], 'inst_shield_img', 400, setShieldImg);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      optimizeAndStore(e.target.files[0], 'inst_app_bg', 1600, setBgImg);
    }
  };

  const handleSectionBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      optimizeAndStore(e.target.files[0], 'inst_sec_bg', 1200, setSectionBgImg);
    }
  };

  const visibleDocs = directDocs.filter((d) => d.tab === activeTab);

  return (
    <div
      className="relative min-h-screen text-slate-100 flex flex-col items-center justify-start py-4 px-3 sm:px-6 font-sans selection:bg-amber-500/30 selection:text-amber-200"
      style={{
        backgroundColor: '#070b10',
        backgroundImage: bgImg ? `url(${bgImg})` : 'radial-gradient(ellipse at 50% 0%, #111a28 0%, #070b10 80%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background Dimmer Overlay */}
      {bgImg && <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] pointer-events-none z-0" />}

      {/* Main 16:9 Institutional Widescreen Container */}
      <div className="relative z-10 w-full max-w-[1440px] flex flex-col my-auto border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden bg-[#0c1219]/95 backdrop-blur-md">
        
        {/* Top Control Bar with LocalStorage DB Button */}
        <div className="bg-[#090d14] px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold tracking-wider text-slate-300">
              {db.unitData.granUnidad} — EJÉRCITO DE BOLIVIA
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-amber-400 font-mono">
              GESTIÓN {db.unitData.gestion}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Database Panel Trigger */}
            <button
              type="button"
              onClick={() => setIsDbModalOpen(true)}
              className="flex items-center gap-1.5 transition-colors cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded font-semibold shadow-sm"
              title="Abrir base de datos localStorage y auditoría de descargas"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Base de Datos ({db.stats.totalDownloads})</span>
            </button>

            <button
              type="button"
              onClick={() => shieldInputRef.current?.click()}
              className="hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-800/60 hover:bg-slate-800 px-2 py-1 rounded border border-slate-700/60"
              title="Cambiar imagen del escudo (ajuste exacto al marco)"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Escudo</span>
            </button>
            <button
              type="button"
              onClick={() => sectionBgInputRef.current?.click()}
              className="hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-800/60 hover:bg-slate-800 px-2 py-1 rounded border border-slate-700/60"
              title="Insertar fondo en la sección de Género y Derechos Humanos"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Fondo Sección</span>
            </button>
            <button
              type="button"
              onClick={() => bgInputRef.current?.click()}
              className="hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-800/60 hover:bg-slate-800 px-2 py-1 rounded border border-slate-700/60"
              title="Insertar imagen de fondo general"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Fondo General</span>
            </button>
            {(shieldImg || bgImg || sectionBgImg) && (
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('inst_shield_img');
                    localStorage.removeItem('inst_app_bg');
                    localStorage.removeItem('inst_sec_bg');
                  } catch {}
                  setShieldImg(null);
                  setBgImg(null);
                  setSectionBgImg(null);
                }}
                className="hover:text-red-400 flex items-center gap-1 text-slate-400 transition-colors cursor-pointer px-1 py-1"
                title="Restablecer imágenes por defecto"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Hidden File Inputs */}
        <input ref={shieldInputRef} type="file" accept="image/*" onChange={handleShieldUpload} className="hidden" />
        <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
        <input ref={sectionBgInputRef} type="file" accept="image/*" onChange={handleSectionBgUpload} className="hidden" />

        {/* Institutional Header with Shield Frame (Exact Fit) */}
        <header
          className="relative px-6 py-5 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5 transition-all overflow-hidden"
          style={{
            backgroundImage: sectionBgImg ? `url(${sectionBgImg})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: sectionBgImg ? undefined : '#0f1722',
          }}
        >
          {sectionBgImg && <div className="absolute inset-0 bg-[#0b111a]/85 backdrop-blur-[1px] pointer-events-none" />}

          <div className="relative z-10 flex items-center gap-5 text-center md:text-left">
            {/* Custom Shield Frame - Exact Fit with Zero Red Circles/Badges */}
            <div
              onClick={() => shieldInputRef.current?.click()}
              className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-500/50 bg-[#080d14] flex items-center justify-center cursor-pointer shadow-lg hover:border-amber-400 transition-all group shrink-0"
              title="Haga clic para cambiar la imagen del escudo"
            >
              {shieldImg ? (
                <img
                  src={shieldImg}
                  alt="Escudo Institucional"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-amber-400/90 group-hover:scale-105 transition-transform">
                  <Shield className="w-10 h-10 stroke-[1.75]" />
                  <span className="text-[9px] font-bold tracking-widest text-amber-500 mt-0.5">BOLIVIA</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                  {db.unitData.granUnidad}
                </span>
                <span className="text-xs text-slate-400">EJÉRCITO DE BOLIVIA</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {db.unitData.pequenaUnidad}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Descarga de documentos Word originales (.docx) con base de datos en localStorage
              </p>
            </div>
          </div>

          {/* Quick Notice & DB Metrics Badge */}
          <div className="relative z-10 hidden lg:flex flex-col items-end text-right bg-slate-900/80 border border-slate-700/60 px-4 py-2 rounded-lg">
            <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" /> BASE DE DATOS LOCAL ACTIVA
            </span>
            <span className="text-[11px] text-slate-300">
              Total descargas: <strong className="text-amber-400">{db.stats.totalDownloads}</strong> | Tramitados: <strong className="text-emerald-400">{Object.values(db.docStatus).filter(s => s === 'tramitado').length}</strong>
            </span>
          </div>
        </header>

        {/* Operational Notice Banner */}
        <div className="bg-amber-950/30 border-b border-amber-500/30 px-6 py-2 flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Base de Datos Integrada:</strong> Cada descarga y estado se almacena de forma persistente en <code>localStorage</code>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsDbModalOpen(true)}
            className="text-amber-300 hover:text-white underline cursor-pointer font-medium text-[11px]"
          >
            Ver Bitácora / Exportar DB
          </button>
        </div>

        {/* 3-TAB SYSTEM (SISTEMA DE PESTAÑAS) */}
        <nav className="bg-[#090d14] border-b border-slate-800 px-4 sm:px-6 flex items-center gap-2 sm:gap-4 overflow-x-auto select-none">
          {/* Tab 1 */}
          <button
            type="button"
            onClick={() => setActiveTab('anexos')}
            className={`py-3.5 px-5 font-bold text-sm tracking-wide transition-all border-b-2 flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'anexos'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Pestaña 1: Anexos</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold ${
              activeTab === 'anexos' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
            }`}>
              9
            </span>
          </button>

          {/* Tab 2 */}
          <button
            type="button"
            onClick={() => setActiveTab('principal')}
            className={`py-3.5 px-5 font-bold text-sm tracking-wide transition-all border-b-2 flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'principal'
                ? 'border-blue-400 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Pestaña 2: Carpeta Principal</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold ${
              activeTab === 'principal' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
            }`}>
              11
            </span>
          </button>

          {/* Tab 3 */}
          <button
            type="button"
            onClick={() => setActiveTab('secundaria')}
            className={`py-3.5 px-5 font-bold text-sm tracking-wide transition-all border-b-2 flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'secundaria'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Folders className="w-4 h-4" />
            <span>Pestaña 3: Carpeta Secundaria</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold ${
              activeTab === 'secundaria' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
            }`}>
              6
            </span>
          </button>
        </nav>

        {/* Tab Header Banner */}
        <div className="bg-[#0b1017] px-6 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider">
              {activeTab === 'anexos' && 'Archivos de la Pestaña 1: Anexos Normativos (A al I)'}
              {activeTab === 'principal' && 'Archivos de la Pestaña 2: Carpeta Principal (11 Archivos Oficiales)'}
              {activeTab === 'secundaria' && 'Archivos de la Pestaña 3: Carpeta Secundaria (6 Registros y Cuadros)'}
            </span>
          </div>
          <span className="font-mono text-slate-400">
            Total en vista: <strong className="text-white">{visibleDocs.length}</strong> documentos
          </span>
        </div>

        {/* Central Grid of BUTTON Elements with data-file Attribute */}
        <main className="p-5 sm:p-7 overflow-y-auto max-h-[66vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleDocs.map((doc) => {
              const isRecent = lastDownloaded === doc.id;
              const downloadCount = db.stats.downloadsByDoc[doc.id] || 0;
              const status = db.docStatus[doc.id] || 'pendiente';
              const lastDate = db.stats.lastDownloadByDoc[doc.id];

              return (
                <button
                  key={doc.id}
                  type="button"
                  data-file={doc.filePath}
                  onClick={() => ejecutarDescargaSegura(doc)}
                  className={`group relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none ${
                    isRecent
                      ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-500/10 scale-[1.01]'
                      : 'bg-[#101722] hover:bg-[#151f2e] border-slate-700/70 hover:border-amber-400/80 shadow-md hover:shadow-xl hover:shadow-black/40'
                  }`}
                  style={{ minHeight: '148px' }}
                >
                  {/* Top Row: Code Badge & Status Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2 w-full">
                    <span className="px-2.5 py-1 rounded bg-[#090e15] border border-slate-700 font-mono text-xs font-bold text-amber-400 group-hover:text-amber-300 group-hover:border-amber-500/40 transition-colors">
                      {doc.code}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* State toggle pill from localStorage */}
                      <span
                        onClick={(e) => toggleDocStatus(doc.id, e)}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold cursor-pointer transition-colors border ${
                          status === 'tramitado'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : status === 'archivado'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                        title="Haga clic para alternar estado: Pendiente / Tramitado / Archivado"
                      >
                        {status === 'tramitado' ? '✓ TRAMITADO' : status === 'archivado' ? '📁 ARCHIVADO' : '○ PENDIENTE'}
                      </span>

                      <span className="flex items-center gap-1 font-mono text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        <FileText className="w-3 h-3" /> .DOCX
                      </span>
                    </div>
                  </div>

                  {/* Document Title (Large and Clear) */}
                  <div className="my-1 flex-1 w-full">
                    <h3 className="text-sm sm:text-[15px] font-bold text-white group-hover:text-amber-200 transition-colors leading-snug line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                      {doc.filePath}
                    </p>
                  </div>

                  {/* Bottom Action Bar with LocalStorage Metrics */}
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between w-full text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Database className="w-3 h-3 text-amber-500" />
                        <span>Descargas: <strong className="text-amber-400">{downloadCount}</strong></span>
                      </span>
                      {lastDate && (
                        <span className="text-[9px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-slate-400" />
                          <span>{lastDate}</span>
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all group-hover:scale-105">
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Descargar</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </main>

        {/* Footer with Institutional Attribution */}
        <footer className="bg-[#090d14] px-6 py-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{db.unitData.granUnidad} — {db.unitData.pequenaUnidad} — {db.unitData.responsable}</span>
          <span className="font-mono text-slate-400 flex items-center gap-2">
            <span>Base de datos en localStorage: {db.stats.totalDownloads} registros</span>
            <button
              onClick={() => setIsDbModalOpen(true)}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              [Gestionar DB]
            </button>
          </span>
        </footer>
      </div>

      {/* DATABASE MODAL / DRAWER (BASE DE DATOS LOCALSTORAGE) */}
      {isDbModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d1520] border border-amber-500/40 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            
            {/* Modal Header */}
            <div className="bg-[#080d14] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Base de Datos Local (localStorage)
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      PERSISTENCIA ACTIVA
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Control de expedientes, registro histórico de descargas y configuración castrense
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDbModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#101926] p-3.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Total Descargas</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">{db.stats.totalDownloads}</span>
                </div>
                <div className="bg-[#101926] p-3.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Doc. Tramitados</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {Object.values(db.docStatus).filter(s => s === 'tramitado').length}
                  </span>
                </div>
                <div className="bg-[#101926] p-3.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Doc. Archivados</span>
                  <span className="text-2xl font-black text-blue-400 font-mono">
                    {Object.values(db.docStatus).filter(s => s === 'archivado').length}
                  </span>
                </div>
                <div className="bg-[#101926] p-3.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Gestión Activa</span>
                  <span className="text-2xl font-black text-white font-mono">{db.unitData.gestion}</span>
                </div>
              </div>

              {/* Unit Configuration Form (Persisted in localStorage) */}
              <div className="bg-[#101926] p-5 rounded-lg border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Save className="w-4 h-4 text-amber-400" />
                  Configuración de la Unidad Militar (Persistente)
                </h3>
                <form onSubmit={saveUnitData} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Gran Unidad</label>
                    <input
                      type="text"
                      value={unitForm.granUnidad}
                      onChange={(e) => setUnitForm({ ...unitForm, granUnidad: e.target.value })}
                      className="w-full bg-[#080d14] border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Sección o Repartición</label>
                    <input
                      type="text"
                      value={unitForm.pequenaUnidad}
                      onChange={(e) => setUnitForm({ ...unitForm, pequenaUnidad: e.target.value })}
                      className="w-full bg-[#080d14] border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Oficial Responsable</label>
                    <input
                      type="text"
                      value={unitForm.responsable}
                      onChange={(e) => setUnitForm({ ...unitForm, responsable: e.target.value })}
                      className="w-full bg-[#080d14] border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Año / Gestión</label>
                    <input
                      type="text"
                      value={unitForm.gestion}
                      onChange={(e) => setUnitForm({ ...unitForm, gestion: e.target.value })}
                      className="w-full bg-[#080d14] border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Guardar Cambios en localStorage
                    </button>
                  </div>
                </form>
              </div>

              {/* Audit Log / History Table */}
              <div className="bg-[#101926] p-5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-400" />
                    Bitácora de Auditoría Castrense (Últimas Transacciones)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {db.auditLog.length} registros almacenados
                  </span>
                </div>

                {db.auditLog.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    Aún no se han registrado descargas en esta sesión. Al hacer clic en cualquier documento se generará su registro aquí automáticamente.
                  </p>
                ) : (
                  <div className="overflow-x-auto max-h-56">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#080d14] text-slate-400 uppercase font-mono text-[10px] sticky top-0">
                        <tr>
                          <th className="p-2">Fecha y Hora</th>
                          <th className="p-2">Código</th>
                          <th className="p-2">Documento</th>
                          <th className="p-2">Categoría</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                        {db.auditLog.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-800/40">
                            <td className="p-2 text-slate-400">{log.timestamp}</td>
                            <td className="p-2 font-bold text-amber-400">{log.code}</td>
                            <td className="p-2 text-white truncate max-w-xs">{log.title}</td>
                            <td className="p-2 text-slate-400">{log.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer with Data Management Actions */}
            <div className="bg-[#080d14] px-6 py-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportDatabaseJson}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  Exportar Respaldo JSON
                </button>
                <button
                  type="button"
                  onClick={resetDatabase}
                  className="bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/60 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Restablecer Base de Datos
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsDbModalOpen(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded text-xs transition-colors cursor-pointer"
              >
                Cerrar Panel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
