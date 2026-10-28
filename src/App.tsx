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
  Share2,
  FileDown,
  Info,
  SlidersHorizontal,
  Sparkles,
  Check,
  Printer
} from 'lucide-react';
import { generateCompliantWordBlob } from './utils/wordGenerator';

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

type TabType = 'anexos' | 'principal' | 'secundaria';

function parseTabFromUrl(): TabType {
  if (typeof window === 'undefined') return 'anexos';

  // 1. Check URL Hash: #principal, #secundaria, #anexos, #tab2, #tab3
  const hash = window.location.hash.toLowerCase().replace('#', '').trim();
  if (hash === 'principal' || hash === 'carpeta-principal' || hash === 'carpeta_principal' || hash === 'tab2' || hash === '2') {
    return 'principal';
  }
  if (hash === 'secundaria' || hash === 'carpeta-secundaria' || hash === 'carpeta_secundaria' || hash === 'tab3' || hash === '3') {
    return 'secundaria';
  }
  if (hash === 'anexos' || hash === 'tab1' || hash === '1') {
    return 'anexos';
  }

  // 2. Check Query Parameters: ?tab=principal, ?p=secundaria, etc.
  try {
    const params = new URLSearchParams(window.location.search);
    const qTab = (params.get('tab') || params.get('p') || params.get('pestana'))?.toLowerCase().trim();
    if (qTab === 'principal' || qTab === 'carpeta-principal' || qTab === 'carpeta_principal' || qTab === '2') {
      return 'principal';
    }
    if (qTab === 'secundaria' || qTab === 'carpeta-secundaria' || qTab === 'carpeta_secundaria' || qTab === '3') {
      return 'secundaria';
    }
    if (qTab === 'anexos' || qTab === '1') {
      return 'anexos';
    }
  } catch {}

  // 3. Check Pathname: /principal, /secundaria, /carpeta-principal, /carpeta-secundaria
  try {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('principal')) return 'principal';
    if (path.includes('secundaria')) return 'secundaria';
  } catch {}

  // 4. Check LocalStorage fallback
  try {
    const saved = localStorage.getItem('gddhh_active_tab') as TabType;
    if (saved === 'principal' || saved === 'secundaria' || saved === 'anexos') {
      return saved;
    }
  } catch {}

  return 'anexos';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(parseTabFromUrl);
  const [lastDownloaded, setLastDownloaded] = useState<string | null>(null);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Sync tab changes to URL hash and localStorage
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('gddhh_active_tab', tab);
      if (typeof window !== 'undefined' && window.location.hash !== `#${tab}`) {
        window.history.replaceState(null, '', `#${tab}`);
      }
    } catch {}
  };

  // Listen to browser hash changes & popstate (Back/Forward buttons)
  useEffect(() => {
    const handleLocationChange = () => {
      const tab = parseTabFromUrl();
      setActiveTab(tab);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

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

  // Estado del formato de descarga y modales de especificaciones
  const [downloadFormat, setDownloadFormat] = useState<'normado' | 'original'>('normado');
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [generatingDocId, setGeneratingDocId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState<{ total: number; current: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Registro unificado de transacciones en la Base de Datos Local (localStorage)
  const registrarTransaccionDb = (doc: DirectDocLink, formatoDescarga: string) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('es-BO')} ${now.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}`;

    setDb(prev => {
      const currentDocCount = (prev.stats.downloadsByDoc[doc.id] || 0) + 1;
      const newEntry: AuditLogEntry = {
        id: `log_${Date.now()}`,
        docId: doc.id,
        code: doc.code,
        title: `${doc.title} [${formatoDescarga}]`,
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
        auditLog: [newEntry, ...prev.auditLog].slice(0, 100),
        docStatus: {
          ...prev.docStatus,
          [doc.id]: 'tramitado'
        }
      };
    });
  };

  // 1. DESCARGA EN FORMATO WORD OFICIAL NORMADO (.DOCX):
  // Márgenes: Izq 3cm, Der 2cm, Inf 2cm, Sup 2cm | Encabezado Arial 10 pegado al costado izquierdo
  // Título Arial 16 con negrilla | Párrafos Arial 12 con negrilla y subrayado | Texto Arial 12 sin negrilla | Sangría francesa
  const ejecutarDescargaWordNormado = async (doc: DirectDocLink) => {
    setGeneratingDocId(doc.id);
    try {
      const docxBlob = await generateCompliantWordBlob(doc, db.unitData);
      const blobUrl = URL.createObjectURL(docxBlob);
      const enlace = document.createElement('a');
      enlace.href = blobUrl;
      enlace.setAttribute('download', doc.filename);
      enlace.style.display = 'none';
      document.body.appendChild(enlace);
      enlace.click();

      setTimeout(() => {
        document.body.removeChild(enlace);
        URL.revokeObjectURL(blobUrl);
      }, 1000);

      setLastDownloaded(doc.id);
      registrarTransaccionDb(doc, 'Word Normado (Márgenes 3-2-2-2 cm, Arial, Sangría Francesa)');
      showToast(`✓ Documento Word normado "${doc.code}" descargado con éxito`);
    } catch (err) {
      console.error('Error generando Word normado, procediendo a respaldo físico:', err);
      await ejecutarDescargaSegura(doc);
    } finally {
      setGeneratingDocId(null);
    }
  };

  // 2. DESCARGA DEL ARCHIVO FÍSICO ORIGINAL (.DOCX)
  const ejecutarDescargaSegura = async (doc: DirectDocLink) => {
    const isLocalFileProtocol = typeof window !== 'undefined' && window.location.protocol === 'file:';
    const cleanPath = isLocalFileProtocol 
      ? doc.filePath 
      : (doc.filePath.startsWith('/') ? doc.filePath : `/${doc.filePath}`);
    const nombreArchivo = doc.filename || doc.filePath.substring(doc.filePath.lastIndexOf('/') + 1);

    const candidatePaths: string[] = [
      encodeURI(cleanPath),
      cleanPath,
      encodeURI(cleanPath.replace('Carpeta Principal', 'Carpeta_Principal').replace('Carpeta Secundaria', 'Carpeta_Secundaria')),
      cleanPath.replace('Carpeta Principal', 'Carpeta_Principal').replace('Carpeta Secundaria', 'Carpeta_Secundaria'),
      `/${encodeURIComponent(doc.filePath)}`
    ];

    let downloadedSuccessfully = false;

    for (const testPath of candidatePaths) {
      try {
        const response = await fetch(testPath);
        const contentType = response.headers.get('content-type') || '';
        
        if (!response.ok || contentType.includes('text/html')) {
          continue;
        }

        const originalBlob = await response.blob();
        
        // Verificación de firma binaria PK (OpenXML ZIP)
        const headBuf = await originalBlob.slice(0, 4).arrayBuffer();
        const headBytes = new Uint8Array(headBuf);
        const isZipFormat = headBytes[0] === 0x50 && headBytes[1] === 0x4B;
        if (!isZipFormat) {
          continue;
        }

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

        downloadedSuccessfully = true;
        break;
      } catch {
        // siguiente intento
      }
    }

    if (!downloadedSuccessfully) {
      const fallbackPath = encodeURI(cleanPath);
      const enlaceFallback = document.createElement('a');
      enlaceFallback.href = fallbackPath;
      enlaceFallback.setAttribute('download', nombreArchivo);
      enlaceFallback.style.display = 'none';
      document.body.appendChild(enlaceFallback);
      enlaceFallback.click();

      setTimeout(() => {
        document.body.removeChild(enlaceFallback);
      }, 500);
    }

    setLastDownloaded(doc.id);
    registrarTransaccionDb(doc, 'Archivo Físico Original');
    showToast(`✓ Archivo original "${doc.code}" descargado`);
  };

  // Selector de descarga inteligente
  const handleDescargarDocumento = (doc: DirectDocLink, formato?: 'normado' | 'original') => {
    const targetFormat = formato || downloadFormat;
    if (targetFormat === 'normado') {
      ejecutarDescargaWordNormado(doc);
    } else {
      ejecutarDescargaSegura(doc);
    }
  };

  // Descarga en lote de todos los documentos visibles en la pestaña activa
  const descargarTodoLoteNormado = async () => {
    const docs = visibleDocs;
    if (batchProgress) return;
    setBatchProgress({ total: docs.length, current: 0 });

    for (let i = 0; i < docs.length; i++) {
      const d = docs[i];
      setBatchProgress({ total: docs.length, current: i + 1 });
      await ejecutarDescargaWordNormado(d);
      // Pequeño intervalo para no saturar el gestor de descargas del navegador
      await new Promise(res => setTimeout(res, 600));
    }

    setBatchProgress(null);
    showToast(`✓ Se descargaron los ${docs.length} documentos con formato Word normado.`);
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

        {/* Word Normative Standards & DB Status Banner */}
        <div className="bg-[#0e1724] border-b border-amber-500/30 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wide bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Formato Word Normado (.docx):</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              Márgenes: <strong>Izq 3cm | Der 2cm | Inf 2cm | Sup 2cm</strong>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              Encabezado: <strong>Arial 10 Izq</strong>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              Título: <strong>Arial 16 Negrilla</strong>
            </span>
            <span className="hidden xl:inline-flex items-center gap-1 text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              Párrafos: <strong>Arial 12 Negrilla Subrayado</strong>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
              <Check className="w-3 h-3" /> Sangría Francesa
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSpecsOpen(true)}
              className="text-amber-300 hover:text-white underline cursor-pointer font-medium text-[11px] flex items-center gap-1"
              title="Ver ficha técnica completa del formato Word exigido"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Ver Ficha Técnica</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={() => setIsDbModalOpen(true)}
              className="text-slate-300 hover:text-amber-300 cursor-pointer font-medium text-[11px] flex items-center gap-1"
            >
              <Database className="w-3 h-3 text-amber-400" />
              <span>Bitácora ({db.stats.totalDownloads})</span>
            </button>
          </div>
        </div>

        {/* 3-TAB SYSTEM (SISTEMA DE PESTAÑAS) */}
        <nav className="bg-[#090d14] border-b border-slate-800 px-4 sm:px-6 flex items-center gap-2 sm:gap-4 overflow-x-auto select-none">
          {/* Tab 1 */}
          <button
            type="button"
            onClick={() => handleTabChange('anexos')}
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
            onClick={() => handleTabChange('principal')}
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
            onClick={() => handleTabChange('secundaria')}
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

        {/* Tab Header Banner with Batch Download Button */}
        <div className="bg-[#0b1017] px-4 sm:px-6 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200 uppercase tracking-wider">
              {activeTab === 'anexos' && 'Pestaña 1: Anexos Normativos (9 Documentos A al I)'}
              {activeTab === 'principal' && 'Pestaña 2: Carpeta Principal (11 Archivos Oficiales)'}
              {activeTab === 'secundaria' && 'Pestaña 3: Carpeta Secundaria (6 Registros y Cuadros)'}
            </span>
            <span className="font-mono text-slate-400 hidden sm:inline">
              ({visibleDocs.length} documentos)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!!batchProgress}
              onClick={descargarTodoLoteNormado}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
              title="Descarga en secuencia todos los archivos de esta pestaña con las especificaciones Word de márgenes y sangría francesa"
            >
              {batchProgress ? (
                <>
                  <div className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Descargando {batchProgress.current}/{batchProgress.total}...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Descargar Todo en Word Normado ({visibleDocs.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Central Grid of BUTTON Elements with data-file Attribute */}
        <main className="p-4 sm:p-6 overflow-y-auto max-h-[66vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleDocs.map((doc) => {
              const isRecent = lastDownloaded === doc.id;
              const isGenerating = generatingDocId === doc.id;
              const downloadCount = db.stats.downloadsByDoc[doc.id] || 0;
              const status = db.docStatus[doc.id] || 'pendiente';
              const lastDate = db.stats.lastDownloadByDoc[doc.id];

              return (
                <div
                  key={doc.id}
                  data-file={doc.filePath}
                  className={`group relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-200 select-none ${
                    isRecent
                      ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                      : 'bg-[#101722] hover:bg-[#131c2b] border-slate-700/70 hover:border-amber-400/80 shadow-md hover:shadow-xl hover:shadow-black/40'
                  }`}
                  style={{ minHeight: '172px' }}
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
                    
                    {/* Formatting specs tag */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/50 border border-emerald-600/30 px-1.5 py-0.5 rounded">
                        Márgenes 3-2-2-2 cm
                      </span>
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-950/50 border border-amber-600/30 px-1.5 py-0.5 rounded">
                        Arial 10/16/12
                      </span>
                      <span className="text-[10px] font-mono text-blue-300 bg-blue-950/50 border border-blue-600/30 px-1.5 py-0.5 rounded">
                        Sangría Francesa
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Bar: Dual Download Controls */}
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between w-full text-xs gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 truncate">
                        <Database className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>Descargas: <strong className="text-amber-400">{downloadCount}</strong></span>
                      </span>
                      {lastDate && (
                        <span className="text-[9px] text-slate-400 flex items-center gap-1 truncate">
                          <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span>{lastDate}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Secondary button: Original raw template file */}
                      <button
                        type="button"
                        data-file={doc.filePath}
                        onClick={() => ejecutarDescargaSegura(doc)}
                        className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-[11px] font-semibold transition-colors cursor-pointer"
                        title="Descargar archivo físico original sin reestructuración"
                      >
                        Original
                      </button>

                      {/* Primary button: Exact Word Compliant Document */}
                      <button
                        type="button"
                        disabled={isGenerating}
                        onClick={() => ejecutarDescargaWordNormado(doc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
                        title="Descargar en formato Word (.docx) con márgenes 3/2/2/2 cm, Arial 10/16/12 y sangría francesa"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Creando...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Word Normado</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
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

      {/* MODAL DE ESPECIFICACIONES TÉCNICAS DEL FORMATO WORD */}
      {isSpecsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-[#0c1420] border border-amber-500/50 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            
            {/* Modal Header */}
            <div className="bg-[#080d14] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Ficha Técnica: Formato Word Oficial (.docx)
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      NORMA MILITAR APLICADA
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Reglas estrictas de maquetación, márgenes, tipografía Arial y sangría francesa
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSpecsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
              
              {/* Margins Visual Diagram */}
              <div className="bg-[#101926] p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  1. Dimensiones de Márgenes en Hoja Carta / A4 (Twips OpenXML)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-[#090e16] p-3 rounded-lg border border-emerald-500/40">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Margen Izquierdo</span>
                    <strong className="text-base text-emerald-300 font-mono">3.0 cm</strong>
                    <span className="text-[9px] text-slate-500 block mt-0.5">1701 twips</span>
                  </div>
                  <div className="bg-[#090e16] p-3 rounded-lg border border-blue-500/40">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Margen Derecho</span>
                    <strong className="text-base text-blue-300 font-mono">2.0 cm</strong>
                    <span className="text-[9px] text-slate-500 block mt-0.5">1134 twips</span>
                  </div>
                  <div className="bg-[#090e16] p-3 rounded-lg border border-amber-500/40">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Margen Superior</span>
                    <strong className="text-base text-amber-300 font-mono">2.0 cm</strong>
                    <span className="text-[9px] text-slate-500 block mt-0.5">1134 twips</span>
                  </div>
                  <div className="bg-[#090e16] p-3 rounded-lg border border-amber-500/40">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Margen Inferior</span>
                    <strong className="text-base text-amber-300 font-mono">2.0 cm</strong>
                    <span className="text-[9px] text-slate-500 block mt-0.5">1134 twips</span>
                  </div>
                </div>
              </div>

              {/* Typography Rules */}
              <div className="bg-[#101926] p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  2. Jerarquía Tipográfica Institucional (Fuente Arial)
                </h4>

                <div className="space-y-2.5">
                  <div className="bg-[#080d14] p-3 rounded-lg border border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-white block">Encabezado Institucional:</span>
                      <p className="text-[11px] text-slate-400">
                        Arial 10 pt pegado al costado izquierdo (left-aligned) con la jerarquía del Comando General y la Gran Unidad.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-amber-300 shrink-0">
                      Arial 10 pt (Izq)
                    </span>
                  </div>

                  <div className="bg-[#080d14] p-3 rounded-lg border border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-white block">Título Principal del Documento:</span>
                      <p className="text-[11px] text-slate-400">
                        Arial 16 pt con negrilla, centrado y mayúsculas sostenidas conforme a la carátula y el índice oficial.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-amber-300 shrink-0">
                      Arial 16 pt (Negrilla)
                    </span>
                  </div>

                  <div className="bg-[#080d14] p-3 rounded-lg border border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-white block">Títulos de Párrafos / Secciones:</span>
                      <p className="text-[11px] text-slate-400">
                        Arial 12 pt con negrilla y subrayado para cada subdivisión temática y artículo de trámite.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-amber-300 shrink-0">
                      Arial 12 pt (Negrilla + Subrayado)
                    </span>
                  </div>

                  <div className="bg-[#080d14] p-3 rounded-lg border border-slate-800 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-white block">Cuerpo de Texto y Articulados:</span>
                      <p className="text-[11px] text-slate-400">
                        Arial 12 pt sin negrilla (regular), interlineado 1.15 y alineación justificada.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-amber-300 shrink-0">
                      Arial 12 pt (Regular)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sangría Francesa Demonstration */}
              <div className="bg-[#101926] p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  3. Sangría Francesa (Hanging Indent)
                </h4>
                <p className="text-[11px] text-slate-300 mb-3">
                  La sangría francesa mantiene la primera línea al ras del margen izquierdo y desplaza las líneas subsiguientes 1.25 cm hacia la derecha, facilitando la lectura jerárquica militar:
                </p>

                <div className="bg-[#080d14] p-4 rounded-lg border border-slate-700/80 font-serif text-[11px] text-slate-200">
                  <p className="pl-6 -indent-6 leading-relaxed">
                    <strong>1.1. Artículo Demostrativo:</strong> En estricto apego a las disposiciones de la Constitución Política del Estado y las directivas castrenses, todo trámite se procesará bajo el amparo de la debida diligencia y fe militar.
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-[#080d14] px-6 py-3.5 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Total 26 documentos compatibles con la norma Word
              </span>
              <button
                type="button"
                onClick={() => setIsSpecsOpen(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded text-xs transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-[#0f241a] border border-emerald-500/70 text-emerald-200 px-4 py-2.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom duration-300 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-emerald-400/80 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
