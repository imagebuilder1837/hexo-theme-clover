'use strict';

var assign = require('object-assign');
var pagination = require('hexo-pagination');

hexo.config.category_generator = assign({
  per_page: typeof hexo.config.per_page === "undefined" ? 10 : hexo.config.per_page
}, hexo.config.category_generator);

hexo.extend.generator.register('category', function(locals){
  var config = this.config;
  var perPage = config.category_generator.per_page;
  var paginationDir = config.pagination_dir || 'page';
 
  // The category overview is a source page, like the tag overview.
  return locals.categories.reduce(function(result, category){
    if (!category.length) return result;

    var posts = category.posts.sort('-date');
    var data = pagination(category.path, posts, {
      perPage: perPage,
      layout: ['category', 'archive', 'index'],
      format: paginationDir + '/%d/',
      data: {
        category: category.name
      }
    });

    return result.concat(data);
  }, []);
});