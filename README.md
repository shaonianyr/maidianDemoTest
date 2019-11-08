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
│   │   ├── debuglog  // 错误信息日志
│   │   └── infolog   // 成功信息日志
│   └── logUtils.js      // 通用的记录 log 数据的封装
├── package.json         // npm 依赖包
├── picture              // README 文档截图
├── README.md
├── selector.xlsx        // 统计埋点数据的 excel 表
└── test
    ├── testExcel.js     // 自测通用读取 excel 数据封装的功能
    └── testLog.js       // 自测通用记录 log 数据封装的功能

```
## 校验错误类型

    1. 埋点没有上报
    2. 埋点重复上报
    3. 埋点上报信息不正确
    4. puppeteer 执行错误或 excel 填写错误数据等其他信息
    ...

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
ConsoleMessage {
  _type: 'log',
  _text:
   '{ "properties": { "$element_name": "name1", "$title": "page1" }}',
  _args:
   [ JSHandle {
       _context: [ExecutionContext],
       _client: [CDPSession],
       _remoteObject: [Object],
       _disposed: false } ],
  _location:
   { url: '__puppeteer_evaluation_script__',
     lineNumber: 0,
     columnNumber: 15 } }
ConsoleMessage {
  _type: 'log',
  _text:
   '{ "properties": { "$element_name": "name1", "$title": "page1" }}',
  _args:
   [ JSHandle {
       _context: [ExecutionContext],
       _client: [CDPSession],
       _remoteObject: [Object],
       _disposed: false } ],
  _location:
   { url: '__puppeteer_evaluation_script__',
     lineNumber: 0,
     columnNumber: 15 } }
     
[2019-11-08T11:18:46.938] [ERROR] datelogFail - hadOpenUrl: 1 hadClick: 1 hadSent: 1 nonRepeatReport: 0 hadNameTrue: 1  
[2019-11-08T11:18:46.940] [ERROR] datelogFail - Webclick 埋点 1 页面： page1
[2019-11-08T11:18:46.940] [ERROR] datelogFail - Webclick 埋点 1 name1 事件重复上报

ConsoleMessage {
  _type: 'log',
  _text: '{ "properties": { "login_position": "location2" }}',
  _args:
   [ JSHandle {
       _context: [ExecutionContext],
       _client: [CDPSession],
       _remoteObject: [Object],
       _disposed: false } ],
  _location:
   { url: '__puppeteer_evaluation_script__',
     lineNumber: 0,
     columnNumber: 15 } }

[2019-11-08T11:18:47.043] [ERROR] datelogFail - hadSent: 1 nonRepeatReport: 1 hadLocationTrue: 0
[2019-11-08T11:18:47.043] [ERROR] datelogFail - Login 埋点 1 当前登录位置为 【 location2 】 预期登录位置为 【 location1 】 断言失败
[2019-11-08T11:18:47.044] [INFO] datelogSuc - 埋点总数： 2
[2019-11-08T11:18:47.044] [INFO] datelogSuc - 埋点正确个数： 0
[2019-11-08T11:18:47.044] [ERROR] datelogFail - 埋点错误个数： 2
[2019-11-08T11:18:47.045] [ERROR] datelogFail - 错误埋点分别为： [ 'Webclick 埋点1 name1', 'Login 埋点1 location1' ]
```

这里展现了埋点的两种错误，一种是 webclick 类型的埋点重复上报，另外一种是自定义类型的埋点上报的登录位置与 excel 表格当中的不匹配。

## 更多体验

在 ./eventCheck/eventCheck.js 的 demo 示例代码中，可以自行选择类型体验：
(demo 中演示的是新增的埋点重复上报校验的功能)

```
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
```


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
    // 实际业务代码 (使用 puppeteer 去点击元素从而触发埋点)
    // await page.waitForSelector(sheet[i][j].selector);
    // await page.click(sheet[i][j].selector);

    // demo 演示代码 (直接使用 puppeteer 伪造一个事件的上报)
    await page.evaluate(() => console.log('{ "pageLocation": "location2", "elementName": "name2" }'));    
```

实际使用过程中应该参考实际业务代码的部分来触发元素的埋点上报，demo 演示代码仅做功能展示。

