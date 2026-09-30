'use strict';

const metadata = require('./lib/metadata');

hexo.extend.helper.register('clover_metadata', function () {
  return metadata.resolve(this.page, this.config, this.is_post());
});
hexo.extend.helper.register('clover_metadata_html', function (data) {
  return metadata.html(data, this.config, this.is_post(), this.theme);
});
hexo.extend.helper.register('clover_page_title', function () {
  if (this.is_archive()) return `${this.__('archive_a')}${this.page.year ? ': ' + this.page.year + (this.page.month ? '/' + this.page.month : '') : ''}`;
  if (this.is_category()) return `${this.__('category')}: ${this.page.category}`;
  if (this.is_tag()) return `${this.__('tag')}: ${this.page.tag}`;
  return this.page.title || this.config.title;
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
