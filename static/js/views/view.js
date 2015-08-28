CollectionsListView = React.createClass({displayName: "CollectionsListView",
  render: function() {
    var items = _.map(this.props.db_scheme, (function(_this) {
      return function(table, name) {
        return React.createElement("a", {href: "#", 
                  onClick: _this.props.onTabChange.bind(null, name), 
                  className: classNames({'list-group-item': true, active: _this.props.activeTab === name}), 
                  key: name}, table.name)
      };
    })(this));
    return (React.createElement("div", {className: "list-group"}, items));
  }
}),
NewObjectForm = React.createClass({displayName: "NewObjectForm",
  onSubmit: function(event) {
      var data = {};
      event.preventDefault();
      _.each($(event.target).serializeArray(), function(obj) {
        return data[obj.name] = obj.value;
      });
      event.target.reset();
      return this.props.onSubmit(data);
  },
  render: function() {
      var inputs = _.map(this.props.fields, function(field) {
          var field_type={
              char: 'text',
              int: 'number',
              date: 'date'
            }[field.type];
          return (React.createElement("div", {className: "form-group"}, 
            React.createElement("label", {htmlFor: 'id-' + field.name, className: 'col-sm-2 control-label'}, field.name), 
            React.createElement("div", {className: "col-sm-10"}, 
              React.createElement("input", {type: field_type, 
                     required: "required", 
                     className: "form-control", 
                     name: field.name, 
                     id: 'id-' + field.name})
            )
          ));
      });
      return (React.createElement("form", {className: "form-horizontal", onSubmit: this.onSubmit}, 
        inputs, 
        React.createElement("div", {className: "form-group"}, 
          React.createElement("div", {className: "col-sm-offset-2 col-sm-10"}, 
            React.createElement("button", {type: "submit", className: "btn btn-default"}, "Отправить")
          )
        )
        ));
  }
}),

EditableTd = React.createClass({displayName: "EditableTd",
  getInitialState: function() {
    return {
      focus: false,
      error: false
    };
  },
  onClick: function(event) {
    return this.setState({
      focus: true
    });
  },
  onBlur: function(event) {
    var input;
    input = this.refs.input.getDOMNode();
    if (input.checkValidity()) {
      this.setState({
        focus: false,
        error: false
      });
      this.props.object.set(this.props.field.name, input.value);
      return this.props.object.save();
    } else {
      $(input).focus();
      return this.setState({
        error: true
      });
    }
  },
  onKeyUp: function(event) {
    var key;
    key = event.which || event.keycode;
    if (key === 13) {
      return this.onBlur();
    } else if (key === 27) {
      return this.setState({
        focus: false,
        error: false
      });
    }
  },
  componentDidUpdate: function() {
    if (this.state.focus) {
      return $(this.refs.input.getDOMNode()).focus();
    }
  },
  render: function() {
    var params, 
        value = this.props.object.get(this.props.field.name),
        field_type, error, html;
    if (!this.state.focus) {
      params = {
        onClick: this.onClick
      };
    } else {
      params = {};
    }
    field_type = {
          char: 'text',
          int: 'number',
          date: 'date'
        }[this.props.field.type];
    if (this.state.focus) {
      if (this.state.error) {
        error = React.createElement("span", {className: "error"}, "'Неправильно заполнено поле'")
      }
      html = (React.createElement("td", null, React.createElement("input", {type: field_type, 
        required: "required", 
        onBlur: this.onBlur, 
        className: "form-control input-sm", 
        ref: "input", 
        defaultValue: value,
        onKeyUp: this.onKeyUp}), error));
    } else {
      html = (React.createElement("td", params, null, value));
    }
    return html
  }
}),

CollectionDetailView = React.createClass({displayName: "CollectionDetailView",
  newObject: function(data) {
    return this.props.collection.create(data);
  },
  render: function() {
    var headers = _.map(this.props.db_scheme.fields, function(field) {
        return React.createElement("th", {key: field.id}, field.name);
      }),
      data = (function(_this) {
        return function() {
          if (_this.props.collection.length) {
            return _this.props.collection.map(function(object) {
              var items = _.map(_this.props.db_scheme.fields, function(field) {
                return React.createElement(EditableTd, {key: object.get('id') + field.id, field: field, object: object})
              });
              return React.createElement("tr", {key: object.get('id')}, items);
            });
          } else {
            return (React.createElement("tr", null, 
              React.createElement("td", {colSpan: _this.props.db_scheme.fields.length, className: "text-center"}, 'Нет данных')
            ));
          }
      };
    })(this)();
    return React.createElement("div", null, 
      React.createElement("table", {className: "table table-bordered"}, 
        React.createElement("thead", null, 
          React.createElement("tr", null,  headers )
        ), 
        React.createElement("tbody", null, 
          data
        )
      ), 
      React.createElement(NewObjectForm, {fields: this.props.db_scheme.fields, onSubmit: this.newObject})
    )
    
  }
});

MainView = React.createClass({displayName: "MainView",
  mixins: [BackboneMixin],
  getInitialState: function() {
    var collection, tab;
    tab = 0;
    collection = this.props.collection;
    collection.tab = this.props.db_scheme[tab]['name'];
    collection.fetch();
    return {
      tab: tab,
      collection: collection
    };
  },
  bindEventHandlers: function(props) {
    return props.collection.on('sync create change', this.updateState);
  },
  updateState: function() {
    return this.setState({
      collection: this.props.collection
    });
  },
  changeTab: function(tab, event) {
    var collection;
    collection = this.props.collection;
    collection.tab = this.props.db_scheme[tab]['name'];
    collection.fetch();
    return this.replaceState({
      tab: tab,
      collection: collection
    });
  },
  render: function() {
    return (React.createElement("div", {className: "row"}, 
      React.createElement("div", {className: "col-md-3"}, 
        React.createElement(CollectionsListView, {onTabChange: this.changeTab, db_scheme: this.props.db_scheme, activeTab: this.state.tab})
      ), 
      React.createElement("div", {className: "col-md-9"},
        React.createElement(CollectionDetailView, {name: this.state.tab, db_scheme: this.props.db_scheme[this.state.tab], collection: this.state.collection})
        )
    ));
  }
});

React.render(
    React.createElement(MainView, {db_scheme: window.db_scheme, collection: collection}),
    document.getElementById('container')
);