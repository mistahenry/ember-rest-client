# Ember-rest-client

The purpose of this Ember Addon is to provide an easy way to communicate with a server over HTTP without using Ember Data. The addon comes with two services. The first is `http-client`, which serves as a more intuitive wrapper around [ij-ajax](https://github.com/instructure/ic-ajax). This service simply makes http calls and has hooks for building headers.

The second service, `rest-client`, is a customizable wrapper around `http-client` to make communicating with your rest-api far easier. A number of configuration options are available and will be detailed below.

##TODO: explain configuration options

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
