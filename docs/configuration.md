# 配置指南

[返回 README](../readme.md) · [内容指南](content.md)

以下片段均合并进站点 `_config.yml`。主题可用选项见[默认配置](../_config.yml)，通用站点配置见 [Hexo 文档](https://hexo.io/zh-cn/docs/configuration)。

## 站点与主题配置

站点身份信息使用 Hexo 顶层配置；主题专属选项放在 `theme_config`，避免升级主题时覆盖个人设置：

```yaml
title: 我的博客
url: https://example.com
language: zh-CN
author: 我的名字
theme: clover
theme_config:
  nav:
    title: 我的博客
  mail: me@example.com
  copyright: 我的版权说明
  social:
    GitHub: https://github.com/your-name
```

`title` 是站点标题，`theme_config.nav.title` 是主题导航标题。主题默认值中的邮箱、版权文字和社交链接只是示例，应替换或清空。

Hexo 会深合并配置中的映射。例如，只新增一个社交链接不会删除默认的 GitHub 链接；只新增菜单也不会删除默认的 Tag、About。要隐藏继承的条目，将对应值设为空：

```yaml
theme_config:
  social:
    GitHub: ''
  menu:
    About: ''
```

社交链接与菜单分别优先按站点 `theme_config.social`、`theme_config.menu` 的声明顺序显示，未声明的默认条目追加在末尾。排序不再使用单独的 `social_order` 配置；旧配置需将顺序移到 `social` 条目的排列中。

## 分类与标签总览

标准生成器负责首页、归档、单个分类和单个标签的路由；分类与标签**总览**需要另建源页面。

创建 `source/categories/index.md`：

```yaml
---
layout: category
---
```

创建 `source/tags/index.md`：

```yaml
---
layout: tag
---
```

对应站点配置示例：

```yaml
category_dir: categories
tag_dir: tags
theme_config:
  menu:
    Category: /categories/
    Tag: /tags/
tag_generator:
  enable_index_page: false
```

使用源页面作为标签总览时，不要同时开启标签生成器的 `enable_index_page`，否则两者会占用同一路由。修改 `category_dir` 或 `tag_dir` 时，源页面目录和菜单路径也应一起修改。

分类总览按文章的第一分类分组，包含未分类文章；多级分类不会让同一篇文章在每组重复出现。分类总览完整列出文章，不分页；标签总览显示标签云。

从上游迁移时，`category_generator.path` 不再用于创建分类总览；原有 `theme_config.home` 首页包含/排除筛选也不再支持。

## 分页

各标准生成器默认继承全局 `per_page`。需要首页分页、其他列表完整展示时，分别设置生成器选项，而不是只改全局值：

```yaml
per_page: 10
index_generator:
  per_page: 12
archive_generator:
  per_page: 0
category_generator:
  per_page: 0
tag_generator:
  per_page: 0
  enable_index_page: false
```

这里的首页条数仅为示例；`0` 表示不分页。以上选项影响标准列表路由，不改变源页面分类总览的行为。

## Sass

主题使用 Dart Sass，不要同时安装旧 Sass 渲染器与 `hexo-renderer-dartsass`。从旧渲染器迁移时，用 `sass.style` 替代 `node_sass.outputStyle`。

例如压缩 CSS 输出：

```yaml
sass:
  style: compressed
```

同名 Sass 选项的优先级为：**站点顶层 `sass` > `theme_config.sass` > 主题默认 `sass`**。渲染器对站点和主题的 Sass 选项做浅合并。
