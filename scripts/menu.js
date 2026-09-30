'use strict';

// Hexo deep-merges menu maps, retaining default keys' insertion order.
// Prefer the site's declared menu order; inherited entries follow in their
// original order. No separate ordering option is needed.
hexo.extend.helper.register('menu_links', function () {
  const menu = this.theme.menu || {};
  const declared = this.config.theme_config && this.config.theme_config.menu;
  const keys = [...new Set([...Object.keys(declared || menu), ...Object.keys(menu)])];
  return keys.map(key => {
    const value = menu[key];
    return { key, path: value && typeof value === 'object' ? value.path : value };
  }).filter(item => typeof item.path === 'string' && item.path.trim());
});
