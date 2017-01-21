import Ember from 'ember';
var ajax = require('ic-ajax');

export default Ember.Service.extend({
	/**
	 * I wanted our GET method to be `get` which means we have lost
	 * access to the Ember.Object `get` method. So if you need to get a property with a
	 * getter, use Ember.get(this, 'propName')
	 */
	get: function(url, options){
		return this.rsvpAjax(this.buildGetOpts(url, options));
	},
    buildGetOpts: function(url, options){
       return this.buildOpts(url, "GET", undefined, options);
    },
	delete: function(url, options){
		return this.rsvpAjax(this.buildDeleteOpts(url, options));
	},
    buildDeleteOpts: function(url, options){
       return this.buildOpts(url, "DELETE", undefined, options);
    },
	post: function(url, data, options) {
		return this.rsvpAjax(this.buildPostOpts(url, data, options));
	},
    buildPostOpts: function(url, data, options){
       return this.buildOpts(url, "POST", data, options);
    },
	put: function(url, data, options){
		return this.rsvpAjax(this.buildPutOpts(url, data, options));
	},
    buildPutOpts: function(url, data, options){
       return this.buildOpts(url, "PUT", data, options);
    },
	//config: injectConfig('http-client'),
	rsvpAjax: function(options){
		return ajax.request(options.url, options);
	},
	/**
	 * options is the same as what $.ajax takes
	 */
	buildOpts: function(url, method, data, options) {
		// build request
		//var defaultOpts = Ember.get(this,'config').get('defaultOptions');
		//var opts = $.extend({}, defaultOpts, options, {type: method, data: JSON.stringify(data)});
		var opts = $.extend({}, options, {type: method, data: JSON.stringify(data)});
        opts.url = url;
		return opts;
	}
});

