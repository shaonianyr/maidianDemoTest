# 埋点自动化测试 Demo 展示

maidianDemoTest 是基于 nodejs 以及 puppeteer 开发的一个埋点自动化测试框架，可以在框架原有的基础上适配公司业务进行埋点测试。框架通过 Demo 展示如何对常见的 webclick 事件以及一些需要复杂操作触发的自定义类型的事件进行监听和校验。我们可以对已有的埋点进行回归测试，也可以对新迭代的埋点进行触发测试，你只需要做的是填好 excel 的表格，并根据 Demo 示例适配自己的业务。

## 方案设计

通过读取 excel 表中的埋点数据，借助 puppeteer 去触发埋点和监听埋点上报的信息，最后取出关键字段进行校验和统计，并将成功和错误的信息打印在不同的日志中方便查看和 debug 。框架的文件结构如下：

```
├── demo.js     // 脚本启动文件
├── eventCheck
│   └── eventCheck.js  // 适配业务埋点的触发及校验的封装
├── excel
│   └── getExcel.js    // 通用的读取 excel 数据的封装
├── logs
│   ├── logs
│   │   ├── datelogFail  // 错误信息日志
│   │   └── datelogSuc   // 成功信息日志
│   └── logUtils.js      // 通用的记录 log 数据的封装
├── package.json         // npm 依赖包
├── package-lock.json
├── picture              // README 文档截图
├── README.md
├── selector.xlsx        // 统计埋点数据的 excel 表
└── test
    ├── testExcel.js     // 自测通用读取 excel 数据封装的功能
    └── testLog.js       // 自测通用记录 log 数据封装的功能

```

## 快速体验

```
    // 首先要准备好 nodejs && npm 环境
    git clone https://github.com/ShaoNianyr/maidianDemoTest.git
    cd maidianDemoTest
    npm install // 最好用 cnpm ( 安装 puppeteer 的时候如果卡住并用 ctrl c 取消，下次安装会默认跳过，请先卸载以后再重新安装 )
    node demo.js 
```

一切正常的话，你可以看到：

```
[2019-11-01T15:21:08.909] [ERROR] datelogFail - Webclick 埋点 1 页面： location2
[2019-11-01T15:21:08.910] [ERROR] datelogFail - Webclick 埋点当前名字为 【 name2 】 预期名字为 【 name1 】 断言失败
[2019-11-01T15:21:08.942] [ERROR] datelogFail - Login 埋点 1 location1 位置没有上报
[2019-11-01T15:21:08.942] [INFO] datelogSuc - 埋点总数： 2
[2019-11-01T15:21:08.942] [INFO] datelogSuc - 埋点正确个数： 0
[2019-11-01T15:21:08.942] [ERROR] datelogFail - 埋点错误个数： 2
[2019-11-01T15:21:08.942] [ERROR] datelogFail - 错误埋点分别为： [ 'Webclick 埋点1 name1', 'Login 埋点1 location1' ]
```

这里展现了埋点的两种错误，一种是 webclick 类型的埋点触发以后，上报的名字与 excel 表格当中的不匹配，另外一种是自定义上报登陆位置的埋点并没有上报。

## 原理讲解

### 提取的 excel 表数据

```
    cd test && node testExcel.js
```

然后我们可以看到：

```
[ [ { key: 1,
      url: 'https://yourUrl.com',
      selector: 'elementSelectorPath',
      element_name: 'name1' } ],
  [ { key: 1,
      url: 'https://yourUrl.com/login?xxx',
      telInput: 'telInputSelectorPath',
      getCode: 'getCodeSelectorPath',
      submit: 'submitSelectorPath',
      loginPosition: 'location1' } ] ]
```

list[0] 对应 sheet1 的 webclick 事件，list[1] 对应 sheet2 的 login 事件。自己新增的 sheet 可以在 ./excel/getExcel.js 里面加 if 来新增。

### 普通的 webclick 事件

普通的 webclick 事件被填写在 excel 表的 sheet1 中，读取后构造的数据如下：

```
    { key: 1,
      url: 'https://yourUrl.com',
      selector: 'elementSelectorPath',
      element_name: 'name1' }
```

因为 webclick 事件只需要埋点的 url 位置，以及要点击事件的 selector 定位，点击以后监听事件即可。

### 自定义的 login 事件

自定义的 login 事件被填写在 excel 表的 sheet2 中，读取后构造的数据如下：

```
    { key: 1,
      url: 'https://yourUrl.com/login?xxx',
      telInput: 'telInputSelectorPath',
      getCode: 'getCodeSelectorPath',
      submit: 'submitSelectorPath',
      loginPosition: 'location1' }
```

因为 login 事件需要输入用户名密码，或者手机号验证码等等，还要点击登陆，只需要在新的 sheet 里面加，然后给 puppeteer 去模拟操作即可。

### 如何监听埋点上报事件

```
   page.on('console', msg = {
       ...
   });
```

hadSent 字段代表事件是否有上报， hadNameTrue 字段代表校验是否通过。由于 Demo 中并未以真实网站作为例子，所以涉及 puppeteer 的所有动作操作均以注释，通过用 page.evaluate() 来模拟上报一个事件，并打印在控制台当中作为监听对象，相关代码如下：

```
    // await page.waitForSelector(sheet[i][j].selector);
    // await page.click(sheet[i][j].selector);
    await page.evaluate(() => console.log('{ "pageLocation": "location2", "elementName": "name2" }'));    
```

实际使用过程中应该使用注释的部分来触发元素的埋点上报，注释掉 page.evaluate() 。

