# Clover

一个 Hexo 主题，本项目是 [上游 Clover](https://github.com/esappear/hexo-theme-clover) 的 fork，包含自定义调整。

## 使用实例

[imagebuilder1837 的博客](https://imagebuilder1837.github.io/) 使用了本主题及个人配置。

## 安装

以下步骤在**已有 Hexo 站点的根目录**执行，需要 Node、npm 和 Git。新建站点请先参考 [Hexo 安装指南](https://hexo.io/zh-cn/docs/)。

1. 安装主题：

   ```sh
   git clone --branch main https://github.com/imagebuilder1837/hexo-theme-clover.git themes/clover
   ```

2. 检查站点依赖，补齐缺少的包：

   - 渲染器：`hexo-renderer-ejs`、Markdown 渲染器（例如 `hexo-renderer-marked`）、`hexo-renderer-dartsass`。不要同时安装两套 Sass 渲染器，迁移配置见[配置指南](docs/configuration.md)。
   - 标准列表生成器：`hexo-generator-index`、`hexo-generator-archive`、`hexo-generator-category`、`hexo-generator-tag`。
   - 主题脚本依赖：`image-size`、`parse5`、`hexo-front-matter`、`hexo-util`。直接声明在站点依赖中，克隆主题不会自动安装这些包。

   例如补齐主题脚本依赖：

   ```sh
   npm install --save image-size parse5 hexo-front-matter hexo-util
   ```

3. 在站点 `_config.yml` 设置 `theme: clover`。站点标题、URL、作者和语言写在顶层；主题导航、社交链接等写在 `theme_config`。安装后应替换或清空示例身份与链接，具体见[配置指南](docs/configuration.md)。

4. 生成站点：

   ```sh
   npx hexo generate
   ```

   本地预览需要站点安装 `hexo-server`，然后运行 `npx hexo server`。Feed 也是可选功能。

## 使用文档

- [配置指南](docs/configuration.md)：配置覆盖、导航、分类与标签总览、分页、Sass。
- [内容指南](docs/content.md)：文章元数据、Atom、图片、标题层级、高亮与代码复制。

启用后检查导航是否指向实际页面，并在浏览器中预览桌面和窄屏效果。
