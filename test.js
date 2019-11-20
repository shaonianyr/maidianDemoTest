const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

(async () => {
  const browser = await puppeteer.launch({ headless: false})

  const page = await browser.newPage()

  await page.emulate(devices['iPhone X'])

  const navigationPromise = page.waitForNavigation()
  
  await page.goto('https://beta-m.famaomao.com/')
  
  await navigationPromise

  page.on('console', msg => {
    if (typeof msg === 'object') {
      try {
        var obj = JSON.parse(msg._text);
        if (obj.properties.$element_name !== undefined) {
            (async () => {
                const name = await page.$eval(obj.properties.$element_selector, el => el.getAttribute('name'))
                console.log(obj.event, obj.properties.$url, '\n实际上报名字：', obj.properties.$element_name, '实际上报名字：', name)
            })()
            // console.log(obj.event, obj.properties.$url, '\n实际上报名字：', obj.properties.$element_name)
        }
        if (obj.properties.login_position !== undefined) {
            console.log('$loginPositon', obj.properties.login_position)
        }
      } catch (error) {
        var obj = {};
      }
    }
  });
  
  const customPathFunction = require('./action.js')
  await customPathFunction(page)
  // await browser.close()
})()
