function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = async (page) => {
      
      await page.waitForSelector('.consult > .service-wrapper > .service:nth-child(3)')
      await page.click('.consult > .service-wrapper > .service:nth-child(3)')

      await page.waitForSelector('#\__layout > .fmm-wrap > .ldzc-wrap > .fixed-bottom > button')
      await page.click('#\__layout > .fmm-wrap > .ldzc-wrap > .fixed-bottom > button')

      await page.waitForSelector('.fmm-wrap > .apply-wrap > form > .form-item > .phone')
      await page.click('.fmm-wrap > .apply-wrap > form > .form-item > .phone')

      await page.type('.fmm-wrap > .apply-wrap > form > .form-item > .phone', '18124034031')

      await page.waitForSelector('form > .form-item > .send-code > .verification-code > .verification-code__btn')
      await page.click('form > .form-item > .send-code > .verification-code > .verification-code__btn')

      await sleep(2000)

      await page.type('.fmm-wrap > .apply-wrap > form > .form-item:nth-child(3) > input', '王天霸')

      await page.type('.fmm-wrap > .apply-wrap > form > .form-item:nth-child(4) > input', '440923199610036155')

      await sleep(2000)

      await page.waitForSelector('#\__layout > .fmm-wrap > .apply-wrap > form > .van-button')
      await page.click('#\__layout > .fmm-wrap > .apply-wrap > form > .van-button')

      await sleep(2000)
};