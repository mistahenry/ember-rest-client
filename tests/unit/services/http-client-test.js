import { moduleFor, test } from 'ember-qunit';
var ajax = require('ic-ajax');

moduleFor('service:http-client', 'Unit | Service | http client', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
    let service = this.subject();
    assert.ok(service);
});

test('simple get', function(assert){
    let service = this.subject();
    ajax.defineFixture("/foo", {
        response: {name: 'foo'},
        jqXHR: {},
        textStatus: 'success'
    });
    service.get("/foo").then(function(it){
        assert.ok(it);
        assert.equal(it.name, 'foo');
    });
});
test('build GET options', function(assert){
    let service = this.subject();
    var opts = service.buildGetOpts("/test", {});
    assert.equal(opts.type, "GET");
});
test('build POST options', function(assert){
    let service = this.subject();
    var opts = service.buildPostOpts("/test", {});
    assert.equal(opts.type, "POST");
});
test('build PUT options', function(assert){
    let service = this.subject();
    var opts = service.buildPutOpts("/test", {});
    assert.equal(opts.type, "PUT");
});
test('build DELETE options', function(assert){
    let service = this.subject();
    var opts = service.buildDeleteOpts("/test", {});
    assert.equal(opts.type, "DELETE");
});
