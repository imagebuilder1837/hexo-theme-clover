'use strict';

// Run from a Hexo site that has installed the dependencies in test/fixture/package.json:
// node themes/clover/test/integration.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const theme = path.resolve(__dirname, '..');
const fixture = path.join(__dirname, 'fixture');
const site = process.cwd();
const modules = path.join(site, 'node_modules');
const hexo = path.join(modules, 'hexo', 'bin', 'hexo');
assert.ok(fs.existsSync(hexo), 'Run from a site with Hexo installed');

const all = ['Plain story', 'Tagged story', 'Category story', 'Both story', 'Blocked story', 'Ignored story'];
const cases = [
  ['unconfigured', '', all],
  ['empty home', 'home: {}', all],
  ['null home', 'home: null', all],
  ['empty conditions', 'home: {category: "", tag: [], except_category: [], except_tag: null}', all],
  ['only tag string', 'home: {tag: Featured}', ['Tagged story', 'Both story', 'Blocked story']],
  ['only category string', 'home: {category: News}', ['Category story', 'Both story']],
  ['tag array', 'home: {tag: [Featured, Ignored]}', ['Tagged story', 'Both story', 'Blocked story', 'Ignored story']],
  ['category array', 'home: {category: [News, Hidden]}', ['Category story', 'Both story', 'Blocked story']],
  ['either category or tag', 'home: {category: News, tag: Ignored}', ['Category story', 'Both story', 'Ignored story']],
  ['excluded category with tag match', 'home: {tag: Featured, except_category: Hidden}', ['Tagged story', 'Both story']],
  ['excluded tag with category match', 'home: {category: News, except_tag: Featured}', ['Category story']],
  ['exceptions without inclusion', 'home: {except_category: Hidden, except_tag: Ignored}', ['Plain story', 'Tagged story', 'Category story', 'Both story']],
  ['empty exceptions with inclusion', 'home: {tag: Featured, except_category: "", except_tag: []}', ['Tagged story', 'Both story', 'Blocked story']]
];

for (const [label, override, expected] of cases) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clover-example-'));
  try {
    fs.cpSync(fixture, dir, {
      recursive: true,
      filter: source => !['node_modules', 'public', 'db.json'].includes(path.basename(source))
    });
    fs.symlinkSync(modules, path.join(dir, 'node_modules'), 'dir');
    fs.mkdirSync(path.join(dir, 'themes'));
    fs.symlinkSync(theme, path.join(dir, 'themes', 'clover'), 'dir');
    if (override) {
      fs.appendFileSync(path.join(dir, '_config.yml'), `\ntheme_config:\n  ${override}\n`);
    }
    const result = spawnSync(process.execPath, [hexo, 'generate', '--bail'], {
      cwd: dir, encoding: 'utf8'
    });
    assert.equal(result.status, 0, `${label}: ${result.stdout}\n${result.stderr}`);
    const html = fs.readFileSync(path.join(dir, 'public', 'index.html'), 'utf8');
    const found = [...html.matchAll(/<a href="[^"]+" class="title">([^<]+)<\/a>/g)]
      .map(match => match[1]).filter(name => all.includes(name)).sort();
    assert.deepEqual(found, [...expected].sort(), label);
    if (label === 'unconfigured') {
      for (const value of ['hello@example.com', 'https://example.com/github', 'https://example.com/author', 'https://example.com/terms']) {
        assert.ok(html.includes(value), `missing example default: ${value}`);
      }
      for (const page of ['archives/index.html', 'tags/index.html', 'categories/index.html', 'tags/Featured/index.html', 'categories/News/index.html']) {
        assert.ok(fs.existsSync(path.join(dir, 'public', page)), `missing example route: ${page}`);
      }
      const tagPage = fs.readFileSync(path.join(dir, 'public', 'tags', 'Featured', 'index.html'), 'utf8');
      assert.ok(tagPage.includes('Tagged story') && !tagPage.includes('Category story'), 'tag page content');
      const categoryPage = fs.readFileSync(path.join(dir, 'public', 'categories', 'News', 'index.html'), 'utf8');
      assert.ok(categoryPage.includes('Category story') && !categoryPage.includes('Tagged story'), 'category page content');
    }
    process.stdout.write(`ok ${label}\n`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
