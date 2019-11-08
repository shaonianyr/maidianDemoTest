const excel = require('./excel/getExcel.js');
const excelArr = excel.getExcel('./selector.xlsx');
const log4js = require('./logs/logUtils.js'); 
const loggerSuc = log4js.getLogger('datelogSuc'); 
const loggerFail = log4js.getLogger('datelogFail'); 
const sheet = require('./eventCheck/eventCheck.js');

sheet.eventCheck(excelArr);