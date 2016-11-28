'use strict';

// Define the `phonecatApp` module
angular.module('app', [
  'ngRoute'
])

  .config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/home', {
          template: `
            <h1>Home</h1>
            <a href="" ng-click="memoryLeak()">Initiate event and subscribe to rootscope</a>
          `,
          controller: 'homeController'
        }).
        when('/about', {
          template: '<h1>ABOUT</h1>',
          controller: 'aboutController'
        }).
        otherwise('/home');
    }
  ])


  .controller('homeController', [ '$scope', '$rootScope', function($scope, $rootScope) {

    


    $scope.$on("$destroy", function() {
      console.log("Home destroy!");
      
    });

  }])

  .controller('aboutController', [ '$scope', '$rootScope', function($scope, $rootScope) {

    // $rootScope.$on("leakedEvent", function leakedFunction() {
    //   var leadedArray = new Array(1000000000000);
    //   var leakedElement = document.createElement("video");
    //   console.log("rootScope click");
    // })

    document.addEventListener("click", listener, false);
    $scope.$on("$destroy", function() {
      // document.removeEventListener("click", listener, false)
      // console.log("ABOUT destroy!")
    });
  }]);

  function listener() {
    var leakedArray = [];
    for(var i=0;i<1000000;i++){
      leakedArray[i]="some big data to write in memory";
    }
    var leakedElement = document.createElement("video");
    console.log("document listener");
  }