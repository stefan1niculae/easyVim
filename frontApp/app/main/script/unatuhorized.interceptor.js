angular.module('easyVimWeb')

  // This http interceptor listens for authentication failures
  .factory('httpResponseInterceptor', function ($injector) {

    var interceptor = {
      responseError: function (err) {
        switch (err.status) {
          case 401:
            $injector.get('$state').go("login", {retryLogin: false}, {reload: true});
            break;
          default:
            break;
        }
        throw err;
      }
    };

    return interceptor;

  });
