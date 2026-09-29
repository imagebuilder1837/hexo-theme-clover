'use strict';

// Shared by the nav and footer partials: social entries in display order,
// with entries whose value is empty filtered out.
hexo.extend.helper.register('social_links', function () {
  const social = this.theme.social;
  if (!social) return [];
  const keys = Object.keys(social);
  const order = this.theme.social_order;
  if (order) {
    keys.sort(function (a, b) {
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      return (aIndex < 0 ? keys.length : aIndex) - (bIndex < 0 ? keys.length : bIndex);
    });
  }
  return keys.filter(function (key) { return social[key]; })
    .map(function (key) { return { key: key, url: social[key] }; });
});
