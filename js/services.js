'use strict';

/* Services */

angular.module('wfkServices', ['ngResource'])
  .factory('Wfk', function($resource) {
    return $resource('gen/:service.php', {}, {
      query: {method:'GET', params:{'service': 'main'}}
    });
  })

