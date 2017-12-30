import Ember from 'ember';
var ajax = require('ic-ajax');

export default Ember.Service.extend({
    get: function (options) {
        return this.rsvpAjax(this.buildGetOpts(options));
    },
    buildGetOpts: function (options) {
        return this.buildOpts(options, "GET");
    },
    delete: function (options) {
        return this.rsvpAjax(this.buildDeleteOpts(options));
    },
    buildDeleteOpts: function (options) {
        return this.buildOpts(options, "DELETE");
    },
    post: function (options) {
        return this.rsvpAjax(this.buildPostOpts(options));
    },
    buildPostOpts: function (options) {
        return this.buildOpts(options, "POST");
    },
    put: function (options) {
        return this.rsvpAjax(this.buildPutOpts(options));
    },
    buildPutOpts: function (options) {
        return this.buildOpts(options, "PUT");
    },
    rsvpAjax: function (options) {
        console.log("rsvpAjax", options);
        return ajax.request(options.url, options);
    },
    buildOpts: function (options, method) {
        if (!options) {
            options = {};
        }
        var defaultOpts = this.getDefaultOpts();
        var opts = $.extend({}, defaultOpts, options, {type: method, data: JSON.stringify(options.data)});
        return opts;
    },
    getDefaultOpts: function () {
        return {};
    }
});

