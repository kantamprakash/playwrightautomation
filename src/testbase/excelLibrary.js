const path = require('path');
const ExcelJS = require('exceljs');

// Original Selenium project read "../Data/data.xlsx" (relative to the Actitime
// project folder). Here the workbook lives at <repo root>/data/data.xlsx.
const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'data.xlsx');

/**
 * JavaScript port of com.krn.actitime.testbase.ExcelLibrary.
 *
 * Apache POI row/cell indexes are 0-based, so the API here keeps the same
 * 0-based contract that the test classes were written against.
 */
class ExcelLibrary {
  async _sheet(sheetName) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(DATA_FILE);
    return wb.getWorksheet(sheetName);
  }

  /** getExcelData(sheetName, rowNum, cellNum) - 0-based row and cell. */
  async getExcelData(sheetName, rowNum, cellNum) {
    const sheet = await this._sheet(sheetName);
    if (!sheet) return null;
    const cell = sheet.getRow(rowNum + 1).getCell(cellNum + 1);
    const value = cell.value;
    if (value === null || value === undefined) return null;
    if (typeof value === 'object' && value.text !== undefined) return String(value.text);
    if (typeof value === 'object' && value.result !== undefined) return String(value.result);
    return String(value);
  }

  /** getLastRowNum(sheetName) - 0-based index of the last row, like POI. */
  async getLastRowNum(sheetName) {
    const sheet = await this._sheet(sheetName);
    if (!sheet) return 0;
    return sheet.actualRowCount - 1;
  }
}

module.exports = { ExcelLibrary };
