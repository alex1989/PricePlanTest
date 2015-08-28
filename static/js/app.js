var App = function() {
  this.initialize();
};

App.prototype.initialize = function() {
    React.render(
        <MainView db_scheme={window.db_scheme} collection={collection}/>,
        document.getElementById('container')
    );
};

new App();
