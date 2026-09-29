# Clover

A Hexo theme maintained from [the upstream Clover theme](https://github.com/esappear/hexo-theme-clover). The [upstream preview](https://esappear.github.io/clover/) shows the upstream version, not this maintenance line.

## Use

In a Hexo site with the EJS, Markdown and Sass renderers installed:

```sh
git clone --branch maintenance/generic https://github.com/ImageBuilder1837/hexo-theme-clover.git themes/clover
```

Set `theme: clover` in the site's `_config.yml`, then run `hexo generate`. Theme scripts also require `hexo-pagination` and `object-assign` in the site dependencies. To build the fictional example site from this checkout:

```sh
cd test/fixture
npm ci
mkdir -p themes
ln -s ../../.. themes/clover
npm run build
```

The example uses only fictional posts and example links.

Put your site's title, email, copyright text, social links, menu, and any other site-specific values in the site's `theme_config`, not in the theme's `_config.yml`. Hexo *merges* nested maps: a site override of `social.GitHub` replaces the example GitHub URL, but other default social keys would remain. The theme defaults to one visible `https://example.com/github` link. Set `social_order` to a list of names if the site's icon order must remain stable after merging. Check generated pages after changing social links.

## Home page filter

Optional `theme_config.home` values `category`, `tag`, `except_category`, and `except_tag` each accept a name or a list of names. A post matching either `category` or `tag` appears on the home page unless it matches either exclusion. With no nonempty inclusion, all posts (including untagged and uncategorized posts) appear unless excluded. Missing, `null`, empty-string and empty-list conditions do not restrict results.

The theme's [integration test](test/integration.js) generates the fictional site for each filter case and checks the posts on the home page. Run it from a Hexo site with the example dependencies installed using `node themes/clover/test/integration.js`.
