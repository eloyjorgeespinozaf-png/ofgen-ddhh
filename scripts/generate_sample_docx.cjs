const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create a minimal zip file without external libraries
function createZip(files) {
  const localHeaders = [];
  const centralDirHeaders = [];
  let offset = 0;

  for (const file of files) {
    const filenameBuf = Buffer.from(file.path, 'utf8');
    const dataBuf = Buffer.from(file.data, 'utf8');
    const crc = crc32(dataBuf);
    const size = dataBuf.length;

    // Local file header (30 bytes + filename)
    const localHeader = Buffer.alloc(30 + filenameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version needed (2.0)
    localHeader.writeUInt16LE(0x0800, 6); // general purpose bit flag (UTF-8)
    localHeader.writeUInt16LE(0, 8); // compression method (0 = store)
    localHeader.writeUInt16LE(0, 10); // file time
    localHeader.writeUInt16LE(0, 12); // file date
    localHeader.writeUInt32LE(crc, 14); // crc32
    localHeader.writeUInt32LE(size, 18); // compressed size
    localHeader.writeUInt32LE(size, 22); // uncompressed size
    localHeader.writeUInt16LE(filenameBuf.length, 26); // filename length
    localHeader.writeUInt16LE(0, 28); // extra field length
    filenameBuf.copy(localHeader, 30);

    // Central directory header (46 bytes + filename)
    const centralHeader = Buffer.alloc(46 + filenameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // signature
    centralHeader.writeUInt16LE(20, 4); // version made by
    centralHeader.writeUInt16LE(20, 6); // version needed
    centralHeader.writeUInt16LE(0x0800, 8); // flags
    centralHeader.writeUInt16LE(0, 10); // method
    centralHeader.writeUInt16LE(0, 12); // time
    centralHeader.writeUInt16LE(0, 14); // date
    centralHeader.writeUInt32LE(crc, 16); // crc32
    centralHeader.writeUInt32LE(size, 20); // compressed size
    centralHeader.writeUInt32LE(size, 24); // uncompressed size
    centralHeader.writeUInt16LE(filenameBuf.length, 28); // filename len
    centralHeader.writeUInt16LE(0, 30); // extra len
    centralHeader.writeUInt16LE(0, 32); // comment len
    centralHeader.writeUInt16LE(0, 34); // disk start
    centralHeader.writeUInt16LE(0, 36); // internal attr
    centralHeader.writeUInt32LE(0, 38); // external attr
    centralHeader.writeUInt32LE(offset, 42); // relative offset of local header
    filenameBuf.copy(centralHeader, 46);

    localHeaders.push(Buffer.concat([localHeader, dataBuf]));
    centralDirHeaders.push(centralHeader);

    offset += localHeader.length + dataBuf.length;
  }

  const centralDirBuf = Buffer.concat(centralDirHeaders);
  const centralDirSize = centralDirBuf.length;
  const centralDirOffset = offset;

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // disk with central dir
  eocd.writeUInt16LE(files.length, 8); // total entries on disk
  eocd.writeUInt16LE(files.length, 10); // total entries
  eocd.writeUInt32LE(centralDirSize, 12); // size of central dir
  eocd.writeUInt32LE(centralDirOffset, 16); // offset of central dir
  eocd.writeUInt16LE(0, 20); // comment len

  return Buffer.concat([...localHeaders, centralDirBuf, eocd]);
}

// Simple CRC32 implementation
function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (~crc) >>> 0;
}

function makeDocx(title) {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="32"/></w:rPr><w:t>EJÉRCITO DE BOLIVIA</w:t></w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>ESTADO MAYOR GENERAL — SECCIÓN DE GÉNERO Y DERECHOS HUMANOS</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:b/><w:color w:val="1E3A8A"/><w:sz w:val="28"/></w:rPr><w:t>${title}</w:t></w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:pPr><w:jc w:val="both"/></w:pPr>
      <w:r><w:t>Documento normativo original emitido por la Sección de Género y Derechos Humanos del Ejército de Bolivia. Este archivo se encuentra listo para su cumplimentación y archivo reglamentario.</w:t></w:r>
    </w:p>
  </w:body>
</w:document>`;

  return createZip([
    { path: '[Content_Types].xml', data: contentTypes },
    { path: '_rels/.rels', data: rels },
    { path: 'word/document.xml', data: documentXml }
  ]);
}

// Ensure target directories exist
const publicDir = path.resolve(__dirname, '../public');
const anexosDir = path.join(publicDir, 'Anexos');
const carpPrinDir = path.join(publicDir, 'Carpeta Principal');
const carpSecDir = path.join(publicDir, 'Carpeta Secundaria');

[publicDir, anexosDir, carpPrinDir, carpSecDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Anexos A - I
const anexos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
for (const a of anexos) {
  const filePath = path.join(anexosDir, `ANEXO ${a}.docx`);
  fs.writeFileSync(filePath, makeDocx(`ANEXO ${a}`));
  console.log('Created:', filePath);
}

// Carpeta Principal
const carpPrincipalFiles = [
  '001 CARATULA, INDICE Y SEPARADORES OF GEN.docx',
  '01 MISION.docx',
  '02 ORGANIGRAMA.docx',
  '03 ORGANIZACION.docx',
  '04 MANUAL DE FUNCIONES.docx',
  '05 NORMAS VIGENTES DE ACCION.docx',
  '06 Plan de actividades.docx',
  '07 HOJA DE FIRMAS.docx',
  '08 HOJA DE REVISION.docx',
  'guia de inspeccion DDHH y GENERO.docx',
  'INFORME DAMAS.docx'
];

for (const f of carpPrincipalFiles) {
  const filePath = path.join(carpPrinDir, f);
  const title = f.replace('.docx', '');
  fs.writeFileSync(filePath, makeDocx(title));
  console.log('Created:', filePath);
}

// Carpeta Secundaria
const carpSecundariaFiles = [
  '001 Cuadro de Planes y Programas DD.HH.docx',
  '002 Cuadro Registro de Convenios DD.HH.docx',
  '003 Cuadro estadistico de violaciones DD.HH.docx',
  '004 LIBRO REGISTRO SEMANAL.docx',
  'caratulas secundaria.docx',
  'indice secundaria.docx'
];

for (const f of carpSecundariaFiles) {
  const filePath = path.join(carpSecDir, f);
  const title = f.replace('.docx', '');
  fs.writeFileSync(filePath, makeDocx(title));
  console.log('Created:', filePath);
}

console.log('All 26 docx files successfully created!');
