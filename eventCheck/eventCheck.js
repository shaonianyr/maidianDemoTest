const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const log4js = require('../logs/logUtils.js'); 
const loggerSuc = log4js.getLogger('datelogSuc'); 
const loggerFail = log4js.getLogger('datelogFail'); 
const random = require('string-random');

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function eventCheck(sheet) {
    (async () => {
        const browser = await puppeteer.launch();
        var count = 0;
        var countSuc = 0;
        var countFail = 0;
        var failarr = [];
        for (var i = 0; i < sheet.length; i++) {
            for (var j = 0; j < sheet[i].length; j++) {
                if (i === 0) {
                    var hadSent = 0;
                    var hadNameTrue = 1;
                    var hadClick = 1;
                    var hadOpenUrl = 1;
                    const page = await browser.newPage();
                    // await page.emulate(devices['iPhone X']);
                    try {
                        // await page.goto(sheet[i][j].url);
                        page.on('console', msg => {
                            if (typeof msg === 'object') {
                                var obj = JSON.parse(msg._text);
                                hadSent = 1;
                                if (sheet[i][j].element_name === obj.elementName) {
                                    loggerSuc.info('Webclick 埋点', sheet[i][j].key, '页面：', obj.pageLocation);
                                    loggerSuc.info('Webclick 埋点', sheet[i][j].key, '名称：', obj.elementName);
                                } else {
                                    loggerFail.error('Webclick 埋点', sheet[i][j].key, '页面：', obj.pageLocation);
                                    loggerFail.error('Webclick 埋点当前名字为 【', obj.elementName, '】 预期名字为 【', sheet[i][j].element_name, '】 断言失败');
                                    hadNameTrue = 0;
                                }
                            }
                        });
                        try {
                            // await page.waitForSelector(sheet[i][j].selector);
                            // await page.click(sheet[i][j].selector);
                            await page.evaluate(() => console.log('{ "pageLocation": "location2", "elementName": "name2" }'));
                        } catch (error) {
                            hadClick = 0;
                            loggerFail.error(error);
                        }
                        if (!hadSent) {
                            loggerFail.debug('Webclick 埋点', sheet[i][j].key, sheet[i][j].element_name, '事件没有上报');
                        }
                        await page.close();
                    } catch (error) {
                        hadOpenUrl = 0;
                        loggerFail.error(error);
                        loggerFail.debug('Webclick 埋点', sheet[i][j].key, sheet[i][j].element_name, '对应的页面无法打开或者填写错误');
                    }
                    if (hadSent && hadNameTrue && hadClick && hadOpenUrl){
                        countSuc++;
                    }
                    else {
                        countFail++;
                        failarr.push('Webclick 埋点' + sheet[i][j].key + ' ' + sheet[i][j].element_name);
                    }
                    count++;
                } else {
                    const page = await browser.newPage();
                    // await page.goto(sheet[i][j].url);
                    // var str = '181' + random(8, {letters: false});
                    // await page.waitForSelector(sheet[i][j].telInput);
                    // await page.type(sheet[i][j].telInput, str);
                    // await page.click(sheet[i][j].getCode);
                    var hadSent = 0;
                    var hadLocationTrue = 1;
                    page.on('console', msg => {
                        if (typeof msg === 'object') {
                            var obj = JSON.parse(msg._text);
                            if (obj.login_position !== undefined ) {
                                hadSent = 1;
                                if (obj.login_position === sheet[i][j].loginPosition) {
                                    loggerSuc.info('Login 埋点', sheet[i][j].key, '的登录位置为：', obj.login_position);
                                } else {
                                    hadLocationTrue = 0;
                                    loggerFail.error('Login 埋点', sheet[i][j].key, '当前登录位置为 【', obj.login_position, '】 预期登录位置为 【', sheet[i][j].loginPosition, '】 断言失败');
                                }
                            }
                        }
                    });
                    // await sleep(3000);
                    // await page.click(sheet[i][j].submit);
                    // await sleep(5000);
                    // await page.close();
                    // await page.evaluate(() => console.log('{ "login_position": "location1"}'));
                    await page.close();
                    if (!hadSent) {
                        loggerFail.error('Login 埋点', sheet[i][j].key, sheet[i][j].loginPosition, '位置没有上报');
                    }
                    if (hadSent && hadLocationTrue){
                        countSuc++;
                    }
                    else {
                        countFail++;
                        failarr.push('Login 埋点' + sheet[i][j].key + ' ' + sheet[i][j].loginPosition);
                    }
                    count++;
                }
            }
        }
        loggerSuc.info('埋点总数：', count);
        loggerSuc.info('埋点正确个数：', countSuc);
        if(countFail > 0) {
            loggerFail.error('埋点错误个数：', countFail);
            loggerFail.error('错误埋点分别为：', failarr);
        } else {
            loggerSuc.info('校验全部通过，无错误埋点');
        }
        await browser.close();
    })();
}

module.exports = {
    eventCheck,
}