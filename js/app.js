'use strict';

/* App Module */

angular.module('wfk', ['wfkServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('', {templateUrl: 'partials/main.html', controller: MainCtrl}).
      otherwise({redirectTo: ''});
}]);

