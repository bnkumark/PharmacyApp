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

    $scope.UpdateStatus = function (deliveryType, order)
    {
        var storeId = 1;
        var orderItems = "{";
        var seperator = "";
        for (i = 0; i < order.orderItemInfo.length; i++) {
            console.log('order:' + order)
            console.log('order.orderItemInfo:' + order.orderItemInfo)
            console.log('order.orderItemInfo[i]:' + order.orderItemInfo[i])
            var availabilityIndex=-1;
            if (order.orderItemInfo[i].availabilityIndex == true)
            {
                availabilityIndex = 1;
            }
            if (i < order.orderItemInfo.length)
            {
                seperator = ",";
        }
            orderItems = orderItems + "\"" + order.orderItemInfo[i].brandId + "\":" + availabilityIndex + seperator;
            
        }
        orderItems = orderItems + "}";
        console.log('orderItems: '+orderItems)

        $http.get($config.serverUrl + "webservice/updateAvailabilityFromNonPartners?storeId=" + storeId + "&orderItems=" + orderItems + "&deliveryType=" + deliveryType + "&collId=" + order.collectionId)  //FIXME : Store id should be dynamically fetched
         .success(function (data) {
             $scope.IgnoreOrder(order);
             console.log('updateAvailabilityFromNonPartners success:' + data);
         })
         .error(function (data) {
             $scope.checkingForOrders = false;
             $CheckNetwork.check();
         });
    }
}])
