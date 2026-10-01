# 内容指南

[返回 README](../readme.md) · [配置指南](configuration.md)

这里只说明会影响内容呈现、署名和订阅结果的约定。Front matter 的通用写法见 [Hexo 文档](https://hexo.io/zh-cn/docs/front-matter)。

## 语言与摘要

在站点 `_config.yml` 显式设置 `language`。单篇内容可用 `lang` 覆盖，未设置时再读取该篇的 `language`，最后回退到站点语言。使用有效语言标签，例如 `zh-CN` 或 `en-GB`；无效的显式声明会导致生成失败，不会从正文推断语言。

文章的 `description` 用作搜索、分享、结构化数据与 Atom 摘要，缺少时回退到 `excerpt`；`excerpt` 同时是列表卡片的正文。摘要转为纯文本，不自动截取文章正文。两者都未提供时不生成文章摘要；其他页面可回退到站点描述。

## 署名、来源与修订

文章 `author` 有三种用法：

- 省略：继承站点 `author`。
- 非空字符串：覆盖站点作者。
- 布尔值 `false`：不署名，并从 Atom 中排除。

空字符串、`null`、其他布尔值、列表或对象均不是有效作者声明，会导致生成失败。不要用 `author: false` 表示“作者未知但仍希望订阅收录”。

`source_url` 用来记录内容来源。页面 canonical 由站点 URL 和页面路径生成；主题不支持通过文章字段另设 canonical。分页路由各自指向自身。

只有 front matter 中显式填写的 `updated` 才作为文章的公开修订时间；Hexo 从文件时间推断的值不作修订声明。没有记录修订时可省略该字段，并考虑在站点设置 `updated_option: empty`。

## 可选 Atom

需要 Atom 时，在站点安装并配置 `hexo-generator-feed`，例如：

```sh
npm install --save hexo-generator-feed
```

站点 `_config.yml` 的配置示例：

```yaml
feed:
  enable: true
  type: atom
  path: atom.xml
  limit: 20
  content: false
```

主题只接管插件已注册的 Atom 生成器。草稿和 `author: false` 的文章在应用条数限制之前排除。被收录的文章必须有有效作者和发表日期，否则生成失败。

Atom 使用文章的语言、作者、摘要和 canonical。没有显式修订时，协议要求的 `updated` 回退到发表日期。

## 图片与封面

用显式 `photos` 指定列表与分享图片。例如文章 front matter：

```yaml
photos:
  - /images/example.jpg
cover: false
```

第一张 `photos` 图片默认也显示在文章详情页标题之前。`cover: false` 只隐藏详情封面。

文章正文和卡片封面的本地图片会在生成时补充可读取的尺寸，普通 Markdown 无需填写尺寸字段。远程或无法读取的图片会告警；已有 HTML 尺寸与加载属性会保留。图片描述由内容作者提供。

文章正文图片默认使用浏览器原生懒加载；详情封面优先加载。

## 标题层级

文章和普通 `page` 布局已经提供 H1，正文从 H2 开始。`about` 布局只渲染正文，需要正文自行提供一个 H1。

## 高亮与代码复制

主题使用构建时高亮。从上游迁移时，不要继续沿用关闭构建高亮的做法。站点配置示例：

```yaml
highlight:
  enable: true
  line_number: false
  auto_detect: false
  wrap: false
  hljs: true
  strip_indent: false
  tab_replace: ''
prismjs:
  enable: false
```

代码围栏应标明语言；未知或未标记的语言保留为纯文本。长代码行会换行，显式换行仍保留。

复制按钮默认关闭，需要时在站点配置启用：

```yaml
theme_config:
  code_copy: true
```

按钮复制的是展示的代码文本。浏览器不支持或拒绝 Clipboard API 时会提示失败，仍可手动选择；禁用 JavaScript 时不显示按钮，代码仍可阅读。

修改内容或相关配置后，在桌面与窄屏浏览器检查图片比例、代码可读性、键盘焦点、复制成功与失败、禁用 JavaScript 后的阅读体验。
