var clientId = '7922620d6450cee7ec3ac595b593344e93f06f37f10aa351c4fd7347a3796e78';
var secretToken = '06781c93d79a98b1eaea19753be8a12d4aff4740c78bcfa7fbcd45c190d76ec1';

var requestToken = '';
var accessToken = '';

angular.module('controllers', [])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'AutheticateController'
      })
      .state('secure', {
        url: '/secure',
        templateUrl: 'templates/secure.html',
        controller: 'SecureController'
      });
    $urlRouterProvider.otherwise('/login');
  })

  .controller('AutheticateController', function ($scope, $http, $location, $cordovaOauth) {
    $scope.login = function() {
      console.debug("aqui");
      var ref = window.open('http://localhost:3000/oauth/authorize?client_id=' + clientId +
        '&redirect_uri=http://localhost:8100/callback&response_type=code', '_blank', 'location=no');

      ref.addEventListener('loadstart', function (event) {
        console.debug("aqui");
        requestToken = (event.url).split('code=')[1];
        if((event.url).startsWith('http://localhost/callback')) {
          $http(
            {
              method: 'post',
              url:    'http://localhost:3000/oauth/token',
              data:   'client_id' + clientId + '&client_secret=' + secretToken + 'redirect_uri=http://localhost/callback' +
              'grant_type=authorization_code' + 'code=' + requestToken
            }
          )
            .sucess(function (data) {
              accessToken = data.access_token;
              console.debug(data);
              $location.path('/secure');
            })
            .error(function (data, status) {
              alert('ERROR: ' + data);
            });
            ref.close();
        }
      });
    }

    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
      };
    }
  })

  .controller('SecureController', function($scope, $http) {
    $scope.accessToken = accessToken;
  });



