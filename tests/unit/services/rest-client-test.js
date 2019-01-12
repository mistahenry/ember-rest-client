import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import { Promise } from 'rsvp';
import Service from '@ember/service';
import sinon from 'sinon';
import { get } from '@ember/object'; 

let simpleFoo = function(fooVal, workFn){
    return function(options){
        if(options.url === '/foo'){
            return resolveWith({
                foo: fooVal
            });
        }else{
            var response = workFn(options);
            if(response){
                return response;
            }
        }
    };
};
let resolveWith = function(obj){
    return new Promise(function(resolve){
        resolve(obj);
    });
};
let rejectWith = function(error){
    return new Promise(function(resolve, reject){
        reject(error);
    });
};
let MockHttpClass = Service.extend({
    get: simpleFoo('get', function(options){
        if(options.url === '/error'){
            return rejectWith({error: 'error'});
        }
    }),
    post: simpleFoo('post'),
    put: simpleFoo('put'),
    delete: simpleFoo('delete')
});
let sandbox;
moduleFor('service:rest-client', 'Unit | Service | rest client', {
    // Specify the other units that are required for this test.
    beforeEach(){
        sandbox = sinon.sandbox.create();
        this.registry.register('service:http-client', MockHttpClass);
    },
    afterEach(){
        sandbox.restore();
    }
});

// Replace this with your real tests.
test('it exists', function(assert) {
    let service = this.subject();
    assert.ok(service);
});
let fooTest = function(msg, serviceFn){
    test(msg+". All userHooks called (success path)", function(assert){
        let service = this.subject();
        sandbox.spy(service, 'beforeRequest');
        sandbox.spy(service, 'afterRequest');
        sandbox.spy(service, 'requestPermitted');
        sandbox.spy(service, 'customHttpOptions');
        sandbox.spy(service, 'customSuccess');

        return service[serviceFn].call(service,{
            url: "/foo"
        }).then(function(response){
            assert.ok(response);
            assert.equal(response.foo, serviceFn);
            assert.ok(service.beforeRequest.calledOnce);
            assert.ok(service.afterRequest.calledOnce);
            assert.ok(service.requestPermitted.calledOnce);
            assert.ok(service.customHttpOptions.calledOnce);
            assert.ok(service.customSuccess.calledOnce);
        });
    });

};

fooTest('get calls http-clients get method', 'get');
fooTest('post calls http-clients post method', 'post');
fooTest('put calls http-clients put method', 'put');
fooTest('delete calls http-clients delete method', 'delete');

test('beforeRequest and afterRequest called in proper order', function(assert){
    let service = this.subject();
    sandbox.spy(service, 'beforeRequest');
    sandbox.spy(service, 'afterRequest');

    let httpClient = get(service, 'httpClient');
    sandbox.spy(httpClient, 'get');
    service.get({ url: '/foo'});
    sinon.assert.callOrder(service.beforeRequest, httpClient.get, service.afterRequest);
    assert.expect(0);
});

test('if !requestPermitted then request isnt made and rejectRequest is called', function(assert){
    let service = this.subject();
    sandbox.spy(service, 'rejectRequest');
    sandbox.spy(service, '_buildAndMakeRequest');
    sandbox.stub(service, 'requestPermitted').returns(false);    
    var prom = service.get({ url: '/foo'}).then(function(){}, function(error){
        assert.ok(error);
    });
    assert.notOk(service._buildAndMakeRequest.called);
    assert.ok(service.rejectRequest.called);
    return prom;
});

test('error path', function(assert){
    let service = this.subject();
    sandbox.spy(service, 'customError');
    return service.get({url: '/error'}).then(Ember.K, function(error){
        assert.ok(error);
        assert.equal(error.error, 'error');
        assert.ok(service.customError.calledOnce);
    });
});
