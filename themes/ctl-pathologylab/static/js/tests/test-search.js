/* eslint-env node */
/* eslint-env mocha */

var assert = require('assert');
var fs = require('fs');

var Search = require('../src/search.js').Search;

var items = JSON.parse(fs.readFileSync('resources.json', 'utf8'));

describe('Search', function() {
    it('can be initialized with an empty array', function() {
        var s = new Search([]);
        assert.strictEqual(s.results.length, 0);
    });

    it('can be initialized with items', function() {
        var s = new Search(items.pages);
        assert.strictEqual(s.results.length, 0);
    });
});

describe('Search.doSearch()', function() {
    it('returns the right elements when empty', function() {
        var s = new Search([]);
        s.doSearch('abc');
        assert.strictEqual(s.results.length, 0);
    });

    it('returns all elements when given an empty string', function() {
        var s = new Search(items.pages);
        s.doSearch('');
        assert.strictEqual(s.results.length, items.pages.length);
    });

    it('returns the right elements when there are items', function() {
        var s = new Search(items.pages);
        s.doSearch('abc');
        assert.strictEqual(s.results.length, 0);

        s.doSearch('hematopoiesi');
        assert.strictEqual(s.results.length, 2);

        s.doSearch('the liver is the largest gland');
        assert.strictEqual(s.results[0].ref, '913bf017ba988f08bdbdd026ba7b261b');
    });

});
