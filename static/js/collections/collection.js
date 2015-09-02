var Collection = Backbone.Collection.extend({
  tab: null,
  url: function() {
    return '/api/' + this.tab + '/';
  }
});

var collection = new Collection();
