import React, { useState } from 'react';
import { 
  Zap, 
  RotateCcw, 
  ArrowLeft, 
  ShieldAlert, 
  FileText, 
  Download, 
  AlertTriangle, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertOctagon,
  Shield
} from 'lucide-react';

import type { DirectDocLink } from '../App';

interface DecisionTreeProps {
  directDocs: DirectDocLink[];
  onDownloadWordNormado: (doc: DirectDocLink) => void;
  onDownloadOriginal?: (doc: DirectDocLink) => void;
}

type TreeStep = 'step-1' | 'step-2a' | 'step-2b' | 'result-a1' | 'result-a2' | 'result-b1' | 'result-b2';

export const DecisionTreeProtocol: React.FC<DecisionTreeProps> = ({
  directDocs,
  onDownloadWordNormado,
  onDownloadOriginal
}) => {
  const [currentStep, setCurrentStep] = useState<TreeStep>('step-1');

  const getDoc = (code: string) => directDocs.find(d => d.code === code);

  return (
    <div className="max-w-4xl mx-auto py-2">
      
      {/* PANTALLA INICIAL (Paso 1): EVALUACIÓN INICIAL DEL INCIDENTE */}
      {currentStep === 'step-1' && (
        <div className="bg-[#0f1725] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in duration-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" /> Paso 1 • Simulador de Toma de Decisiones
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            EVALUACIÓN INICIAL DEL INCIDENTE
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Guía de respuesta operativa inmediata para el Oficial de Género y Derechos Humanos ante denuncias en la Unidad Militar. Seleccione la naturaleza del hecho denunciado para determinar el plan de acción, los plazos críticos y los formularios oficiales requeridos.
          </p>

          <div className="bg-[#090e17] border-l-4 border-amber-400 p-4 rounded-r-xl mb-6">
            <h3 className="text-base sm:text-lg font-bold text-amber-300">
              ¿Cuál es la naturaleza de la denuncia?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep('step-2a')}
              className="group flex flex-col items-start p-6 rounded-xl bg-[#131d2e] hover:bg-[#18263c] border-2 border-slate-700 hover:border-amber-400 text-left transition-all shadow-lg hover:shadow-amber-500/10 cursor-pointer"
            >
              <span className="text-lg font-black text-white group-hover:text-amber-300 flex items-center gap-2 mb-2">
                🔴 Botón A: Acoso Sexual / Laboral
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conductas de hostigamiento, chantaje, comentarios lascivos, intimidación o abusos de autoridad de carácter sexual o laboral en el entorno de servicio militar.
              </p>
              <span className="mt-4 text-xs font-bold text-amber-400">
                Continuar a valoración de gravedad →
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep('step-2b')}
              className="group flex flex-col items-start p-6 rounded-xl bg-[#131d2e] hover:bg-[#23151f] border-2 border-slate-700 hover:border-rose-500 text-left transition-all shadow-lg hover:shadow-rose-500/10 cursor-pointer"
            >
              <span className="text-lg font-black text-white group-hover:text-rose-300 flex items-center gap-2 mb-2">
                🛡️ Botón B: Violencia Intrafamiliar (VIF)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Agresiones físicas, psicológicas, sexuales o patrimoniales que involucren al personal militar en su entorno conyugal o familiar conforme a la Ley 348.
              </p>
              <span className="mt-4 text-xs font-bold text-rose-400">
                Continuar a valoración de riesgo vital →
              </span>
            </button>
          </div>
        </div>
      )}

      {/* PANTALLA 2A: RUTA ACOSO */}
      {currentStep === 'step-2a' && (
        <div className="bg-[#0f1725] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in duration-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            Paso 2A • Ruta: Acoso Sexual / Laboral
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            VALORACIÓN DE GRAVEDAD DEL ACOSO
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Clasifique la gravedad de los hechos según la manifestación de la persona afectada y los elementos iniciales de convicción para definir si corresponde trámite disciplinario interno o derivación penal ordinaria.
          </p>

          <div className="bg-[#090e17] border-l-4 border-amber-400 p-4 rounded-r-xl mb-6">
            <h3 className="text-base sm:text-lg font-bold text-amber-300">
              Determine el nivel de gravedad según relato inicial:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setCurrentStep('result-a1')}
              className="group flex flex-col items-start p-6 rounded-xl bg-[#131d2e] hover:bg-[#18263c] border-2 border-slate-700 hover:border-amber-400 text-left transition-all shadow-lg hover:shadow-amber-500/10 cursor-pointer"
            >
              <span className="text-base font-bold text-white group-hover:text-amber-300 mb-2">
                Botón 2A-1: Nivel 1 o 2 (Verbal / Sin contacto físico)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comentarios lascivos, insinuaciones verbales, bromas machistas, mensajes reiterados por redes sociales o aislamiento funcional, sin agresión corporal.
              </p>
              <span className="mt-4 text-xs font-bold text-amber-400">
                Aplicar Plan de Falta Disciplinaria →
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep('result-a2')}
              className="group flex flex-col items-start p-6 rounded-xl bg-[#131d2e] hover:bg-[#23151f] border-2 border-slate-700 hover:border-rose-500 text-left transition-all shadow-lg hover:shadow-rose-500/10 cursor-pointer"
            >
              <span className="text-base font-bold text-white group-hover:text-rose-300 mb-2">
                Botón 2A-2: Nivel 3 (Físico / Coercitivo / Condicionamiento)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tocamientos corporales no consentidos, condicionamiento de ascensos o calificaciones a favores sexuales, intimidación armada o agresión corporal explícita.
              </p>
              <span className="mt-4 text-xs font-bold text-rose-400">
                Aplicar Plan de Delito Penal (Art. 312 quater) →
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep('step-1')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
            </button>
            <span className="text-xs text-slate-500 font-mono">Paso 2 de 3</span>
          </div>
        </div>
      )}

      {/* PANTALLA 2B: RUTA VIF */}
      {currentStep === 'step-2b' && (
        <div className="bg-[#0f1725] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in duration-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            Paso 2B • Ruta: Violencia Intrafamiliar (VIF)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            EVALUACIÓN RÁPIDA DE RIESGO VITAL
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Determine de manera perentoria si concurre peligro inminente contra la vida o integridad física de la víctima o sus familiares (hijos, cónyuge).
          </p>

          <div className="bg-[#090e17] border-l-4 border-rose-500 p-4 rounded-r-xl mb-6">
            <h3 className="text-base sm:text-lg font-bold text-rose-300">
              Evaluación Rápida de Riesgo Vital:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setCurrentStep('result-b1')}
              className="group flex flex-col items-start p-6 rounded-xl bg-[#131d2e] hover:bg-[#18263c] border-2 border-slate-700 hover:border-sky-400 text-left transition-all shadow-lg hover:shadow-sky-500/10 cursor-pointer"
            >
              <span className="text-base font-bold text-white group-hover:text-sky-300 mb-2">
                Botón 2B-1: Riesgo Moderado (Sin amenazas de muerte / Sin arma)
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Disputas con violencia psicológica o agresión física leve a moderada, sin armas de dotación comprometidas y sin amenazas manifiestas de feminicidio.
              </p>
              <span className="mt-4 text-xs font-bold text-sky-400">
                Aplicar Plan de Protección VIF Moderada →
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep('result-b2')}
              className="group flex flex-col items-start p-6 rounded-xl bg-[#231218] hover:bg-[#2e151e] border-2 border-rose-800 hover:border-rose-500 text-left transition-all shadow-lg hover:shadow-rose-500/20 cursor-pointer"
            >
              <span className="text-base font-bold text-rose-300 group-hover:text-rose-200 mb-2 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                🚨 Botón 2B-2: Riesgo Alto/Extremo (Amenazas / Acceso a Arma de Fuego)
              </span>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Amenazas expresas de muerte, uso de arma blanca o de dotación, lesiones graves, antecedentes de violencia armada o denunciado con acceso inmediato a armamento.
              </p>
              <span className="mt-4 text-xs font-bold text-rose-400">
                Activar Plan de Seguridad Máxima Inmediata →
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep('step-1')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
            </button>
            <span className="text-xs text-slate-500 font-mono">Paso 2 de 3</span>
          </div>
        </div>
      )}

      {/* RESULT A1: FALTA DISCIPLINARIA */}
      {currentStep === 'result-a1' && (
        <div className="bg-[#0f1725] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                RESULTADO A1 • VÍA ADMINISTRATIVA INTERNA
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                PLAN DE ACCIÓN - FALTA DISCIPLINARIA
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Procedimiento Sumarial Disciplinario Interno de la Unidad Militar
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">
              TRÁMITE CASTRENSE
            </span>
          </div>

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Acciones Inmediatas y Plazos Críticos:
          </h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Recepción y Contención</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    &lt; 2 hrs
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Entrevista inicial en espacio reservado y seguro. Apertura del cuaderno de incidentes y contención psicológica preliminar sin revictimizar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Separación de Mando Temporal</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    &lt; 48 hrs
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Reubicación preventiva de servicios, guardias o dependencias funcionales para suprimir toda subordinación directa o contacto físico entre las partes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Diligencias Preliminares</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    &lt; 5 días
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Recopilación de declaraciones testificales, partes diarios, registros telefónicos o de mensajería y actas de entrevista.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Investigación Disciplinaria Interna</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Sumario Castrense
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Remisión del informe de conclusiones al Comandante de la Unidad y al Tribunal de Personal para sustanciación sumarial militar.
                </p>
              </div>
            </div>
          </div>

          {/* Required Forms */}
          <div className="bg-[#0b111a] border border-slate-800 rounded-xl p-4 mb-6">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Formularios Requeridos (Descarga Inmediata):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {['ANEXO A', 'ANEXO E', 'ANEXO C', 'ANEXO D'].map((code) => {
                const targetDoc = getDoc(code);
                if (!targetDoc) return null;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onDownloadWordNormado(targetDoc)}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#121a28] hover:bg-[#182438] border border-slate-700 hover:border-amber-400 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                      {code}: {targetDoc.title.slice(0, 32)}...
                    </span>
                    <Download className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep('step-1')}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Evaluación
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('step-2a')}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              ← Modificar Gravedad
            </button>
          </div>
        </div>
      )}

      {/* RESULT A2: DELITO PENAL */}
      {currentStep === 'result-a2' && (
        <div className="bg-[#0f1725] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">
                RESULTADO A2 • DELITO PENAL EN JURISDICCIÓN ORDINARIA
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                PLAN DE ACCIÓN - DELITO PENAL (Art. 312 quater)
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Acoso Sexual Tipificado en Código Penal / Obligación Legal Inmediata de Denuncia
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-rose-500/25 text-rose-200 border border-rose-500/50 text-xs font-bold font-mono">
              OBLIGACIÓN PENAL EXTERNA
            </span>
          </div>

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Acciones Perentorias y Plazos Críticos:
          </h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-rose-950 text-rose-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Separación Inmediata de Mando</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    &lt; INMEDIATO
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Relevo formal y suspensión inmediata de toda potestad de mando, jefatura, evaluación o supervisión respecto a la persona denunciante.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-rose-950 text-rose-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Prohibición de Contacto</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    &lt; INMEDIATO
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Notificación formal bajo firma de orden tajante de alejamiento físico, virtual, telefónico o por interpósita persona, con apercibimiento procesal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-rose-950 text-rose-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Derivación Jurisdiccional Obligatoria a FELCV / Ministerio Público</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    &lt; 24 hrs
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Remisión formal mediante oficio firmado por el Comandante de Unidad y Oficial de Género a la Fiscalía / FELCV para investigación penal ordinaria.
                </p>
              </div>
            </div>
          </div>

          {/* Required Forms */}
          <div className="bg-[#0b111a] border border-slate-800 rounded-xl p-4 mb-6">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Formularios Requeridos:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {['ANEXO A', 'ANEXO E', 'ANEXO G'].map((code) => {
                const targetDoc = getDoc(code);
                if (!targetDoc) return null;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onDownloadWordNormado(targetDoc)}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#121a28] hover:bg-[#182438] border border-slate-700 hover:border-rose-400 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-200 group-hover:text-rose-300">
                      {code}
                    </span>
                    <Download className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep('step-1')}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Evaluación
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('step-2a')}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              ← Modificar Gravedad
            </button>
          </div>
        </div>
      )}

      {/* RESULT B1: VIF MODERADA */}
      {currentStep === 'result-b1' && (
        <div className="bg-[#0f1725] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest block mb-1">
                RESULTADO B1 • VIOLENCIA INTRAFAMILIAR MODERADA
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                PLAN DE ACCIÓN - VIF RIESGO MODERADO
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Ley Integral Para Garantizar a las Mujeres una Vida Libre de Violencia (Ley 348)
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-bold font-mono">
              RUTA LEY 348
            </span>
          </div>

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Acciones Obligatorias y Plazos:
          </h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-sky-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Contención Psicológica</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    &lt; INMEDIATO
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Atención prioritaria, escucha activa, respeto irrestricto a la dignidad y garantía de ambiente neutral y seguro.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-sky-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Cuestionario de Valoración de Riesgo</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    &lt; 2 hrs
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Aplicación inmediata del test técnico estandarizado de factores de riesgo de escalada de violencia en el hogar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-sky-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Derivación Externa (SLIM / FELCV)</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    &lt; 24 hrs
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Canalización formal de la afectada a los Servicios Legales Integrales Municipales (SLIM) o a la FELCV de la jurisdicción territorial.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#090e17] border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-rose-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Prohibición Categórica de Conciliación</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    OBLIGATORIO
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  En cumplimiento del Art. 46 de la Ley 348, queda terminantemente prohibida la mediación o conciliación forzada o voluntaria entre las partes.
                </p>
              </div>
            </div>
          </div>

          {/* Required Forms */}
          <div className="bg-[#0b111a] border border-slate-800 rounded-xl p-4 mb-6">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Formularios Requeridos:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {['ANEXO A', 'ANEXO F'].map((code) => {
                const targetDoc = getDoc(code);
                if (!targetDoc) return null;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onDownloadWordNormado(targetDoc)}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#121a28] hover:bg-[#182438] border border-slate-700 hover:border-sky-400 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-slate-200 group-hover:text-sky-300">
                      {code}: {targetDoc.title.slice(0, 34)}...
                    </span>
                    <Download className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep('step-1')}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Evaluación
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('step-2b')}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              ← Modificar Riesgo Vital
            </button>
          </div>
        </div>
      )}

      {/* RESULT B2: EMERGENCIA VITAL */}
      {currentStep === 'result-b2' && (
        <div className="bg-[#190e15] border-2 border-rose-600/70 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-rose-950/50 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-rose-600/20 border border-rose-500/50 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-rose-300 uppercase tracking-widest block mb-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                RESULTADO B2 • ALERTA ROJA - RIESGO VITAL EXTREMO
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                EMERGENCIA VITAL - PLAN DE SEGURIDAD MÁXIMA
              </h2>
              <p className="text-xs text-rose-200 mt-1">
                Peligro Inminente Contra la Vida con Acceso a Armas de Dotación Militar
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-rose-600 text-white font-black text-xs font-mono shadow-md">
              MÁXIMA URGENCIA
            </span>
          </div>

          <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-3">
            Medidas de Seguridad Innegociables:
          </h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#0e070c] border border-rose-900/60">
              <div className="w-7 h-7 rounded-full bg-rose-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-rose-100">REQUISA INMEDIATA de Arma de Dotación</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500 text-white">
                    &lt; 4 hrs
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Orden inmediata de retiro y depósito forzoso de armas de dotación oficial, cargadores y munición reglamentaria en Sala de Armas de la Unidad bajo acta.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#0e070c] border border-rose-900/60">
              <div className="w-7 h-7 rounded-full bg-rose-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Desalojo de Vivienda Fiscal si Aplica</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    &lt; 12 hrs
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  En caso de habitar vivienda fiscal militar, disponer la exclusión cautelar del denunciado y protección del núcleo familiar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#0e070c] border border-rose-900/60">
              <div className="w-7 h-7 rounded-full bg-rose-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Asistencia Médica Inmediata</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500 text-white">
                    &lt; INMEDIATO
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Traslado inmediato a Hospital Militar / Seguro Social Militar (COSSMIL) para atención de emergencia y emisión de certificado médico forense (IDIF).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#0e070c] border border-rose-900/60">
              <div className="w-7 h-7 rounded-full bg-rose-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-white">Remisión a FELCV en el Día y Sumario Castrense</span>
                  <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500 text-white">
                    &lt; EN EL DÍA
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Oficio inmediato de denuncia formal a la FELCV de turno y apertura simultánea de proceso sumarial informativo en la Unidad por falta gravísima militar.
                </p>
              </div>
            </div>
          </div>

          {/* Required Forms */}
          <div className="bg-[#0b0609] border border-rose-900/60 rounded-xl p-4 mb-6">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Formularios de Emergencia:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {['ANEXO A', 'ANEXO F', 'ANEXO G'].map((code) => {
                const targetDoc = getDoc(code);
                if (!targetDoc) return null;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => onDownloadWordNormado(targetDoc)}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#1a0b12] hover:bg-[#25101a] border border-rose-800/60 hover:border-rose-400 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-rose-100 group-hover:text-white">
                      {code}
                    </span>
                    <Download className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-2" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-rose-900/60">
            <button
              type="button"
              onClick={() => setCurrentStep('step-1')}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Evaluación
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('step-2b')}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              ← Modificar Riesgo Vital
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
