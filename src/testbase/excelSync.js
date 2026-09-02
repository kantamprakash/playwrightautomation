const path = require('path');
const AdmZip = require('adm-zip');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'data.xlsx');

// Minimal *synchronous* single-cell reader for data.xlsx. exceljs is async and
// playwright.config.js must export a plain object, so this is used only to pick
// the browser from the "Browser" sheet at config-load time. Test code uses the
// richer async ExcelLibrary instead.
function colToLetter(n) {
  let s = '';
  n += 1;
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function getExcelDataSync(sheetName, rowNum, cellNum) {
  const zip = new AdmZip(DATA_FILE);
  const read = (name) => {
    const e = zip.getEntry(name);
    return e ? zip.readAsText(e) : '';
  };

  const workbook = read('xl/workbook.xml');
  const rels = read('xl/_rels/workbook.xml.rels');
  const shared = read('xl/sharedStrings.xml');

  const sheetTag = new RegExp(`<sheet[^>]*name="${sheetName}"[^>]*/>`).exec(workbook);
  if (!sheetTag) return null;
  const ridMatch = /r:id="([^"]+)"/.exec(sheetTag[0]);
  if (!ridMatch) return null;

  const relMatch = new RegExp(`<Relationship[^>]*Id="${ridMatch[1]}"[^>]*Target="([^"]+)"`).exec(rels);
  if (!relMatch) return null;
  const target = relMatch[1].replace(/^\/?xl\//, '').replace(/^\//, '');
  const sheetXml = read(`xl/${target}`);

  const ref = `${colToLetter(cellNum)}${rowNum + 1}`;
  const cell = new RegExp(`<c r="${ref}"([^>]*)>(.*?)</c>`).exec(sheetXml);
  if (!cell) return null;

  const isShared = /t="s"/.test(cell[1]);
  const vMatch = /<v>(.*?)<\/v>/.exec(cell[2]);
  if (!vMatch) return null;

  if (!isShared) return vMatch[1];

  const sst = [];
  const siRe = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = siRe.exec(shared)) !== null) {
    const parts = [...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((p) => p[1]);
    sst.push(parts.join(''));
  }
  return sst[Number(vMatch[1])] ?? null;
}

module.exports = { getExcelDataSync };
