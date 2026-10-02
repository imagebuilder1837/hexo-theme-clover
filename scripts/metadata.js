'use strict';

const metadata = require('./lib/metadata');

function pageTitle(context, fallback = context.config.title) {
  let title;
  if (context.is_archive()) {
    title = `${context.__('archive_a')}${context.page.year ? ': ' + context.page.year + (context.page.month ? '/' + context.page.month : '') : ''}`;
  } else if (context.is_category()) {
    title = `${context.__('category')}: ${context.page.category}`;
  } else if (context.is_tag()) {
    title = `${context.__('tag')}: ${context.page.tag}`;
  } else {
    const layoutTitle = { category: 'categories', tag: 'tags', about: 'about' }[context.page.layout];
    title = !context.is_post() && layoutTitle ? context.__(layoutTitle) : context.page.title || fallback;
  }
  return metadata.plain(title);
}

hexo.extend.helper.register('clover_title', metadata.plain);
hexo.extend.helper.register('clover_page_title', function (fallback) {
  return pageTitle(this, fallback);
});
hexo.extend.helper.register('clover_metadata', function () {
  const title = pageTitle(this, '');
  const siteTitle = metadata.plain(this.config.title);
  return {
    ...metadata.resolve(this.page, this.config, this.is_post()),
    title: title || siteTitle,
    documentTitle: title ? `${title} | ${siteTitle}` : siteTitle
  };
});
hexo.extend.helper.register('clover_metadata_html', function (data) {
  return metadata.html(data, this.config, this.is_post(), this.theme);
});

// Replace only the existing Atom generator, not its route or RSS sibling.
// Theme scripts alone do not enable a feed: hexo-generator-feed remains optional.
hexo.extend.filter.register('before_generate', function () {
  for (const post of hexo.locals.get('posts').toArray()) {
    metadata.author(post, hexo.config);
    metadata.language(post, hexo.config);
  }
  metadata.language({}, hexo.config);
  if (hexo.config.feed && hexo.config.feed.enable !== false && hexo.extend.generator.get('atom')) {
    hexo.extend.generator.register('atom', require('./lib/atom').bind(hexo));
  }
});
