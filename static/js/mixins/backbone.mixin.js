// var Backbone = require('backbone/backbone-min'),
//     _ = require('underscore/underscore-min');

var BackboneMixin = _.extend(Backbone.Events, {
  componentDidMount: function() {
    return this.bindEventHandlers(this.props);
  },
  componentWillUnmount: function() {
    return this.stopListening();
  },
  componentWillReceiveProps: function(nextProps) {
    this.stopListening();
    return this.bindEventHandlers(nextProps);
  }
});

// module.exports = BackboneMixin;