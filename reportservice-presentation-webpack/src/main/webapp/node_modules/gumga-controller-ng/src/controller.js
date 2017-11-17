import { QueryObject } from './query-object';

(function () {
  'use strict';
  function GumgaController(Service, identifierOrConfiguration, container, pageModel) {
    let self = this;
    this.and = this;
    this.data = [];
    this.page = 1;
    this.pageSize = 10;
    this.count = 0;
    this.records = [];
    this.pageModel = pageModel;
    this.container = container;
    this.identifierOrConfiguration = identifierOrConfiguration;

    this.storage = {
      set: (key, value) => {
        sessionStorage.setItem(identifierOrConfiguration+'-'+key, value);
      },
      get: (key) => {
        return sessionStorage.getItem(identifierOrConfiguration+'-'+key);
      }
    }

    this.setPageInContainer = () => {
      if(!self.container[pageModel]){
        const page = parseInt(self.storage.get('page') || self.page);
        self.container[pageModel] = page;
      }
    }

    this.handlingStorage = (page, pageSize, field, way, param) => {
      if(!page){
        page = parseInt(self.storage.get('page') || self.page);
      }
      if(!pageSize){
        pageSize = parseInt(self.storage.get('pageSize') || self.pageSize);
      }
      if(!field){
        field = (self.storage.get('field'));
      }
      if(!way){
        way = (self.storage.get('way'));
      }
      if(!param){
        param = "";
      }
      self.storage.set('page',     page     || self.page);
      self.storage.set('pageSize', pageSize || self.pageSize);
      self.storage.set('field',    field);
      self.storage.set('way',      way);
      self.storage.set('param',    param);

      return {
        page    : page,
        pageSize: pageSize,
        field:    field,
        way:      way,
        param:    param
      }
    }

    this.methods = {
      getLatestOperation(){
        self.setPageInContainer();
        const operation = self.storage.get('last-operation');
        if(!operation){
            self.methods.get(self.storage.get('page'), self.storage.get('pageSize'));
        }
        switch (operation) {
          case 'get':
            self.methods.get(self.storage.get('page'), self.storage.get('pageSize'));
            break;
          case 'sort':
            self.methods.sort(self.storage.get('field'), self.storage.get('way'), self.storage.get('pageSize'));
            break;
          case 'search':
            self.methods.search(self.storage.get('field'), self.storage.get('param'), self.storage.get('pageSize'), self.storage.get('page'));
            break;
          case 'asyncSearch':
            self.methods.asyncSearch(self.storage.get('field'), self.storage.get('param'));
            break;
          case 'advancedSearch':
            self.methods.advancedSearch(JSON.parse(self.storage.get('param')), self.storage.get('pageSize'), self.storage.get('page'));
            break;
          default:
            self.methods.get(self.storage.get('page'), self.storage.get('pageSize'));
        }
      },
      getRecords() {
        return self.records;
      },
      asyncSearch(field, param) {
        const storage = self.handlingStorage(undefined, undefined, field, undefined, param);
        self.storage.set('last-operation', 'asyncSearch');
        return Service
          .getSearch(field, param)
          .then(function (data) {
            self.storage.set('pageSize', data.data.pageSize);
            return data.data.values;
          });
      },
      asyncPost(value, param) {
        self.emit('asyncPostStart');
        return Service.save(value);
      },
      get(page, pageSize) {
        if(!pageSize) pageSize = self.pageSize;
        if(!page) page = self.page;
        const storage = self.handlingStorage(page, pageSize);
        self.storage.set('last-operation', 'get');
        self.emit('getStart');
        Service
          .get(page, pageSize)
          .then((data) => {
            self.emit('getSuccess', data.data);
            self.data = data.data.values;
            self.pageSize = data.data.pageSize;
            self.count = data.data.count;
            self.storage.set('pageSize', data.data.pageSize);
            self.data.map(record => self.records.push(record.id))
          }, (err) => { self.emit('getError', err); })
        return self;
      },
      getId(id = 0) {
        self.emit('getIdStart');
        Service
          .getById(id)
          .then((data) => {
            self.emit('getIdSuccess', data.data);
            self.data = data.data;
            if (self.pageSize) delete self.pageSize;
            if (self.count) delete self.count
          }, (err) => { self.emit('getIdError', err); })
        return self;
      },
      getNew() {
        self.emit('getNewStart');
        Service
          .getNew()
          .then((data) => {
            self.emit('getNewSuccess', data.data);
            self.data = data.data;
            if (self.pageSize) delete self.pageSize;
            if (self.count) delete self.count
          }, (err) => { self.emit('getNewError', err); })
        return self;
      },
      put(value) {
        self.emit('putStart');
        Service
          .update(value)
          .then(function (data) {
            self.emit('putSuccess', data);
          }, (err) => { self.emit('putError', err); })
        return self;
      },
      post(value) {
        self.emit('postStart');
        Service
          .save(value)
          .then((data) => {
            self.emit('postSuccess', data);
          }, (err) => { self.emit('postError', err); })
        return self;
      },
      delete(array) {
        self.emit('deleteStart');
        Service
          .deleteCollection(array)
          .then((data) => {
            self.emit('deleteSuccess', data);
          }, (err) => { self.emit('deleteError', err); })
        return self;
      },
      sort(field, way, pageSize) {
        if(!pageSize) pageSize = self.pageSize;
        const storage = self.handlingStorage(undefined, pageSize, field, way);
        const page    = storage.page;
        self.storage.set('last-operation', 'sort');
        self.emit('sortStart');
        Service
          .sort(field, way, pageSize, page)
          .then((data) => {
            self.emit('sortSuccess', data.data);
            self.data = data.data.values;
            self.pageSize = data.data.pageSize;
            self.count = data.data.count;
            self.storage.set('pageSize', data.data.pageSize);
          }, (err) => { self.emit('sortError', err); })
        return self;
      },
      search(field, param, pageSize, page) {
        if(!pageSize) pageSize = self.pageSize;
        if(!page) page = self.page;
        const storage = self.handlingStorage(page, pageSize, field, undefined, param);
        self.storage.set('last-operation', 'search');
        self.emit('searchStart');
        Service
          .getSearch(field, param, pageSize, page)
          .then((data) => {
            self.emit('searchSuccess', data.data);
            self.data = data.data.values;
            self.pageSize = data.data.pageSize;
            self.count = data.data.count;
            self.storage.set('pageSize', data.data.pageSize);
          }, (err) => { self.emit('searchError', err); })
        return self;
      },
      advancedSearch(param, pageSize, page) {
        if(!pageSize) pageSize = self.pageSize;
        if(!page) page = self.page;
        const storage = self.handlingStorage(page, pageSize, undefined, undefined, JSON.stringify(param));
        self.storage.set('last-operation', 'advancedSearch');
        self.emit('advancedSearchStart');
        Service
          .getAdvancedSearch(param, pageSize, page)
          .then((data) => {
            self.emit('advancedSearchSuccess', data.data);
            self.data = data.data.values;
            self.pageSize = data.data.pageSize;
            self.count = data.data.count;
            self.storage.set('pageSize', data.data.pageSize);
          }, (err) => { self.emit('advancedSearchError', err); })
        return self;
      },
      searchWithGQuery(gQuery, page, pageSize){
        if(!pageSize) pageSize = self.pageSize;
        if(!page) page = self.page;
        self.lastGQuery = gQuery;
        self.emit('searchWithGQueryStart');
        return Service
          .searchWithGQuery(gQuery, page, pageSize)
          .then((data) => {
            self.emit('searchWithGQuerySuccess', data.data);
            self.data = data.data.values;
            self.pageSize = data.data.pageSize;
            self.count = data.data.count;
          }, (err) => { self.emit('searchWithGQueryError', err); })        
      },
      asyncSearchWithGQuery(gQuery, page, pageSize){
        if(!pageSize) pageSize = self.pageSize;
        if(!page) page = self.page;
        self.lastGQuery = gQuery;
        self.emit('asyncSearchWithGQuery');
        return Service
          .searchWithGQuery(gQuery, page, pageSize)
          .then((data) => {
            self.emit('asyncSearchWithGQuery', data.data);
            self.pageSize = data.data.pageSize;
            self.count = data.data.count;
            return data.data.values
          }, (err) => { self.emit('asyncSearchWithGQuery', err); })        
      },
      redoSearch() {
        self.emit('redoSearchStart');
        Service
          .redoSearch()
          .then((data) => {
            self.emit('redoSearchSuccess', data.data);
            self.data = data.data.values;
            self.pageSize = data.data.pageSize;
            self.count = data.data.count;
          }, (err) => { self.emit('redoSearchError', err); })
        return self;
      },
      postQuery(query, name) {
        self.emit('postQueryStart');
        Service.saveQuery({ query: query, name: name })
          .then((data) => {
            self.emit('postQuerySuccess');
          }, (err) => { self.emit('postQueryError', err); })
        return self;
      },
      getQuery(page) {
        if(!page) page = self.page;
        self.emit('getQueryStart');
        return Service
          .getQuery(page)
          .then((data) => {
            self.emit('getQuerySuccess', data.data);
            return data.data.values;
          }, (err) => { self.emit('getQueryError', err); })
      },
      postImage(attribute, model) {
        self.emit('postImageStart');
        return Service
          .saveImage(attribute, model)
          .then((data) => {
            self.emit('postImageSuccess');
            return data;
          }, (err) => { self.emit('postImageError', err); })
      },
      deleteImage(attribute, model) {
        self.emit('deleteImageStart');
        Service.deleteImage(attribute, model)
          .then((data) => {
            self.emit('deleteImageSuccess');
          }, (err) => { self.emit('deleteImageError', err); })
        return self;
      },
      reset() {
        self.emit('resetStart');
        Service.resetDefaultState();
        return self;
      },
      getAvailableTags() {
        self.emit('getAvailableTagsStart');
        return Service.getAvailableTags();
      },
      getSelectedTags(id) {
        self.emit('getSelectedTagsStart');
        return Service.getSelectedTags(id);
      },
      postTags(id, values) {
        self.emit('postTagStart', values);
        Service.postTags(id, values)
          .then(data => {
            self.emit('postTagSuccess', values);
          }, err => {
            self.emit('postTagError', values);
          })
      },
      getDocumentationURL() {
        self.emit('getDocumentationURLStart')
        return Service.getDocumentationURL()
      },
      createQuery(){
        return new QueryObject(Service, self);
      }
    };
  }

  GumgaController.prototype.callbacks = {};

  GumgaController.prototype.and = this;

  GumgaController.prototype.emit = function (ev, data) {
    if (this.callbacks[ev]) {
      this.callbacks[ev].forEach((cb) => {
        cb(data);
      });
    }
    return this;
  }

  GumgaController.prototype.on = function (ev, cb) {
    if (!this.callbacks[ev]) {
      this.callbacks[ev] = [];
    }
    this.callbacks[ev].push(cb);
    return this;
  }

  GumgaController.prototype.execute = function (nameOfTheFunction = {}, ...args) {
    if (nameOfTheFunction.constructor !== String) throw 'O primeiro parâmetro deve ser uma string!';
    if (this.methods[nameOfTheFunction]) {
      this.methods[nameOfTheFunction](...args);
      return this;
    }
    throw 'O nome do método está errado! Por favor coloque um método que está no GumgaController';
  }


  // -------------------------------------------------------- Componente

  GumgaCtrl.$inject = [];

  function GumgaCtrl() {

    function createRestMethods(container, service, identifierOrConfiguration, pageModel = 'page') {
      let idConstructor = identifierOrConfiguration.constructor;
      if (!container) throw 'É necessário passar um objeto no primeiro parâmetro';
      if (!service) throw 'É necessário passar um objeto no segundo parâmetro';
      if (idConstructor !== Object && idConstructor !== String) throw 'É necessário passar um objeto ou uma string no terceiro parâmetro';
      const options = this._createOptions(identifierOrConfiguration);
      if (!!options.noScope) return new GumgaController(service, identifierOrConfiguration, container, pageModel);
      container[options.identifier] = new GumgaController(service, identifierOrConfiguration, container, pageModel);
      return;
    }

    function _createOptions(identifier = {}) {
      if (identifier.constructor === String) {
        return {
          identifier,
          noScope: false
        }
      }
      let object = angular.extend({}, identifier);
      object.noScope = !!object.noScope;
      if (!object.identifier) {
        throw 'Você precisa passar um identificador para o objeto de configuração do createRestMethods!';
      }
      return object;
    }

    return {
      createRestMethods,
      _createOptions
    };
  }

  angular.module('gumga.controller', [])
    .factory('gumgaController', GumgaCtrl);
})();
