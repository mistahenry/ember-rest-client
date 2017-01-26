import Ember from 'ember';
export default Ember.Service.extend({
    httpClient: Ember.inject.service(),
	/**
	 * I wanted our GET method to be `get` which means we have lost
	 * access to the Ember.Object `get` method. So if you need to get a property with a
	 * getter, use Ember.get(this, 'propName')
	 */
    get: function(options){
        return this._makeHttpRequest("get", options);
    },
    delete: function(options){
		return this._makeHttpRequest("delete", options);
    },
    post: function(options) {
        return this._makeHttpRequest("post", options);
    },
    put: function( options){
        return this._makeHttpRequest("put", options);
    },
    _makeHttpRequest: function(method, options){
		var self = this;
        options.method = method;
		if(this.requestPermitted(options)){
			return this._buildAndMakeRequest(method, options);
		}else{
		    return this.rejectRequest(options);		
		}
    },
    /**
     * Hook to prevent requests based on app specific logic
    */
    requestPermitted: function(options){
        return true;
    },
    /**
     * If requestPermitted returns false, resulting behavior. Should return a
     * promise. Base impl retruns immediately rejecting promise
    */
    rejectRequest: function(options){
        return new Ember.RSVP.Promise(function(resolve,reject){
            reject(new Error(options.url+": rejected by rest-client"));
        });
    },
	_buildAndMakeRequest: function(method,options){
        this.beforeRequest(options);
		var defaultedOpts = this._buildOpts(options);
        var httpClient = Ember.get(this, 'httpClient');
		var promise = httpClient[method].call(httpClient, defaultedOpts);
        this.afterRequest(options);
		var fns = this._getPromiseFunctions(this, promise, options);
		this.storePromiseData(promise, options);
		return promise.then(fns.success,fns.error);
	},
    /**
     * App specific hook before making a request, unrelated to building the options
     * for the request (better handled by customHttpOptions)
     */
    beforeRequest: function(options){
        return;
    },
    /**
     * App specific hook after the request is made (not the callback of the request)
     */
    afterRequest: function(options){
        return;
    },
	/**
	 * Had to manually provide promise's `then` function both the promise and the rest
	 * client class due to the way promises are scoped (for some reason `this` is undefined in promise `then` fn)
	 */
	_success: function(restClientClass, promise, options){
		return function(response){
            response = restClientClass.customSuccess(response, options);
			return response;
		};
	},
    /**
     * App specific success callback. Should return response
     */
    customSuccess: function(response, options){
        return response;
    },
	_error: function(restClientClass, promise, options){
		var self = this;
		return function(error){
            error = restClientClass.customError(error, options);
            restClientClass._rethrowError(error, options);
		};
	},
    /**
     * App specific custom error handling. Should return error or _rethrowError
     */
    customError: function(error, options){
        return error;
    },
    _rethrowError(error, options){
        $.extend(error, {
            url: options.url,
            method: options.method.toUpperCase()
        });
        throw error;
    },
	_getPromiseFunctions: function(restClientClass, promise, options){
		return {
			success: this._success(restClientClass, promise, options),
			error: this._error(restClientClass, promise, options)
		};
	},
    headers: {
         "Content-Type": "application/json"
    },
    defaultOpts: {
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			}
    },
    _getDefaultHttpOpts: function(){
        var headers = Ember.get(this, 'headers'); 
		var defaultOpts = this.defaultOpts;
        defaultOpts.headers = headers;
        return defaultOpts;
    },
    customHttpOptions: function(httpOptions, options){
        return httpOptions;
    },
	_buildOpts: function(options){
        var defaultOpts = this._getDefaultHttpOpts();
		return this.customHttpOptions($.extend({}, defaultOpts, {
            data: options.data,
            url: options.url,
            type: options.method
        }));
        
	},
	storePromiseData: function(promise, nonce, isBlocking){
        console.log(promise);
		var promises = this.unresolvedPromises;
		promises.push({id: promise._id, nonce: nonce, isBlocking: isBlocking});
	},
	unresolvedPromises: null,
	blocking: false,
	initialize: Ember.on('init', function(){
		this.set('unresolvedPromises', []);
	})
});
