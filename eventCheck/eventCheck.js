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
                    // 对 sheet1 Webclick 事件的校验
 
                    var hadSent = 0; // 埋点事件是否上报
                    var hadNameTrue = 1; // 埋点上报名字是否正确
                    var hadClick = 1; // 埋点绑定元素能否点击
                    var hadOpenUrl = 1; // 埋点所在页面能否打开
                    var nonRepeatReport = 1; // 埋点事件是否重复上报
                    var perElementName = '';
                    var elementPage = '';
                    var wrongElementName = '';

                    var page = await browser.newPage();
                    // 实际业务代码 
                    // await page.emulate(devices['iPhone X']);

                    try {
                        // 实际业务代码 
                        // await page.goto(sheet[i][j].url);
                        // await page.evaluate(() => console.clear());

                        page.on('console', msg => {
                            if (typeof msg === 'object') {

                                // debug 下使用 打印监听到的事件的详情
                                console.log(msg);
                                
                                try {
                                    var obj = JSON.parse(msg._text);
                                    if (obj.properties.$element_name !== undefined) {
                                        hadSent = 1;
                                        if (sheet[i][j].element_name === obj.properties.$element_name) {
                                            if (perElementName === '') {
                                                perElementName = obj.properties.$element_name;
                                                elementPage = obj.properties.$title;
                                            } else {
                                                nonRepeatReport = 0;
                                            }
                                        } else {
                                            if (!hadNameTrue) {
                                                nonRepeatReport = 0;
                                            }
                                            hadNameTrue = 0;
                                            wrongElementName = obj.properties.$element_name;
                                        }
                                    }
                                } catch (error) {
                                    // 过滤无用的事件上报
                                    var obj = {};
                                }
                            }
                        });

                        try {
                            // 实际业务代码 
                            // await page.waitForSelector(sheet[i][j].selector);
                            // await page.click(sheet[i][j].selector);
                           
                            // demo 演示代码
                            
                            //正常上报自测代码
                            // await page.evaluate(() => console.log('{ "properties": { "$element_name": "name1", "$title": "page1" }}'));
                            

                            //无上报自测代码
                            // await page.evaluate(() => console.log(''));
                            
                           
                            //重复上报自测代码
                            await page.evaluate(() => console.log('{ "properties": { "$element_name": "name1", "$title": "page1" }}'));
                            await page.evaluate(() => console.log('{ "properties": { "$element_name": "name1", "$title": "page1" }}'));
                            
                           
                            //过滤无用的事件上报自测代码
                            // await page.evaluate(() => console.log('{ "properties": { "$element_name": "name1", "$title": "page1" }}'));
                            // await page.evaluate(() => console.log('???'));
                            
                           
                        } catch (error) {
                            hadClick = 0;
                            loggerFail.error(error);
                        }
                        await sleep(2000);
                        await page.close();
                    } catch (error) {
                        hadOpenUrl = 0;
                    }

                    // 根据对于状态进行校验和打印日志
                    if (hadOpenUrl && hadClick && hadSent && nonRepeatReport && hadNameTrue){
                        countSuc++;
                        loggerSuc.info('Webclick 埋点', sheet[i][j].key, '页面：', elementPage);
                        loggerSuc.info('Webclick 埋点', sheet[i][j].key, '名称：', sheet[i][j].element_name);
                    }
                    else {
                        countFail++;
                        // debug 下使用 打印当前状态
                        loggerSuc.info('hadOpenUrl:', hadOpenUrl,'hadClick:', hadClick,'hadSent:', hadSent,'nonRepeatReport:', nonRepeatReport,'hadNameTrue:', hadNameTrue)
                        
                        if (!hadOpenUrl) {
                            loggerFail.error('Webclick 埋点', sheet[i][j].key, sheet[i][j].element_name, '所在的页面无法打开或 url 填写错误');
                        }
                        if (!hadClick) {
                            loggerFail.error('Webclick 埋点', sheet[i][j].key, sheet[i][j].element_name, '绑定的元素无法点击或 selector 填写错误');
                        }
                        if (!hadSent) {
                            loggerFail.error('Webclick 埋点', sheet[i][j].key, sheet[i][j].element_name, '事件没有上报');
                        }
                        if (!nonRepeatReport) {
                            loggerFail.error('Webclick 埋点', sheet[i][j].key, '页面：', elementPage);
                            loggerFail.error('Webclick 埋点', sheet[i][j].key, sheet[i][j].element_name, '事件重复上报');
                        }
                        if (!hadNameTrue) {
                            loggerFail.error('Webclick 埋点', sheet[i][j].key, '页面：', elementPage);
                            loggerFail.error('Webclick 埋点当前名字为 【', wrongElementName, '】 预期名字为 【', sheet[i][j].element_name, '】 断言失败');
                        }
                        failarr.push('Webclick 埋点' + sheet[i][j].key + ' ' + sheet[i][j].element_name);
                    }
                    count++;
                } else {
                    // 对 sheet2 自定义 Login 事件的校验
                    const page = await browser.newPage();

                    //实际业务代码 
                    
                    // 使用 puppeteer 适配业务需求操作
                    // await page.emulate(devices['iPhone X']);
                    // await page.goto(sheet[i][j].url);
                    // var str = '181' + random(8, {letters: false});
                    // await page.waitForSelector(sheet[i][j].telInput);
                    // await page.type(sheet[i][j].telInput, str);
                    // await page.click(sheet[i][j].getCode);
                    

                    var hadSent = 0; // 埋点事件是否上报
                    var nonRepeatReport = 1; // 埋点上报事件是否重复
                    var hadLocationTrue = 1; // 埋点上报位置是否正确
                    var perLoginPosition = '';
                    var wrongLoginPosition = '';

                    page.on('console', msg => {
                        if (typeof msg === 'object') {

                            // debug 下使用 打印监听到的事件的详情
                            console.log(msg);

                            try {
                                var obj = JSON.parse(msg._text);
                                if (obj.properties.login_position !== undefined) {
                                    hadSent = 1;
                                    if (obj.properties.login_position === sheet[i][j].loginPosition) {
                                        if (perLoginPosition === '') {
                                            perLoginPosition = obj.properties.$login_position;
                                        } else {
                                            nonRepeatReport = 0;
                                        }
                                    } else {
                                        hadLocationTrue = 0;
                                        wrongLoginPosition = obj.properties.login_position;
                                    }
                                }
                            } catch (error) {
                                // 过滤无用的事件上报
                                var obj = {};
                            }
                        }
                    });

                    //实际业务代码 

                    // 适当等待验证码发送以及登录跳转的时间
                    // await sleep(2000);
                    // await page.click(sheet[i][j].submit);
                    // await sleep(3000);
                    
                   
                    // demo 演示代码
                    await page.evaluate(() => console.log('{ "properties": { "login_position": "location2" }}'));
                    
                    await page.close();

                    // 根据对于状态进行校验和打印日志
                    if (hadSent && nonRepeatReport && hadLocationTrue){
                        countSuc++;
                        loggerSuc.info('Login 埋点', sheet[i][j].key, '的登录位置为：', sheet[i][j].loginPosition);
                    }
                    else {
                        countFail++;
                        // debug 下使用 打印当前状态
                        loggerSuc.info('hadSent:', hadSent,'nonRepeatReport:', nonRepeatReport,'hadLocationTrue:', hadLocationTrue,)
                        
                        if (!hadSent) {
                            loggerFail.error('Login 埋点', sheet[i][j].key, sheet[i][j].loginPosition, '位置没有上报');
                        }
                        if (!nonRepeatReport) {
                            loggerFail.error('Login 埋点', sheet[i][j].key, sheet[i][j].loginPosition, '位置重复上报');
                        }
                        if (!hadLocationTrue) {
                            loggerFail.error('Login 埋点', sheet[i][j].key, '当前登录位置为 【', wrongLoginPosition, '】 预期登录位置为 【', sheet[i][j].loginPosition, '】 断言失败');
                        }
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