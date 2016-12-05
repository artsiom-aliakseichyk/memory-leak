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
            <p>Take several heap snapshots</p>
            <p>Make sure that in current controller we haven't get any memory leaks</p>
          `,
          controller: 'homeController'
        }).
        when('/rootscopeML', {
          template: `
          <h1>Root scope Memory leak</h1>
          <p>Added event handler to rootScope</p>
          <p>Start using app (navigate to home and back). Take heap snapshot after every iteration</p>
          <p>Due to little size of event handler take a look on heap snapshots in comparison mode and notice delta (after every iteration (closure) attribute has increasing by 1)</p>
          `,
          controller: 'rootscopeMLController'
        }).
        when('/intervalML', {
          template: `
          <h1>Interval memory leak</h1>
          <p>Start using page (navigate through routes) or simply wait 2-5 seconds after each measure.</p>
          <p>Take heap snapshot and notice increase</p>
          `,
          controller: 'intervalMLController'
        }).
        when('/documentML', {
          template: `<h1>Document event listeners memory leak</h1>`,
          controller: 'documentMLController'
        }).
        otherwise('/home');
    }
  ])


  .controller('homeController', [ '$scope', '$rootScope', function($scope, $rootScope) {
    //home component
  }])

  .controller('rootscopeMLController', [ '$scope', '$rootScope', '$interval', function($scope, $rootScope, $interval) {

    var leakedArray = [];
    var rootScopeML = $rootScope.$on('someEvent', function() {
       leakedArray.push(new Array(new Array(1000)));
    });
    
    $scope.$on("$destroy", function() {
      // rootscopeML();
      console.log("Rootscope destroy!");
    });

    
  }])

  .controller('documentMLController', ['$scope', function($scope) {
    $document.on('click', handleDocumentClick);
    var handleDocumentClick = function() {
      var leakedArray = [];
      leakedArray.push(new Array(new Array(1000)));
    }

    element.on('$destroy', function(){
      // $document.off('click', handleDocumentClick);
      console.log("Document destroy!")
    });
  }])

  .controller('intervalMLController', ['$scope', '$rootScope', '$interval', function($scope, $rootScope, $interval) {
    var leakedArray = [];
    var interval = $interval(function () {
        leakedArray.push(new Array(10000));
        $rootScope.leak = leakedArray;
        console.log($rootScope.leak);
    }, 1000);

    $scope.$on('$destroy', function() {
      // $interval.cancel(intervalML);
      console.log("Timeout destroy!");   
    });

    $scope.stopLeak = function() {
      $interval.cancel(interval);
    }
  }]);