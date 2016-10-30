iweb.controller('i082', function ($scope,$filter) {
    $scope.optData1 = [];
    $scope.optData2 = [];

    for(var x=0; x<24; x++){
        $scope.optData1.push(x);
    }
    for(var y=0; y<59; y++){
        $scope.optData2.push(y);
    }

    $scope.save11 = function () {
        //$(".alert1").modal("show");
        $(".alert2").modal("show");
    }
});
