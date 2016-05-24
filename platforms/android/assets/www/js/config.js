angular.module('ebApp.config', [])
  .factory('Config', function () {
    var hasItem = function(line, item) {
      return line.indexOf(item) > -1;
    }
    
    var bodyClass = document.body.className;
    var baseUrl = 'http://localhost:3000/';

    if(hasItem(bodyClass, 'api-prd')) {
      baseUrl = 'http://192.168.159.202:3000/';
    }
    else if(hasItem(bodyClass, 'api-test')){
      baseUrl = 'http://192.168.159.202:7000/';
    }

    return {
      baseUrl: baseUrl
    };
  });
