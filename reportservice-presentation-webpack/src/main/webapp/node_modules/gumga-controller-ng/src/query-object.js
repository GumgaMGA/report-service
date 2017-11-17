export class QueryObject {

    /** 
     * @param _service Objeto GumgaRest para podermos fazer chamadas a API.
     * @param _controller Objeto gumgaController para podermos salvar estados de buscas e atualizar dados do $scope.
    */
    constructor(_service, _controller){
        this.service = _service;
        this.controller = _controller;
        //LOAD DEFAULTS VALUES
        this.queryObject = {
            start: this.service.start,
            pageSize: this.service.pageSize
        };
    }

    /** 
     * @method page Responsável por especificar a página que você deseja.
     * @param _page página na qual será buscado os registros. DEFAULT: 1;
    */
    page(_page){
        if(!_page) _page = 1; 
        this._page = _page;
        this.queryObject.start = (_page - 1) * this.queryObject.pageSize;
        this.controller.handlingStorage(this._page, this.queryObject.pageSize);
        this.controller.setPageInContainer(this._page);
        this.controller.page = _page;
        return this;
    }

    /** 
     * @method pageSize Responsável por especificar a quantidade de registros.
     * @param _pageSize quantidade de registros que será mostrado por página. DEFAULT 10;
    */
    pageSize(_pageSize){
        if(!_pageSize) _pageSize = 10;
        this.queryObject.pageSize = _pageSize;
        //When you modify the size you have to recalculate the start
        if(this._page) this.page(this._page);
        this.controller.handlingStorage(this._page, this.queryObject.pageSize);
        return this;
    }

    /** 
     * @method aq   Adiciona um comando HQL na chamada, para que seja adicionado na cláusula WHERE.
     * @param _advancedValue HQL que será enviado para possibilitar filtrar dados com mais de uma condição.
    */
    aq(_advancedValue){
        if(!_advancedValue) console.error("Ao chamar o método um aq é obrigatório informar seu hql.");
        this.queryObject.aq = _advancedValue;
        return this;
    }

    /** 
     * @method q      Adiciona uma busca simples a chamada, pesquise um valor em um ou vários atributos.
     * @param _fields Nomes dos atributos que será feita a busca separador por virgula. ex: nome,apelido.
     * @param _value  Valor que será filtrado com base as campos especificados no atributo _fields.
    */
    q(_fields, _value){
        if(!_fields) console.error("Ao chamar o método um q é obrigatório informar os atributos que serão utilizados na busca.");
        this.queryObject.searchFields = this.queryObject.searchFields || [];
        _fields.trim().split(',').forEach(_field => this.queryObject.searchFields.push(_field.trim()));
        this.queryObject.q = _value;
        return this;
    }

    /** 
     * @method sort  Adiciona criterios de ordenação
     * @param _field Nome do atributo que será feito a ordenação
     * @param _dir   Direção da ordenação no campo especificado no atributo _field.
    */
    sort(_field, _dir){
        if(!_field) {
            _field = this.controller.storage.get('field'); 
            _dir = this.controller.storage.get('way');
        }
        if(!_dir){
            _dir = 'asc';
        }
        this.queryObject.sortField = (this.queryObject.sortField || '').concat(',').concat(_field);
        if(this.queryObject.sortField.substring(0, 1) == ',')
            this.queryObject.sortField = this.queryObject.sortField.substring(1, this.queryObject.sortField.length);
        this.queryObject.sortDir = (this.queryObject.sortDir || '').concat(',').concat(_dir);
        if(this.queryObject.sortDir.substring(0, 1) == ',')
            this.queryObject.sortDir = this.queryObject.sortDir.substring(1, this.queryObject.sortDir.length);
        
        return this;
    }

    /** 
     * @method gQuery Adiciona o metodo de pesquisa GQuery a sua chamada.
     * @param _gQuery Atributo responsável por filtrar os dados, a documentação do seu uso está em https://gumga.github.io/gumga-gquery-ng
    */
    gQuery(_gQuery){
        this.queryObject.gQuery = _gQuery;
        return this;
    }

    /**
     * @method send Metodo responsavel por realizar a chamada para a API.
     */
    send(){
        if(!this.service.sendQueryObject){
            console.error("Precisamos que você atualize a versão do componente gumga-rest-ng, acesse: https://github.com/GUMGA/gumga-rest-ng/releases");
        }
        return this.service.sendQueryObject(this.queryObject)
                 .then(
                     resp => {
                        this.controller.data = resp.data.values;
                        this.controller.pageSize = resp.data.pageSize;
                        this.controller.count = resp.data.count;
                        return resp;
                     }
                 );
    }

}