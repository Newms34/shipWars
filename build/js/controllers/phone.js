app.controller('phone-con',($scope,contFact)=> {
    $scope.phoneName = Math.floor(Math.random() * 999999999).toString(32).toUpperCase();
    $scope.user = false;
    $scope.role = false;
    $scope.initZero = false; //has the zero point been set?
    //alpha = z, beta = x, gamma = y
    $scope.zero = {
        x: null,
        y: null,
        z: null
    };
    $scope.currOri = {

    };
    socket.emit('newPhone', $scope.phoneName);
    socket.on('regPhone', function(phone) {
        if ($scope.phoneName == phone.name) {
            $scope.user = phone.u;
            $scope.role = phone.role;
            $scope.$apply();
        }
    });
    $scope.showInf = function(n) {
        if (!n) {
            bootbox.alert('Enter this automatically-generated phone code for the cyclic, collective, or joystick on the desktop site.');
        } else if (n == 1) {
            bootbox.alert('The game code corresponds to the particular "instance" of the desktop site your phone is connected with.');
        } else {
            bootbox.alert('If set to collective, your phone controls average blade angle. If set to cyclic, your phone controls, generally speaking, the direction of the craft. Finally, if set to joystick, the phone acts as an airplane joystick (plane mode only).');
        }
    };
    $scope.setZero = function() {
        $scope.zero = angular.copy($scope.currOri);
    };
    window.addEventListener('deviceorientation', function(o) {
        $scope.currOri.x = o.beta;
        $scope.currOri.y = o.gamma;
        $scope.currOri.z = o.alpha;
        if (!$scope.initZero) {
            //have not yet set initial pos
            $scope.initZero = true;
            $scope.setZero();
        }
        contFact.handleOri($scope.zero,$scope.currOri,$scope.user,$scope.role);
    });
    $scope.reZero = function(){
        bootbox.confirm('Are you sure you want to re-zero?',function(resp){
            if(resp){
                $scope.setZero();
            }
        });
    };
});
