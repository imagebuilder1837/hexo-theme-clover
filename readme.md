# Clover

A Hexo theme maintained from [the upstream Clover theme](https://github.com/esappear/hexo-theme-clover). The [upstream preview](https://esappear.github.io/clover/) shows the upstream version, not this maintenance line.

## Use

In a current Hexo site on Node 24 with the EJS and Markdown renderers and `hexo-renderer-dartsass` (1.x) installed:

```sh
git clone --branch main https://github.com/ImageBuilder1837/hexo-theme-clover.git themes/clover
```

Set `theme: clover` in the site's `_config.yml`, then run `hexo generate`. Install the standard `hexo-generator-index`, `hexo-generator-archive`, `hexo-generator-category` and `hexo-generator-tag` plugins in the host site. Theme scripts also require `image-size` (2.x), `parse5` (8.x), `hexo-front-matter` (5.x) and `hexo-util` (4.x) in the site dependencies. Declare these directly rather than relying on another plugin's transitive dependencies.

Put your site's title, email, copyright text, social links, menu, and any other site-specific values in the site's `theme_config`, not in the theme's `_config.yml`. Hexo *merges* nested maps: a site override of `social.GitHub` replaces the example GitHub URL, but other default social keys would remain. The theme defaults to one visible `https://example.com/github` link. Set `social_order` to a list of names if the site's icon order must remain stable after merging. Check generated pages after changing social links.

## Page metadata

Set the site's `language` explicitly (for example `en-GB` or `zh-CN`). A page's `lang`, then `language`, overrides it. Tags are validated and canonicalized; underscore locale spellings are accepted. Missing language or Hexo's `default` alias falls back to the first valid site language, then `en`. Invalid explicit declarations fail generation. No language is inferred from the prose. HTML and JSON-LD use language tags; OG locale is emitted only when a region is explicitly known.

For posts, `description` is the search/share/structured-data/Atom summary. If empty, Clover falls back to `excerpt`; both are converted to plain text without an arbitrary length cutoff. Missing both omits the summary (no automatic body extraction). `excerpt` remains the card copy. Other pages use their description or the site's description. Site `keywords` accepts text or a list and is emitted as metadata; this is not a ranking guarantee. Only explicit `photos` provide representative images; body images are not automatically selected.

Post `author` has three states: omit to inherit `config.author`, use a nonempty string to override (trimmed), or boolean `false` to omit attribution and exclude the post from Atom. Empty strings, null, booleans other than false, arrays and objects fail generation. Optional `source_url` records a source through BlogPosting `isBasedOn`; it is not an author homepage, permission statement, or canonical override. BlogPosting is emitted only for posts. Only explicit front-matter `updated` produces modification metadata; Hexo's inferred file timestamps are ignored. Prefer site `updated_option: empty` when revisions are not recorded.

Rendered pages have directory-style absolute canonical URLs, with `index.html` collapsed and query/fragment removed; every pagination route refers to itself. Resource URLs are resolved separately and do not acquire a trailing slash. No alternate canonical front-matter field is supported.

Post and generic `page` layouts provide an H1; start their Markdown content at H2. The `about` layout renders only the content, so its Markdown must provide one H1. Clover does not automatically delete or rewrite headings in another site's content. Listing pages use a visually hidden H1 with H2 group headings.

### Optional Atom integration

If the site installs/enables `hexo-generator-feed`, Clover replaces its existing `atom` generator under the same registered name, preserving the configured path, limit, ordering, content, icon and hub options. It does not enable a feed on its own and does not replace RSS. The author contract described above applies to Atom, OG and BlogPosting; RSS is outside that contract. Drafts and `author: false` posts are filtered before the Atom limit. Each entry uses its article language, author, summary and canonical URL. Atom's mandatory `updated` falls back to publication date when no substantive revision is recorded; this is not a public modification claim. A feed entry without any available author fails generation rather than inheriting a false identity.

## Navigation and static content

Clover uses the host's standard generators for home, archive, individual category and individual tag routes; it does not override those generators. Their native sorting, sticky home posts, paths, layouts and pagination settings apply. The former `theme_config.home` inclusion/exclusion filter is no longer supported.

Create the category overview as a source page (for example `source/categories/index.md` with `layout: category`), just like the tag overview (`layout: tag`). The standard category plugin creates individual category routes using Hexo's `category_dir`, not the overview. Keep the tag plugin's optional `enable_index_page` disabled when the tag overview is owned by a source page. Overview groups use the first category and include all posts, including an uncategorized group. Sites using a different `category_dir` should place the source overview and menu at that path. `category_generator.path` no longer creates a separate overview route.

Set site `index_generator.per_page` independently of global `per_page`. Set `archive_generator.per_page` and `category_generator.per_page` explicitly to `0` if those indexes must remain unpaginated when global pagination is enabled. The category overview is always complete.

Styles use Sass modules (`@use`) with modern Dart Sass. Use `sass` in the site or theme configuration for compiler options; site values override theme defaults. For example, `sass: { style: compressed }` selects compressed output (default: `expanded`). When migrating from the old renderer, replace `node_sass.outputStyle` with `sass.style`; legacy `precision` and `sourceComments` options are not copied into the modern API. Do not install both Sass renderers.

Article body images and card covers receive intrinsic dimensions read from local source assets during generation. No image conversion or network probing occurs; unreadable or remote assets produce a warning instead of invented dimensions. Ordinary Markdown needs no size fields. Existing raw HTML dimensions and loading attributes are respected. Alt attributes/text are preserved as rendered, never generated; ordinary Markdown with no description may omit the attribute. Post pages show the first `photos` image before the title, full-width within the text column and without cropping. Set post front matter `cover: false` to hide this image on the detail page only; listing/share images remain unchanged. Repeated images in the body are not removed. Detail covers load eagerly; all ordinary Markdown body images use native lazy loading, even without a detail cover. The first two covers on each listing are not lazy-loaded; subsequent listing covers use native lazy loading. These are conservative position heuristics, not viewport or LCP measurements. Responsive CSS preserves aspect ratios.

For local build highlighting without line numbers or language guessing, use site configuration:

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

Token styles ship locally. Unknown/unmarked languages remain plaintext. Clover does not load a browser highlighter. Long code lines wrap automatically, including long unbroken tokens; code text and explicit newlines are preserved. Optional `theme_config.code_copy: true` loads a small local script that adds accessible copy controls to article `pre > code` blocks. It copies displayed text (not byte-identical Markdown source); unsupported or rejected Clipboard API access reports failure and leaves manual selection available. No legacy clipboard fallback is used. With JavaScript disabled there are no buttons and code remains readable. The default is off.

Desktop panel insets are 48px vertically/64px horizontally for home cards, 48px/90px for posts and generic pages, and 64px/90px for archive, category, tag and about pages. At widths up to 600px all panels use 20px insets. Post endings keep 32px body padding before the divider and 40px above the previous/next links (20px on mobile); the outer bottom inset supplies the space below those links. These values were selected with a local prototype, archived on the theme's `prototype/article-header-spacing-20261001` branch; prototype controls are not part of the theme.

After changing presentation, manually check representative desktop and narrow mobile pages: first images, image proportions, code token readability/wrapping, keyboard focus, copy success/failure and JavaScript-disabled reading. Generated-output tests do not establish browser layout, clipboard permission behavior or performance gains.
