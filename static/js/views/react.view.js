var CollectionsListView = React.createClass({
  render: function() {
    var items = _.map(this.props.db_scheme, (function(_this) {
      return function(table, name) {
        return <a href="#"
                  onClick={_this.props.onTabChange.bind(null, name)}
                  className={classNames({'list-group-item': true, active: _this.props.activeTab === name})}
                  key={name}>{table.name}</a>
      };
    })(this));
    return (<div className='list-group'>{items}</div>);
  }
}),

NewObjectForm = React.createClass({
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
          return (<div className='form-group'>
            <label htmlFor={'id-' + field.name} className={'col-sm-2 control-label'}>{field.name}</label>
            <div className='col-sm-10'>
              <input type={field_type}
                     required='required'
                     className='form-control'
                     name={field.name}
                     id={'id-' + field.name}/>
            </div>
          </div>);
      });
      return (<form className='form-horizontal' onSubmit={this.onSubmit}>
        {inputs}
        <div className='form-group'>
          <div className='col-sm-offset-2 col-sm-10'>
            <button type='submit' className='btn btn-default'>Отправить</button>
          </div>
        </div>
        </form>);
  }
}),
EditableTd = React.createClass({
  getInitialState: function() {
    return {
      focus: false,
      error: false
    };
  },
  onClick: function(event) {
    console.log('on click');
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
    var value, field_type, error;
    value = this.props.object.get(this.props.field.name);
    field_type = {
      char: 'text',
      int: 'number',
      date: 'date'
    }[this.props.field.type];
    if (this.state.focus) {
      if (this.state.error) {
        error = (<span className='error'>Неправильно заполнено поле</span>);
      }
      return <td><input type={field_type} 
        required='required'
        onBlur={this.onBlur}
        className='form-control input-sm'
        ref='input'
        defaultValue={value}
        onKeyUp={this.onKeyUp}/>{error}</td>;
    } else {
      return <td onClick={this.onClick}>{value}</td>;
    }
  }
}),
CollectionDetailView = React.createClass({
  newObject: function(data) {
    return this.props.collection.create(data);
  },
  render: function() {
    var headers = _.map(this.props.db_scheme.fields, function(field) {
        return <th key={field.name}>{field.name}</th>;
      }),
      data = (function(_this) {
        return function() {
          if (_this.props.collection.length) {
            return _this.props.collection.map(function(object) {
              var items = _.map(_this.props.db_scheme.fields, function(field) {
                return <EditableTd key={object.get('id') + field.name} field={field} object={object}/>
              });
              return <tr key={object.get('id')}>{items}</tr>
            });
        } else {
          return (<tr>
            <td colSpan={_this.props.db_scheme.fields.length} className='text-center'>{'Нет данных'}</td>
          </tr>);
        }
      };
    })(this)();

    return <div>
      <table className="table table-bordered">
        <thead>
          <tr>{ headers }</tr>
        </thead>
        <tbody>
          {data}
        </tbody>
      </table>
      <NewObjectForm fields={this.props.db_scheme.fields} onSubmit={this.newObject}/>
    </div>
    
  }
}),
MainView = React.createClass({
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
    return (<div className="row">
      <div className="col-md-3">
        <CollectionsListView onTabChange={this.changeTab} db_scheme={this.props.db_scheme} activeTab={this.state.tab}/>
      </div>
      <div className="col-md-9">
        <CollectionDetailView name={this.state.tab} db_scheme={this.props.db_scheme[this.state.tab]} collection={this.state.collection}/>
      </div>
    </div>);
  }
});