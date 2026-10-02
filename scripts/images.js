'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { imageSize } = require('image-size');
const { parseFragment, serialize } = require('parse5');

const sizes = new Map();
const diagnosed = new Set();
function diagnose(src, reason) {
  if (diagnosed.has(src)) return;
  diagnosed.add(src);
  hexo.log.warn(`Clover image ${src}: ${reason}; intrinsic dimensions not added`);
}

// Only local source assets are inspected. URL resolution supports site roots
// and relative article paths, without treating remote URLs as filesystem paths.
function dimensions(src, pagePath = '') {
  if (!src) return null;
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src)) {
    diagnose(src, 'not a local source asset');
    return null;
  }
  let filename;
  try {
    const root = '/' + (hexo.config.root || '/').replace(/^\/+|\/+$/g, '');
    const base = root.replace(/\/$/, '') + '/' + pagePath.replace(/^\//, '');
    const pathname = decodeURIComponent(new URL(src, 'https://clover.invalid' + base).pathname);
    const prefix = root.replace(/\/$/, '') + '/';
    // Front matter often uses /images/... before url_for adds config.root.
    const assetPath = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname.slice(1);
    const source = fs.realpathSync(hexo.source_dir);
    filename = fs.realpathSync(path.resolve(source, assetPath));
    if (!filename.startsWith(source + path.sep)) throw new Error('outside source directory');
    if (!sizes.has(filename)) {
      const size = imageSize(fs.readFileSync(filename));
      if (!size.width || !size.height) throw new Error('missing intrinsic dimensions');
      sizes.set(filename, { width: size.width, height: size.height });
    }
    return sizes.get(filename);
  } catch (error) {
    diagnose(src, error.message);
    return null;
  }
}

hexo.extend.filter.register('before_generate', function () {
  sizes.clear();
  diagnosed.clear();
});

hexo.extend.helper.register('clover_card_image_attrs', function (src, index = 0) {
  const size = dimensions(src, this.page.path || '');
  const attrs = size ? `width="${size.width}" height="${size.height}"` : '';
  return attrs + (index >= 3 ? ' loading="lazy"' : '');
});

hexo.extend.helper.register('clover_body_images', function (html, pagePath = '') {
  const fragment = parseFragment(html || '');
  function walk(node) {
    if (node.tagName === 'img') {
      const attrs = Object.fromEntries(node.attrs.map(attr => [attr.name, attr.value]));
      const size = dimensions(attrs.src, pagePath);
      // Ordinary Markdown needs no metadata. Existing raw HTML is respected.
      if (size && !attrs.width && !attrs.height) {
        node.attrs.push({ name: 'width', value: String(size.width) }, { name: 'height', value: String(size.height) });
      }
      if (!attrs.loading) node.attrs.push({ name: 'loading', value: 'lazy' });
    }
    for (const child of node.childNodes || []) walk(child);
  }
  walk(fragment);
  return serialize(fragment);
});
