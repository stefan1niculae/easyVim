angular.module('easyVimWeb')

  // This http interceptor listens for authentication failures
  .factory('httpResponseInterceptor', function ($injector) {

    var interceptor = {
      response: function (originalResponse) {
        //switch (originalResponse.status) {
        //  case 401:
        //    $injector.get('$state').go("login", {retryLogin: false}), {reload: true};
        //    break;
        //  case 403:
        //    $injector.get('$state').go("notAuthorized");
        //    break;
        //  default:
        //    break;
        //}
        return originalResponse;
      }
    };

    return interceptor;

  });
