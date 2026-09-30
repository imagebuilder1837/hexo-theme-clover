'use strict';

const metadata = require('./metadata');

// Atom updated is mandatory. Its publication-date fallback is a protocol
// requirement, never a claim that an article has substantively changed.
const escape = value => String(value)
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const element = (name, value) => value === undefined || value === '' ? '' : `<${name}>${escape(value)}</${name}>`;
const author = name => name ? `<author>${element('name', name)}</author>` : '';
const link = (href, rel) => `<link href="${escape(href)}"${rel ? ` rel="${rel}"` : ''}/>`;

module.exports = function (locals) {
  const { config } = this;
  const feed = config.feed;
  const posts = locals.posts.sort(feed.order_by || '-date').toArray()
    .filter(post => post.published !== false && post.draft !== true && post.author !== false);
  const selected = feed.limit ? posts.slice(0, feed.limit) : posts;
  if (!selected.length) return;
  const type = Array.isArray(feed.type) ? feed.type : [feed.type];
  const path = Array.isArray(feed.path) ? feed.path[type.indexOf('atom')] : feed.path || 'atom.xml';
  const siteLanguage = metadata.language({}, config);
  const entries = selected.map(post => {
    const data = metadata.resolve(post, config, true);
    if (!data.author) throw new Error(`${post.source}: Atom requires an author; set the site author, a post author, or author: false to exclude it`);
    if (!data.published) throw new Error(`${post.source}: Atom requires a valid publication date`);
    const categories = [...post.categories.toArray(), ...post.tags.toArray()]
      .map(category => `<category term="${escape(category.name)}"/>`).join('');
    const content = feed.content && post.content ? `<content type="html">${escape(post.content)}</content>` : '';
    return {
      updated: data.modified || data.published,
      xml: `<entry xml:lang="${escape(data.language)}">${element('title', post.title)}${element('id', data.url)}${link(data.url, 'alternate')}${author(data.author)}${element('published', data.published)}${element('updated', data.modified || data.published)}${element('summary', data.description)}${content}${categories}</entry>`
    };
  });
  const updated = entries.map(entry => entry.updated).sort().at(-1);
  const siteUrl = metadata.canonical({}, config);
  const hub = metadata.absolute(feed.hub, config);
  const icon = metadata.absolute(feed.icon, config);
  return {
    path,
    data: `<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${escape(siteLanguage)}">${element('title', config.title)}${element('id', siteUrl)}${element('subtitle', config.description || config.subtitle)}${element('updated', updated)}${link(siteUrl, 'alternate')}${link(metadata.absolute(path, config), 'self')}${hub ? link(hub, 'hub') : ''}${element('icon', icon)}${author(typeof config.author === 'string' ? config.author.trim() : undefined)}<generator uri="https://hexo.io/">Hexo / Clover</generator>${entries.map(entry => entry.xml).join('\n')}</feed>`
  };
};
