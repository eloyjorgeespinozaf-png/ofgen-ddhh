/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  UnderlineType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeightRule
} from 'docx';

export interface UnitData {
  granUnidad: string;
  pequenaUnidad: string;
  responsable: string;
  gestion: string;
}

export interface DocumentMeta {
  id: string;
  code: string;
  title: string;
  category: string;
  filename: string;
  tab: 'anexos' | 'principal' | 'secundaria' | 'protocolo' | 'manual';
}

// Constantes exactas solicitadas por el usuario:
// Márgenes: Lado izquierdo 3 cm, Lado derecho 2 cm, Lado inferior 2 cm, Lado superior 2 cm
// 1 cm = 566.929 twips (redondeado a 567 twips)
const MARGIN_LEFT_3CM = 1701;    // 3 cm = 1701 twips
const MARGIN_RIGHT_2CM = 1134;   // 2 cm = 1134 twips
const MARGIN_TOP_2CM = 1134;     // 2 cm = 1134 twips
const MARGIN_BOTTOM_2CM = 1134;  // 2 cm = 1134 twips

// Sangría francesa (Hanging Indent) ~1.25 cm = 709 twips
const FRENCH_INDENT = {
  left: 709,
  hanging: 709
};

// Fuentes y tamaños en medios puntos (half-points):
// Encabezado: Arial 10 pt (size: 20)
// Título principal: Arial 16 pt con negrilla (size: 32, bold: true)
// Párrafos (títulos/encabezados de párrafo): Arial 12 pt con negrilla y subrayado (size: 24, bold: true, underline)
// Texto: Arial 12 pt sin negrilla (size: 24, bold: false)
const FONT_ARIAL = 'Arial';
const SIZE_HEADER_10PT = 20;
const SIZE_MAIN_TITLE_16PT = 32;
const SIZE_BODY_12PT = 24;

/**
 * Crea un encabezado institucional normado en Arial 10 pegado al costado izquierdo
 */
function createInstitutionalHeader(unit: UnitData): Header {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 80, line: 240 },
        children: [
          new TextRun({
            text: 'COMANDO GENERAL DEL EJÉRCITO',
            font: FONT_ARIAL,
            size: SIZE_HEADER_10PT,
            bold: true
          }),
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 60, line: 240 },
        children: [
          new TextRun({
            text: unit.granUnidad.toUpperCase(),
            font: FONT_ARIAL,
            size: SIZE_HEADER_10PT,
            bold: false
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 180, line: 240 },
        children: [
          new TextRun({
            text: unit.pequenaUnidad.toUpperCase(),
            font: FONT_ARIAL,
            size: SIZE_HEADER_10PT,
            bold: false
          })
        ]
      })
    ]
  });
}

/**
 * Pie de página oficial con numeración institucional
 */
function createInstitutionalFooter(gestion: string): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 120 },
        children: [
          new TextRun({
            text: `Gestión ${gestion} | Página `,
            font: FONT_ARIAL,
            size: 18,
            color: '555555'
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            font: FONT_ARIAL,
            size: 18,
            color: '555555'
          }),
          new TextRun({
            text: ' de ',
            font: FONT_ARIAL,
            size: 18,
            color: '555555'
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            font: FONT_ARIAL,
            size: 18,
            color: '555555'
          })
        ]
      })
    ]
  });
}

/**
 * Título principal: Arial 16 pt con negrilla
 */
function createMainTitle(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 280, line: 360 },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: FONT_ARIAL,
        size: SIZE_MAIN_TITLE_16PT,
        bold: true
      })
    ]
  });
}

/**
 * Subtítulo institucional centrado
 */
function createSubTitle(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 260, line: 280 },
    children: [
      new TextRun({
        text,
        font: FONT_ARIAL,
        size: SIZE_BODY_12PT,
        bold: true
      })
    ]
  });
}

/**
 * Párrafos de encabezado de sección: Arial 12 pt con negrilla y subrayado
 */
function createSectionHeader(titleText: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 120, line: 280 },
    children: [
      new TextRun({
        text: titleText,
        font: FONT_ARIAL,
        size: SIZE_BODY_12PT,
        bold: true,
        underline: {
          type: UnderlineType.SINGLE
        }
      })
    ]
  });
}

/**
 * Texto de párrafo: Arial 12 pt sin negrilla con sangría francesa
 */
function createFrenchIndentParagraph(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.BOTH,
    indent: FRENCH_INDENT,
    spacing: { before: 60, after: 140, line: 280 },
    children: [
      new TextRun({
        text,
        font: FONT_ARIAL,
        size: SIZE_BODY_12PT,
        bold: false
      })
    ]
  });
}

/**
 * Bloque de firmas institucional normalizado
 */
function createSignatureBlock(unit: UnitData): Table {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        height: { value: 900, rule: HeightRule.EXACT },
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '_______________________________________',
                    font: FONT_ARIAL,
                    size: SIZE_BODY_12PT
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80 },
                children: [
                  new TextRun({
                    text: unit.responsable,
                    font: FONT_ARIAL,
                    size: SIZE_BODY_12PT,
                    bold: true
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${unit.pequenaUnidad}`,
                    font: FONT_ARIAL,
                    size: 20
                  })
                ]
              })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: '_______________________________________',
                    font: FONT_ARIAL,
                    size: SIZE_BODY_12PT
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80 },
                children: [
                  new TextRun({
                    text: 'COMANDANTE / JEFE DE REPARTICIÓN',
                    font: FONT_ARIAL,
                    size: SIZE_BODY_12PT,
                    bold: true
                  })
                ]
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `${unit.granUnidad}`,
                    font: FONT_ARIAL,
                    size: 20
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

/**
 * Generador de contenido estructurado por documento con fidelidad institucional
 */
function getDocumentContentSections(doc: DocumentMeta, unit: UnitData): Paragraph[] {
  const sections: Paragraph[] = [];

  // Pestaña 1: Anexos
  if (doc.tab === 'anexos') {
    switch (doc.id) {
      case 'anexo_a':
        sections.push(
          createSectionHeader('1. DATOS DE IDENTIFICACIÓN GENERAL'),
          createFrenchIndentParagraph(`1.1. Fecha y Hora de Recepción: Registrado conforme a normativa vigente en la gestión ${unit.gestion}. Toda recepción se formaliza con código correlativo institucional y custodia estricta de expediente confidencial.`),
          createFrenchIndentParagraph(`1.2. Unidad o Repartición Militar Receptora: ${unit.granUnidad} - ${unit.pequenaUnidad}, bajo la supervisión directa del ${unit.responsable}.`),
          createSectionHeader('2. DATOS DE LA PERSONA DENUNCIANTE Y/O AFECTADA'),
          createFrenchIndentParagraph('2.1. Grado, Nombres y Apellidos completos de la persona denunciante, número de Cédula de Identidad, grado militar de origen y situación administrativa actual.'),
          createFrenchIndentParagraph('2.2. Relación de dependencia funcional respecto al presunto infractor o agresor, garantizando la activación inmediata de medidas de protección integral.'),
          createSectionHeader('3. RELACIÓN CIRCUNSTANCIADA DE LOS HECHOS'),
          createFrenchIndentParagraph('3.1. Descripción cronológica, detallada y clara de los hechos denunciados, especificando lugar geográfico, fecha exacta, testimonios indiciarios y medios probatorios aportados.'),
          createFrenchIndentParagraph('3.2. Medidas precautorias preliminares adoptadas de oficio para salvaguardar la integridad física, psicológica y moral de la persona afectada.'),
          createSectionHeader('4. ACTUACIONES INMEDIATAS Y DERIVACIÓN'),
          createFrenchIndentParagraph(`4.1. Remisión y apertura de cuadernillo de investigación disciplinaria interna bajo los alcances de la Ley N° 348 y la Ley del Tribunal de Justicia Militar, en coordinación con el Oficial Responsable: ${unit.responsable}.`)
        );
        break;

      case 'anexo_b':
        sections.push(
          createSectionHeader('1. CABECERA DE PARTE MILITAR'),
          createFrenchIndentParagraph(`1.1. Al: Comandante de la Unidad / Gran Unidad (${unit.granUnidad}). Del: ${unit.responsable} (${unit.pequenaUnidad}). Objeto: Elevar Parte urgente sobre presunto incidente de género.`),
          createSectionHeader('2. SUCESOS OCURRIDOS'),
          createFrenchIndentParagraph('2.1. Pongo en conocimiento del Escalón Superior que en fecha y hora indicadas se constató la comisión de hechos que vulneran la dignidad, disciplina militar y los principios rectores de Derechos Humanos.'),
          createSectionHeader('3. MEDIDAS ADOPTADAS Y RECOMENDACIONES'),
          createFrenchIndentParagraph('3.1. Separación física preventiva de funciones para impedir cualquier contacto entre las partes, salvaguarda de evidencias documentales y remisión del informe correspondiente a la autoridad jurisdiccional competente.')
        );
        break;

      case 'anexo_c':
        sections.push(
          createSectionHeader('1. CONDICIONES DE LA ENTREVISTA Y CONSENTIMIENTO INFORMADO'),
          createFrenchIndentParagraph('1.1. Se garantiza un entorno reservado, seguro, respetuoso y libre de revictimización, brindando a la persona afectada el acompañamiento psicológico y asesoría legal institucional permanente.'),
          createSectionHeader('2. DESARROLLO DE LA ENTREVISTA'),
          createFrenchIndentParagraph('2.1. Manifestación libre y espontánea respecto a las circunstancias de tiempo, modo y lugar de los acontecimientos suscitados dentro de la repartición militar.'),
          createSectionHeader('3. REQUERIMIENTOS DE ASISTENCIA Y PROTECCIÓN'),
          createFrenchIndentParagraph('3.1. Determinación de necesidades apremiantes en materia de atención médica, psicológica, relevo temporal de funciones o reubicación preventiva.')
        );
        break;

      case 'anexo_d':
        sections.push(
          createSectionHeader('1. OBJETO DEL ACTA DE NOTIFICACIÓN'),
          createFrenchIndentParagraph(`1.1. Notificar formalmente al personal involucrado sobre la imposición estricta de medidas precautorias dictadas por la Dirección de Género y Derechos Humanos de ${unit.granUnidad}.`),
          createSectionHeader('2. MEDIDAS PRECAUTORIAS VIGENTES'),
          createFrenchIndentParagraph('2.1. Prohibición terminante de acercamiento, comunicación directa o indirecta por cualquier medio físico, telefónico o digital con la persona afectada o testigos.'),
          createFrenchIndentParagraph('2.2. Apercibimiento expreso de que cualquier transgresión constituirá falta gravísima sancionada conforme al Código Penal Militar y legislación ordinaria.'),
          createSectionHeader('3. CONSTANCIA DE FIRMAS Y ENTERADO'),
          createFrenchIndentParagraph('3.1. El notificado estampa su firma y huella dactilar manifestando su pleno y cabal conocimiento de las responsabilidades legales que asume.')
        );
        break;

      case 'anexo_e':
        sections.push(
          createSectionHeader('1. INSTRUMENTO DE EVALUACIÓN Y FACTORES DE RIESGO'),
          createFrenchIndentParagraph('1.1. Valoración integral de antecedentes de conducta, reiteración de actos de hostigamiento, jerarquía de mando y vulnerabilidad del entorno de servicio.'),
          createSectionHeader('2. NIVEL DE RIESGO DETERMINADO'),
          createFrenchIndentParagraph('2.1. Con base en la sumatoria de indicadores estandarizados, se califica el nivel de riesgo en la escala institucional (LEVE / MODERADO / GRAVE / EXTREMO).'),
          createSectionHeader('3. PLAN DE INTERVENCIÓN OBLIGATORIA'),
          createFrenchIndentParagraph(`3.1. Asignación inmediata de custodio, monitoreo psicológico quincenal y fiscalización a cargo del ${unit.responsable}.`)
        );
        break;

      case 'anexo_f':
        sections.push(
          createSectionHeader('1. AUTORIDAD DESTINATARIA'),
          createFrenchIndentParagraph('1.1. Señores Representantes del Ministerio Público / Juzgado de Instrucción en lo Penal Especializado en Violencia hacia la Mujer (Ley N° 348).'),
          createSectionHeader('2. REMISIÓN DE ANTECEDENTES'),
          createFrenchIndentParagraph(`2.1. La Dirección de Género y Derechos Humanos de ${unit.granUnidad} remite el cuaderno preliminar de investigaciones en cumplimiento irrestricto de la debida diligencia y cooperación interinstitucional.`),
          createSectionHeader('3. SOLICITUD DE REQUERIMIENTOS JUDICIALES'),
          createFrenchIndentParagraph('3.1. Se solicita la acreditación de recepción y la emisión de directrices jurisdiccionales para la continuidad procesal correspondiente.')
        );
        break;

      case 'anexo_g':
        sections.push(
          createSectionHeader('1. RUTA CRÍTICA DE ATENCIÓN INSTITUCIONAL'),
          createFrenchIndentParagraph('1.1. Etapa de Primer Contacto y Acogida: Identificación del caso y registro en libro de novedades reservado.'),
          createFrenchIndentParagraph('1.2. Etapa de Valoración y Medidas Cautelares: Determinación del riesgo y notificación formal.'),
          createFrenchIndentParagraph('1.3. Etapa de Derivación Multidisciplinaria: Envío formal a centros de salud militar, asistencia social y asesoría legal.'),
          createSectionHeader('2. MONITOREO Y EVALUACIÓN PERIÓDICA'),
          createFrenchIndentParagraph(`2.1. Seguimiento mensualizado de la evolución física y psicológica de la víctima, garantizando que no existan represalias ni discriminación en la unidad militar.`)
        );
        break;

      case 'anexo_h':
        sections.push(
          createSectionHeader('1. REGISTRO MATRIZ DE CASOS'),
          createFrenchIndentParagraph(`1.1. Cuaderno institucional de control para el seguimiento de expedientes radicados durante la Gestión ${unit.gestion}.`),
          createSectionHeader('2. INDICADORES DE CUMPLIMIENTO'),
          createFrenchIndentParagraph('2.1. Estado de tramitación: En investigación preliminar, remitido a Tribunal de Personal, o con sentencia disciplinaria ejecutoriada.'),
          createSectionHeader('3. VERIFICACIÓN Y VISTO BUENO'),
          createFrenchIndentParagraph(`3.1. Certificación de exactitud a cargo del ${unit.responsable} para presentación ante el Comando General del Ejército.`)
        );
        break;

      case 'anexo_i':
        sections.push(
          createSectionHeader('1. INTRODUCCIÓN Y ANTECEDENTES PROCESALES'),
          createFrenchIndentParagraph(`1.1. En cumplimiento de las atribuciones conferidas a la ${unit.pequenaUnidad}, se formula el dictamen conclusivo respecto a la investigación aperturada.`),
          createSectionHeader('2. ANÁLISIS JURÍDICO - DISCIPLINARIO'),
          createFrenchIndentParagraph('2.1. Confrontación de elementos de convicción acumulados con los tipos y faltas tipificados en los reglamentos militares de faltas disciplinarias y sus penas.'),
          createSectionHeader('3. CONCLUSIONES Y RECOMENDACIÓN FINAL'),
          createFrenchIndentParagraph('3.1. Se concluye la existencia de indicios suficientes de responsabilidad, recomendando al Comandante de la Unidad la aplicación de las sanciones disciplinarias máximas o su remisión a Tribunal del Personal.')
        );
        break;
    }
  } 
  // Pestaña 2: Carpeta Principal
  else if (doc.tab === 'principal') {
    switch (doc.id) {
      case 'cp_01': // 001 CARATULA, INDICE Y SEPARADORES OF GEN
        sections.push(
          createSectionHeader('1. CARÁTULA GENERAL DEL LEGAJO'),
          createFrenchIndentParagraph(`1.1. CARPETA PRINCIPAL DE GESTIÓN INSTITUCIONAL: ${unit.granUnidad} - ${unit.pequenaUnidad}. Gestión: ${unit.gestion}. Responsable: ${unit.responsable}.`),
          createSectionHeader('2. ÍNDICE GENERAL SISTEMATIZADO'),
          createFrenchIndentParagraph('2.1. Sección 01: Misión Institucional del Ejército en Derechos Humanos.'),
          createFrenchIndentParagraph('2.2. Sección 02: Organigrama Funcional y Jerárquico.'),
          createFrenchIndentParagraph('2.3. Sección 03: Organización Interna y Asignación de Puestos.'),
          createFrenchIndentParagraph('2.4. Sección 04: Manual de Funciones y Procedimientos Operativos.'),
          createFrenchIndentParagraph('2.5. Sección 05: Normas Vigentes de Acción y Doctrina Militar.'),
          createFrenchIndentParagraph('2.6. Sección 06: Plan General de Actividades y Cronograma.'),
          createFrenchIndentParagraph('2.7. Sección 07: Hoja de Registro de Firmas Autorizadas.'),
          createFrenchIndentParagraph('2.8. Sección 08: Hoja de Revisión y Control Periódico de Inspección.'),
          createFrenchIndentParagraph('2.9. Sección 09: Guía Oficial de Inspección en DDHH y Género.'),
          createFrenchIndentParagraph('2.10. Sección 10: Informe General DAMAS y Bienestar Institucional.'),
          createSectionHeader('3. SEPARADORES OFICIALES'),
          createFrenchIndentParagraph('3.1. Hojas de custodia y separación física normalizada de documentación confidencial y de archivo.')
        );
        break;

      case 'cp_02': // 01 MISION
        sections.push(
          createSectionHeader('1. MISIÓN DE LA OFICINA DE GÉNERO Y DERECHOS HUMANOS'),
          createFrenchIndentParagraph(`1.1. Planificar, coordinar, asesorar, supervisar y evaluar la implementación de políticas institucionales del Ejército en materia de Derechos Humanos, Derecho Internacional Humanitario e Igualdad de Oportunidades y Género en todos los repartimientos militares dependientes de ${unit.granUnidad}, a fin de garantizar el respeto incondicional a la dignidad humana, la disciplina militar y el cumplimiento de la Constitución Política del Estado.`),
          createSectionHeader('2. VISIÓN ESTRATÉGICA'),
          createFrenchIndentParagraph(`2.1. Constituirse en un referente de excelencia doctrinal, operativa y moral en el ámbito de las Fuerzas Armadas, asegurando una cultura institucional de transparencia, no violencia y respeto recíproco en la gestión ${unit.gestion}.`),
          createSectionHeader('3. OBJETIVOS ESPECÍFICOS'),
          createFrenchIndentParagraph('3.1. Desarrollar programas continuos de capacitación integral para el personal de cuadros y tropa.'),
          createFrenchIndentParagraph('3.2. Atender con prontitud, reserva y máxima celeridad cualquier denuncia o incidente de transgresión.'),
          createFrenchIndentParagraph('3.3. Promover la equidad de género en los diferentes escalafones y ascensos profesionales.')
        );
        break;

      case 'cp_03': // 02 ORGANIGRAMA
        sections.push(
          createSectionHeader('1. ESTRUCTURA ORGÁNICA INSTITUCIONAL'),
          createFrenchIndentParagraph(`1.1. Nivel Directivo y de Decisión: Comando General del Ejército - Jefatura de Estado Mayor General (${unit.granUnidad}).`),
          createFrenchIndentParagraph(`1.2. Nivel Asesor y Supervisor: Dirección General de Derechos Humanos y Género del Ejército.`),
          createFrenchIndentParagraph(`1.3. Nivel Ejecutivo y Operativo: Sección de Género y Derechos Humanos (${unit.pequenaUnidad}), a cargo del ${unit.responsable}.`),
          createSectionHeader('2. DEPENDENCIAS FUNCIONALES Y DE APOYO'),
          createFrenchIndentParagraph('2.1. Área de Recepción, Trámite y Seguimiento de Denuncias Disciplinarias.'),
          createFrenchIndentParagraph('2.2. Área de Capacitación, Doctrina y Talleres en Unidades Militares.'),
          createFrenchIndentParagraph('2.3. Área de Enlace Psico-Social y Coordinación Médica Integral.')
        );
        break;

      case 'cp_04': // 03 ORGANIZACION
        sections.push(
          createSectionHeader('1. DESCRIPCIÓN DE LA ORGANIZACIÓN'),
          createFrenchIndentParagraph(`1.1. La Sección de Género y Derechos Humanos de ${unit.granUnidad} se articula orgánica y funcionalmente para garantizar una respuesta operativa inmediata ante cualquier requerimiento doctrinal o disciplinario.`),
          createSectionHeader('2. ASIGNACIÓN DE PUESTOS Y ROLES'),
          createFrenchIndentParagraph(`2.1. Oficial de Género y DDHH (${unit.responsable}): Conducción general, enlace con el mando militar y elevación de informes.`),
          createFrenchIndentParagraph('2.2. Suboficial Encargado de Cuaderno y Archivo: Custodia de expedientes y registros estadísticos.'),
          createFrenchIndentParagraph('2.3. Asesor Legal Militar: Análisis normativo y proyección de informes disciplinarios.')
        );
        break;

      case 'cp_05': // 04 MANUAL DE FUNCIONES
        sections.push(
          createSectionHeader('1. FUNCIONES GENERALES DEL CARGO'),
          createFrenchIndentParagraph(`1.1. El ${unit.responsable} tiene por función principal velar por el respeto de los Derechos Humanos y la equidad de género en todas las actividades operativas, de instrucción y administrativas de la Unidad.`),
          createSectionHeader('2. FUNCIONES ESPECÍFICAS'),
          createFrenchIndentParagraph('2.1. Diseñar e impartir conferencias mensuales dirigidas al personal de conscriptos, damas y soldados voluntarios.'),
          createFrenchIndentParagraph('2.2. Recepcionar y sustanciar las denuncias presentadas conforme a la Ley N° 348 y reglamentos institucionales.'),
          createFrenchIndentParagraph('2.3. Elevar partes confidenciales periódicos a la superioridad con recomendaciones concretas de mejora.'),
          createSectionHeader('3. PROHIBICIONES Y RESPONSABILIDADES'),
          createFrenchIndentParagraph('3.1. Guardar secreto profesional respecto a la identidad de las víctimas bajo pena de destitución y proceso penal militar.')
        );
        break;

      case 'cp_06': // 05 NORMAS VIGENTES DE ACCION
        sections.push(
          createSectionHeader('1. MARCO JURÍDICO NACIONAL E INTERNACIONAL'),
          createFrenchIndentParagraph('1.1. Constitución Política del Estado Plurinacional de Bolivia (Arts. 14, 15, 244 y concordantes).'),
          createFrenchIndentParagraph('1.2. Ley Integral para Garantizar a las Mujeres una Vida Libre de Violencia (Ley N° 348).'),
          createFrenchIndentParagraph('1.3. Declaración Universal de Derechos Humanos y Tratados Internacionales de Ginebra sobre DIH.'),
          createSectionHeader('2. PROCEDIMIENTOS ESTANDARIZADOS DE ACTUACIÓN (SOP)'),
          createFrenchIndentParagraph('2.1. Protocolo de atención inmediata ante quejas o denuncias en recintos castrenses.'),
          createFrenchIndentParagraph('2.2. Medidas de separación preventiva y remisión obligatoria ante tribunales competentes.')
        );
        break;

      case 'cp_07': // 06 Plan de actividades
        sections.push(
          createSectionHeader('1. CRONOGRAMA ANUAL DE ACTIVIDADES'),
          createFrenchIndentParagraph(`1.1. Gestión ${unit.gestion}: Planificación integral de conferencias, inspecciones sorpresa y talleres de sensibilización.`),
          createSectionHeader('2. METAS Y RESULTADOS ESPERADOS'),
          createFrenchIndentParagraph('2.1. Primer Trimestre: Capacitación al 100% de los oficiales y suboficiales de nuevo destino.'),
          createFrenchIndentParagraph('2.2. Segundo Trimestre: Talleres de derechos humanos y prevención de violencia dirigidos a la tropa.'),
          createFrenchIndentParagraph('2.3. Tercer Trimestre: Auditoría interna y simulación de protocolos de atención rápida.'),
          createFrenchIndentParagraph('2.4. Cuarto Trimestre: Consolidación de memoria institucional y evaluación de indicadores.')
        );
        break;

      case 'cp_08': // 07 HOJA DE FIRMAS
        sections.push(
          createSectionHeader('1. REGISTRO DE RUBRICAS Y AUTORIZACIONES'),
          createFrenchIndentParagraph(`1.1. Constancia oficial de acreditación de firmas de los mandos militares autorizados para visar la documentación en la gestión ${unit.gestion}.`),
          createSectionHeader('2. CONTROL DE VALIDEZ DE DOCUMENTOS'),
          createFrenchIndentParagraph('2.1. Todo documento oficial emanado de esta sección carece de validez sin el sello de seguridad y firma autorizada.')
        );
        break;

      case 'cp_09': // 08 HOJA DE REVISION
        sections.push(
          createSectionHeader('1. HISTORIAL DE REVISIONES Y AUDITORÍAS'),
          createFrenchIndentParagraph('1.1. Registro cronológico de fiscalizaciones efectuadas por inspectores de la Gran Unidad y Comando General.'),
          createSectionHeader('2. OBSERVACIONES Y LEVANTAMIENTO DE PLIEGOS'),
          createFrenchIndentParagraph('2.1. Verificación del cumplimiento oportuno de las recomendaciones emitidas en inspecciones previas.')
        );
        break;

      case 'cp_10': // guia de inspeccion DDHH y GENERO
        sections.push(
          createSectionHeader('1. LISTA DE VERIFICACIÓN PARA INSPECCIÓN'),
          createFrenchIndentParagraph('1.1. Estado de la infraestructura habitacional y servicios sanitarios diferenciados por género.'),
          createFrenchIndentParagraph('1.2. Existencia de buzones de sugerencias y denuncias anónimas debidamente precintados.'),
          createFrenchIndentParagraph('1.3. Comprobación del plan de ración alimentaria y condiciones dignas de descanso para la tropa.'),
          createSectionHeader('2. PROCEDIMIENTO DE CALIFICACIÓN'),
          createFrenchIndentParagraph('2.1. La calificación final se expresará en porcentaje de conformidad y recomendaciones de subsanación inmediata.')
        );
        break;

      case 'cp_11': // INFORME DAMAS
        sections.push(
          createSectionHeader('1. DIAGNÓSTICO INSTITUCIONAL DEL PERSONAL FEMENINO'),
          createFrenchIndentParagraph(`1.1. Relevamiento de la situación del personal militar femenino (Oficiales, Suboficiales, Sargentos y Damas Soldado) en ${unit.granUnidad}.`),
          createSectionHeader('2. ASPECTOS DE BIENESTAR Y SALUD'),
          createFrenchIndentParagraph('2.1. Acceso a controles médicos preventivos ginecológicos y resguardo de derechos de maternidad y lactancia.'),
          createSectionHeader('3. CONCLUSIONES Y PROPUESTAS'),
          createFrenchIndentParagraph('3.1. Fomentar la participación activa de las mujeres en cursos de especialidad táctica y misiones de paz.')
        );
        break;
    }
  } 
  // Pestaña 3: Carpeta Secundaria
  else if (doc.tab === 'secundaria') {
    switch (doc.id) {
      case 'cs_01': // 001 Cuadro de Planes y Programas DD.HH.
        sections.push(
          createSectionHeader('1. MATRIZ DE PLANES Y PROGRAMAS DE DERECHOS HUMANOS'),
          createFrenchIndentParagraph(`1.1. Síntesis operativa de planes estratégicos en ejecución durante la Gestión ${unit.gestion}.`),
          createSectionHeader('2. COMPONENTES DEL PROGRAMA'),
          createFrenchIndentParagraph('2.1. Eje 1: Prevención de la discriminación y fomento de la igualdad de oportunidades en cuarteles.'),
          createFrenchIndentParagraph('2.2. Eje 2: Aplicación rigurosa de principios de Derecho Internacional Humanitario en ejercicios de campaña.'),
          createSectionHeader('3. FUENTES DE VERIFICACIÓN'),
          createFrenchIndentParagraph('3.1. Listas de asistencia autenticadas, material didáctico impartido e informes fotográficos.')
        );
        break;

      case 'cs_02': // 002 Cuadro Registro de Convenios DD.HH.
        sections.push(
          createSectionHeader('1. REGISTRO DE CONVENIOS INTERINSTITUCIONALES'),
          createFrenchIndentParagraph('1.1. Acuerdos suscritos con el Defensor del Pueblo, Ministerio de Justicia, Universidades y Organismos Internacionales.'),
          createSectionHeader('2. VIGENCIA Y OBLIGACIONES MUTUAS'),
          createFrenchIndentParagraph('2.1. Seguimiento al cumplimiento de becas, pasantías y asistencia técnica mutua en materia de equidad de género.')
        );
        break;

      case 'cs_03': // 003 Cuadro estadistico de violaciones DD.HH.
        sections.push(
          createSectionHeader('1. CONSOLIDADO ESTADÍSTICO EPIDEMIOLÓGICO DISCIPLINARIO'),
          createFrenchIndentParagraph(`1.1. Monitoreo cuantitativo y cualitativo de incidentes clasificados por tipología en ${unit.granUnidad}.`),
          createSectionHeader('2. INDICADORES DE RESOLUCIÓN'),
          createFrenchIndentParagraph('2.1. Proporción de casos sancionados, sobreseídos o derivados a la justicia ordinaria con estricta transparencia.')
        );
        break;

      case 'cs_04': // 004 LIBRO REGISTRO SEMANAL
        sections.push(
          createSectionHeader('1. APERTURA DE LIBRO NOTARIAL DE REGISTRO SEMANAL'),
          createFrenchIndentParagraph(`1.1. Libro habilitado para asentar las novedades de guardia, quejas recibidas y actuaciones semanales en la Gestión ${unit.gestion}.`),
          createSectionHeader('2. PROTOCOLO DE LLENADO'),
          createFrenchIndentParagraph('2.1. Queda prohibido el uso de enmiendas, raspaduras o borrones, debiendo salvarse cualquier error al final del asiento semanal.')
        );
        break;

      case 'cs_05': // caratulas secundaria
        sections.push(
          createSectionHeader('1. CARÁTULAS DE IDENTIFICACIÓN PARA CARPETA SECUNDARIA'),
          createFrenchIndentParagraph(`1.1. Carátula general para archivo de respaldo, expedientes auxiliares y cuadros de control de ${unit.pequenaUnidad}.`),
          createSectionHeader('2. NORMAS DE ARCHIVO Y CONSERVACIÓN'),
          createFrenchIndentParagraph('2.1. Los expedientes deberán archivarse en orden alfabético y cronológico bajo custodia del Oficial de Género.')
        );
        break;

      case 'cs_06': // indice secundaria
        sections.push(
          createSectionHeader('1. ÍNDICE DE CONTENIDOS - CARPETA SECUNDARIA'),
          createFrenchIndentParagraph('1.1. Folio 01: Cuadro de Planes y Programas en DD.HH. y Género.'),
          createFrenchIndentParagraph('1.2. Folio 02: Registro de Convenios y Acuerdos Interinstitucionales.'),
          createFrenchIndentParagraph('1.3. Folio 03: Cuadros Estadísticos y Métricas de Violaciones y Quejas.'),
          createFrenchIndentParagraph('1.4. Folio 04: Libro de Registro Semanal y Novedades de Guardia.'),
          createFrenchIndentParagraph('1.5. Folio 05: Carátulas Auxiliares y Formularios de Préstamo de Archivo.')
        );
        break;
    }
  }

  // Fallback si la lista estaba vacía
  if (sections.length === 0) {
    sections.push(
      createSectionHeader('1. DESCRIPCIÓN Y ANTECEDENTES'),
      createFrenchIndentParagraph(`1.1. El presente documento forma parte del archivo oficial de la ${unit.pequenaUnidad} para la Gestión ${unit.gestion}.`),
      createSectionHeader('2. NORMAS DE CUMPLIMIENTO'),
      createFrenchIndentParagraph('2.1. Todas las directivas emanadas deben cumplirse en conformidad estricta con las leyes militares y constitucionales.')
    );
  }

  return sections;
}

/**
 * Función principal para generar el archivo Word (.docx) con todas las especificaciones exactas:
 * - Margen izquierdo: 3 cm
 * - Margen derecho: 2 cm
 * - Margen inferior: 2 cm
 * - Margen superior: 2 cm
 * - Encabezado: Arial 10 pt pegado al costado izquierdo
 * - Título principal: Arial 16 pt con negrilla
 * - Párrafos (secciones): Arial 12 pt con negrilla y subrayado
 * - Texto: Arial 12 pt sin negrilla
 * - Sangría francesa en todos los párrafos de texto
 */
export async function generateCompliantWordBlob(doc: DocumentMeta, unit: UnitData): Promise<Blob> {
  const header = createInstitutionalHeader(unit);
  const footer = createInstitutionalFooter(unit.gestion);
  const mainTitle = createMainTitle(doc.title);
  const subTitle = createSubTitle(`CÓDIGO OFICIAL: ${doc.code} | GESTIÓN ${unit.gestion}`);
  const contentParagraphs = getDocumentContentSections(doc, unit);
  const signaturesTable = createSignatureBlock(unit);

  const wordDoc = new Document({
    creator: `${unit.granUnidad} - ${unit.pequenaUnidad}`,
    title: doc.title,
    description: `Documento oficial militar normalizado - ${doc.code}`,
    styles: {
      default: {
        document: {
          run: {
            font: FONT_ARIAL,
            size: SIZE_BODY_12PT
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: MARGIN_TOP_2CM,       // 2 cm = 1134 twips
              right: MARGIN_RIGHT_2CM,   // 2 cm = 1134 twips
              bottom: MARGIN_BOTTOM_2CM, // 2 cm = 1134 twips
              left: MARGIN_LEFT_3CM      // 3 cm = 1701 twips
            }
          }
        },
        headers: {
          default: header
        },
        footers: {
          default: footer
        },
        children: [
          mainTitle,
          subTitle,
          new Paragraph({
            spacing: { before: 100, after: 180 },
            children: [
              new TextRun({
                text: '------------------------------------------------------------------------------------------------------------------------',
                font: FONT_ARIAL,
                size: 16,
                color: '888888'
              })
            ]
          }),
          ...contentParagraphs,
          new Paragraph({
            spacing: { before: 300, after: 200 },
            children: []
          }),
          createSectionHeader('RESPONSABILIDAD Y AVAL INSTITUCIONAL'),
          createFrenchIndentParagraph(`El presente documento se emite con fe militar en la sede de ${unit.granUnidad}, quedando registrado en la base de datos de control de la ${unit.pequenaUnidad} para los fines legales y disciplinarios que correspondan.`),
          new Paragraph({
            spacing: { before: 200, after: 200 },
            children: []
          }),
          signaturesTable
        ]
      }
    ]
  });

  return await Packer.toBlob(wordDoc);
}
