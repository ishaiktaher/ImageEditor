var app = angular.module('imageEditor',['ngRoute','ui.bootstrap','homeModule'])
app.config(function($routeProvider){
      $routeProvider
    .when('/home', {
      controller:'homeCtrl',
      templateUrl:'./views/Home.html',
    }).otherwise({
      redirectTo:'/home'
    });
});