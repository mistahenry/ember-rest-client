# Ember-rest-client

The purpose of this Ember Addon is to provide an easy way to communicate with a server over HTTP without using Ember Data. The addon comes with two services. The first is `http-client`, which serves as a more intuitive wrapper around `fetch`. This service simply makes http calls and has hooks for building headers.

The second service, `rest-client`, is a customizable wrapper around `http-client` to make communicating with your rest-api far easier. A number of configuration options are available and will be detailed below.

Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-rest-client
```


Usage
------------------------------------------------------------------------------

- In general, `rest-client` follows a three step process:

1. Choose the HTTP verb
2. Build the URL
3. Map the response to a js `model` object

In the following example, I show a service for a `e-commerce` tool that allows for returns. 

```
import Service from '@ember/service';
import { inject } from '@ember/service';
import Return from 'my-project/models/return';

export default class RetailerServiceService extends Service {
  @inject
  restClient;

  findReturnById(returnId){
    return this.restClient.get({
      url: `/api/returns/${returnId}`
    }).then((response) => {
      return new Return(response.data);
    });
  }
  
  createRefund(returnId, refundModel){
    return this.restClient.post({
      url: `/api/returns/${returnId}/refunds`,
      data: refundModel
    }).then((response) => {
      return new Return(response.data);
    });
  }
}
```

The above service uses `this.restClient.get` to send a `HTTP GET` to the specified URL to pull up the details about a single return. The `createRefund` function uses `this.restClient.post` to send an `HTTP POST` to the specified URL with the `data` as the post body. In both cases, my model object is a simple `ES6` class that extends nothing.

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
