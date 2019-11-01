// const puppeteer = require('puppeteer');
// const devices = require('puppeteer/DeviceDescriptors');

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     page.on('console', msg => {
//         if (typeof msg === 'object') {
//             var obj = JSON.parse(msg._text);
//             console.log(obj.pageLocation, obj.elementName);
//         }
//     });
    
//     await page.evaluate(() => console.log('{ "pageLocation": "location1", "elementName": "name1" }'));
//     await browser.close();
// })();


const excel = require('./excel/getExcel.js');
const excelArr = excel.getExcel('./selector.xlsx');
const log4js = require('./logs/logUtils.js'); 
const loggerSuc = log4js.getLogger('datelogSuc'); 
const loggerFail = log4js.getLogger('datelogFail'); 
const sheet = require('./eventCheck/eventCheck.js');

sheet.eventCheck(excelArr);