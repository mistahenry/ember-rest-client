import Service from '@ember/service';
import ajax from 'ember-fetch/ajax';
import { assign } from '@ember/polyfills';

export default Service.extend({
    get: function (options) {
        return this.rsvpAjax(this.buildGetOpts(options));
    },
    buildGetOpts: function (options) {
        return this.buildOpts(options, "get");
    },
    delete: function (options) {
        return this.rsvpAjax(this.buildDeleteOpts(options));
    },
    buildDeleteOpts: function (options) {
        return this.buildOpts(options, "delete");
    },
    post: function (options) {
        return this.rsvpAjax(this.buildPostOpts(options));
    },
    buildPostOpts: function (options) {
        return this.buildOpts(options, "post");
    },
    put: function (options) {
        return this.rsvpAjax(this.buildPutOpts(options));
    },
    buildPutOpts: function (options) {
        return this.buildOpts(options, "put");
    },
    rsvpAjax: function (options) {
        return ajax(options.url, options);
    },
    buildOpts: function (options, method) {
        if (!options) {
            options = {};
        }
        var defaultOpts = this.getDefaultOpts();
        var opts = assign({}, defaultOpts, options, {method: method, body: JSON.stringify(options.data)});
        return opts;
    },
    getDefaultOpts: function () {
        return {};
    }
});

