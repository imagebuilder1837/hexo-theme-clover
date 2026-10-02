'use strict';

const compare = (a, b) => a > b ? 1 : a < b ? -1 : 0;

hexo.extend.helper.register('clover_browse_groups', function (kind) {
  if (!['archive', 'category'].includes(kind)) throw new Error(`Unsupported Clover browsing page: ${kind}`);
  const archive = kind === 'archive';
  const posts = archive ? this.page.posts.data : this.site.posts.data;
  const uncategorized = Symbol('uncategorized');
  const groups = new Map();
  for (const post of posts) {
    const key = archive ? post.date.format('YYYY') : post.categories.data[0]?.name ?? uncategorized;
    if (!groups.has(key)) {
      groups.set(key, {
        title: key === uncategorized ? this.__('other_category') : key,
        order: key === uncategorized ? '__CLOVER_OTHERS' : key,
        posts: []
      });
    }
    groups.get(key).posts.push(post);
  }
  return [...groups.values()]
    .sort((a, b) => (archive ? -1 : 1) * compare(a.order, b.order))
    .map(group => ({
      title: group.title,
      posts: group.posts.sort((a, b) => compare(b.date, a.date))
    }));
});
