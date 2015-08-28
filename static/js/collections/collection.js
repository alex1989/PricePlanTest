Collection = Backbone.Collection.extend({
  tab: null,
  url: function() {
    console.log('/api/' + this.tab + '/');
    return '/api/' + this.tab + '/';
  }
});

var collection = new Collection();
