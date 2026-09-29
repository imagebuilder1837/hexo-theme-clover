'use strict';
var pagination = require('hexo-pagination');
var assign = require('object-assign');
hexo.config.index_generator = assign({
  per_page: typeof hexo.config.per_page === "undefined" ? 10 : hexo.config.per_page
}, hexo.config.index_generator);

hexo.extend.generator.register('index', function(locals){
  var config = this.config;
  var posts = (this.theme.config.home ? locals.posts.filter(getPostFilter(this.theme.config.home)): locals.posts).sort('-date');
  var paginationDir = config.pagination_dir || 'page';

  return pagination('', posts, {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
});

function getPostFilter(config) {
  function names(value) {
    return (Array.isArray(value) ? value : typeof value === 'string' ? [value] : [])
      .filter(function (name) { return typeof name === 'string' && name.length > 0; });
  }

  var categories = names(config.category);
  var tags = names(config.tag);
  var exceptCategories = names(config.except_category);
  var exceptTags = names(config.except_tag);

  function matches(terms, collection) {
    return collection.data.some(function (item) { return terms.includes(item.name); });
  }

  return function (post) {
    var excluded = matches(exceptCategories, post.categories) || matches(exceptTags, post.tags);
    var unrestricted = categories.length === 0 && tags.length === 0;
    return !excluded && (unrestricted || matches(categories, post.categories) || matches(tags, post.tags));
  };
}
