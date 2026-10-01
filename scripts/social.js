'use strict';

// Shared by the nav and footer partials: social entries in display order,
// with entries whose value is empty filtered out.
hexo.extend.helper.register('social_links', function () {
  const social = this.theme.social;
  if (!social) return [];
  const declared = this.config.theme_config && this.config.theme_config.social;
  const keys = [...new Set([...Object.keys(declared || social), ...Object.keys(social)])];
  return keys.filter(function (key) { return social[key]; })
    .map(function (key) { return { key: key, url: social[key] }; });
});
