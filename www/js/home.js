var myApp = angular.module('homeModule', [])
.controller('HomeCtrl', ['$scope', '$http', 'config', 'CheckNetwork', function ($scope, $http, $config, $CheckNetwork) {
    $scope.ordercollections = [];
    $scope.ignoredOrders = [];
    $scope.checkingForOrders = true;

    $scope.refreshOrders = function () {
        $scope.checkingForOrders = true;
        $http.get($config.serverUrl + "/webservice/getNewOrdersList?storeId=1")  //FIXME : Store id should be dynamically fetched
          .success(function (data) {
              $scope.checkingForOrders = false;
              if (data.length != '0') {
                  $scope.ordercollections = data;
              }
              console.log('getNewOrdersList success:' + data);
          })
          .error(function (data) {
              $scope.checkingForOrders = false;
              $CheckNetwork.check();
          });
    };

    $scope.refreshOrders();

    $scope.IgnoreOrder = function (order) {
        console.log('IgnoreOrder called');
        var index = $scope.ordercollections.indexOf(order);
        $scope.ordercollections.splice(index, 1);
        $scope.ignoredOrders.push(order);
        console.log($scope.ordercollections.length);
    };

    
}])
