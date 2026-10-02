'use strict';

const { escapeHTML, stripHTML, unescapeHTML, full_url_for } = require('hexo-util');
const { parse } = require('hexo-front-matter');

function plain(value) {
  return typeof value === 'string' ? unescapeHTML(stripHTML(value)).replace(/\s+/g, ' ').trim() : '';
}

function summary(page, config, article) {
  return plain(page.description) || (article ? plain(page.excerpt) : plain(config.description));
}

function author(page, config) {
  if (page.author === undefined) return typeof config.author === 'string' ? config.author.trim() || undefined : undefined;
  if (page.author === false) return undefined;
  if (typeof page.author === 'string' && page.author.trim()) return page.author.trim();
  throw new Error(`${page.source || page.path || page.title}: author must be a non-empty string or false (omit it to inherit the site author)`);
}

function language(page, config) {
  const parse = (value, explicit) => {
    if (value === undefined || value === null || value === '' || value === 'default') return undefined;
    if (typeof value !== 'string') {
      if (!explicit) return undefined;
      throw new Error(`${page.source || page.path || 'site'}: invalid language declaration`);
    }
    try {
      return Intl.getCanonicalLocales(value.trim().replace(/_/g, '-'))[0];
    } catch {
      if (explicit) throw new Error(`${page.source || page.path || 'site'}: invalid language ${JSON.stringify(value)}`);
    }
  };
  const local = parse(page.lang, true) || parse(page.language, true);
  if (local) return local;
  if (Array.isArray(config.language)) {
    for (const value of config.language) {
      const valid = parse(value, false);
      if (valid) return valid;
    }
    return 'en';
  }
  return parse(config.language, true) || 'en';
}

function locale(tag) {
  const parts = new Intl.Locale(tag);
  return parts.region ? `${parts.language}_${parts.region}` : undefined;
}

// Only rendered HTML routes use this policy. Asset/source URLs use absolute().
function canonical(page, config) {
  const url = new URL(full_url_for.call({ config }, page.permalink || page.path || ''), config.url);
  url.search = '';
  url.hash = '';
  url.pathname = url.pathname.replace(/\/index\.html$/i, '/');
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.href;
}

function absolute(value, config) {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const url = new URL(full_url_for.call({ config }, value.trim()), config.url);
  return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
}

function images(page, config) {
  const values = Array.isArray(page.photos) ? page.photos : page.photos ? [page.photos] : [];
  return values.map(value => absolute(value, config)).filter(Boolean);
}

function iso(value) {
  if (!value) return undefined;
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date.toISOString();
}

function resolve(page, config, article) {
  return {
    title: plain(page.title) || plain(config.title),
    tags: page.tags && typeof page.tags.toArray === 'function' ? page.tags.toArray().map(tag => tag.name) : [],
    description: summary(page, config, article),
    url: canonical(page, config),
    language: language(page, config),
    author: article ? author(page, config) : undefined,
    images: images(page, config),
    published: article ? iso(page.date) : undefined,
    // Hexo may populate updated from mtime or publication date. Only an
    // explicitly recorded revision belongs in public modification metadata.
    modified: article && page.raw && parse(page.raw).updated ? iso(page.updated) : undefined,
    source: article ? absolute(page.source_url, config) : undefined
  };
}

function json(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function html(data, config, article, theme = {}) {
  const tags = [];
  const meta = (name, value, property = true) => {
    if (value !== undefined && value !== '') tags.push(`<meta ${property ? 'property' : 'name'}="${name}" content="${escapeHTML(String(value))}">`);
  };
  tags.push(`<link rel="canonical" href="${escapeHTML(data.url)}">`);
  meta('description', data.description, false);
  meta('keywords', Array.isArray(config.keywords) ? config.keywords.map(plain).filter(Boolean).join(', ') : plain(config.keywords), false);
  meta('og:type', article ? 'article' : 'website');
  meta('og:title', data.title);
  meta('og:description', data.description);
  meta('og:url', data.url);
  meta('og:site_name', plain(config.title));
  meta('og:locale', locale(data.language));
  data.images.forEach(image => meta('og:image', image));
  meta('article:author', data.author);
  meta('article:published_time', data.published);
  meta('article:modified_time', data.modified);
  if (article) data.tags.forEach(tag => meta('article:tag', tag));
  meta('twitter:card', 'summary', false);
  meta('twitter:title', data.title, false);
  meta('twitter:description', data.description, false);
  meta('twitter:image', data.images[0], false);
  if (theme.twitter) meta('twitter:creator', String(theme.twitter).startsWith('@') ? theme.twitter : '@' + theme.twitter, false);
  meta('fb:admins', theme.fb_admins);
  meta('fb:app_id', theme.fb_app_id);
  if (article) {
    tags.push(`<script type="application/ld+json">${json({
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: data.title, description: data.description || undefined,
      url: data.url, mainEntityOfPage: data.url, inLanguage: data.language,
      author: data.author ? { '@type': 'Person', name: data.author } : undefined,
      datePublished: data.published, dateModified: data.modified,
      image: data.images.length ? data.images : undefined,
      isBasedOn: data.source
    })}</script>`);
  }
  return tags.join('\n');
}

module.exports = { plain, summary, author, language, canonical, absolute, images, iso, resolve, html };
