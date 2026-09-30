# Clover

A Hexo theme maintained from [the upstream Clover theme](https://github.com/esappear/hexo-theme-clover). The [upstream preview](https://esappear.github.io/clover/) shows the upstream version, not this maintenance line.

## Use

In a Hexo site with the EJS, Markdown and Sass renderers installed:

```sh
git clone --branch main https://github.com/ImageBuilder1837/hexo-theme-clover.git themes/clover
```

Set `theme: clover` in the site's `_config.yml`, then run `hexo generate`. Theme scripts also require `hexo-pagination` and `object-assign` in the site dependencies.

Put your site's title, email, copyright text, social links, menu, and any other site-specific values in the site's `theme_config`, not in the theme's `_config.yml`. Hexo *merges* nested maps: a site override of `social.GitHub` replaces the example GitHub URL, but other default social keys would remain. The theme defaults to one visible `https://example.com/github` link. Set `social_order` to a list of names if the site's icon order must remain stable after merging. Check generated pages after changing social links.

## Page metadata

Set the site's `language` explicitly (for example `en-GB` or `zh-CN`). A page's `lang`, then `language`, overrides it. Tags are validated and canonicalized; underscore locale spellings are accepted. Missing language or Hexo's `default` alias falls back to the first valid site language, then `en`. Invalid explicit declarations fail generation. No language is inferred from the prose. HTML and JSON-LD use language tags; OG locale is emitted only when a region is explicitly known.

For posts, `description` is the search/share/structured-data/Atom summary. If empty, Clover falls back to `excerpt`; both are converted to plain text without an arbitrary length cutoff. Missing both omits the summary (no automatic body extraction). `excerpt` remains the card copy. Other pages use their description or the site's description. Site `keywords` accepts text or a list and is emitted as metadata; this is not a ranking guarantee. Only explicit `photos` provide representative images; body images are not automatically selected.

Post `author` has three states: omit to inherit `config.author`, use a nonempty string to override (trimmed), or boolean `false` to omit attribution and exclude the post from Atom. Empty strings, null, booleans other than false, arrays and objects fail generation. Optional `source_url` records a source through BlogPosting `isBasedOn`; it is not an author homepage, permission statement, or canonical override. BlogPosting is emitted only for posts. Only explicit front-matter `updated` produces modification metadata; Hexo's inferred file timestamps are ignored. Prefer site `updated_option: empty` when revisions are not recorded.

Rendered pages have directory-style absolute canonical URLs, with `index.html` collapsed and query/fragment removed; every pagination route refers to itself. Resource URLs are resolved separately and do not acquire a trailing slash. No alternate canonical front-matter field is supported.

Post, `about`, and generic `page` layouts provide an H1. Start Markdown content at H2; Clover does not automatically delete or rewrite headings in another site's content. Listing pages use a visually hidden H1 with H2 group headings.

### Optional Atom integration

If the site installs/enables `hexo-generator-feed`, Clover replaces its existing `atom` generator under the same registered name, preserving the configured path, limit, ordering, content, icon and hub options. It does not enable a feed on its own and does not replace RSS. The author contract described above applies to Atom, OG and BlogPosting; RSS is outside that contract. Drafts and `author: false` posts are filtered before the Atom limit. Each entry uses its article language, author, summary and canonical URL. Atom's mandatory `updated` falls back to publication date when no substantive revision is recorded; this is not a public modification claim. A feed entry without any available author fails generation rather than inheriting a false identity.

## Home page filter

Optional `theme_config.home` values `category`, `tag`, `except_category`, and `except_tag` each accept a name or a list of names. A post matching either `category` or `tag` appears on the home page unless it matches either exclusion. With no nonempty inclusion, all posts (including untagged and uncategorized posts) appear unless excluded. Missing, `null`, empty-string and empty-list conditions do not restrict results.
