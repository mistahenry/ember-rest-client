import { moduleFor, test } from 'ember-qunit';

moduleFor('service:http-client', 'Unit | Service | http client', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
    let service = this.subject();
    assert.ok(service);
});

test('build GET options', function(assert){
    let service = this.subject();
    var opts = service.buildGetOpts("/test", {});
    assert.equal(opts.method, "get");
});
test('build POST options', function(assert){
    let service = this.subject();
    var opts = service.buildPostOpts("/test", {});
    assert.equal(opts.method, "post");
});
test('build PUT options', function(assert){
    let service = this.subject();
    var opts = service.buildPutOpts("/test", {});
    assert.equal(opts.method, "put");
});
test('build DELETE options', function(assert){
    let service = this.subject();
    var opts = service.buildDeleteOpts("/test", {});
    assert.equal(opts.method, "delete");
});

test('data gets mapped to body', function(assert){
    let service = this.subject();
    var opts = service.buildOpts({
        data: {
            foo: "foo"
        }
    });
    assert.equal(opts.body, JSON.stringify({ foo: "foo"}));
});