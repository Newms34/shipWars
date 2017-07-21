const socket = io();

//ship width: document.querySelector('body > div > div.ship-container').scrollWidth+20. Same idea for height
const app = angular.module('ships', []).controller('shipCon', ($scope) => {
    class ShipBit {
        constructor(type, inpX, inpY, side, deets) {
            this.type = type || 'structural';
            this.px = inpX;
            this.py = inpY;
            this.x = side == 'l' ? inpX - 1 : side == 'r' ? inpX + 1 : inpX;
            this.y = side == 't' ? inpY - 1 : side == 'b' ? inpY + 1 : inpY;
            this.deets = deets || {};
        }
    }
    $scope.pos = {
        x: 90,
        y: 90
    }
    $scope.specialLeft = 5;
    $scope.removeLast = function() {
        if ($scope.parts.length<2) {
            return false;
        }
        var removedPart = $scope.parts.pop();
        if (removedPart.type != 'structural') {
            $scope.specialLeft++;
        }
        $scope.partsLocs.pop();
    }
    $scope.checkPartObst = (px, py) => {
        if ($scope.partsLocs.indexOf(px + ':' + py) > -1) {
            return true;
        }
        return false;
    }
    $scope.parts = [];
    $scope.partsLocs = ['0:0']
    $scope.parts.push(new ShipBit('structural', 0, 0, null));
    $scope.makeNewPart = (p, s, e) => {
        e.preventDefault();
        console.log('E', e.altKey, e.ctrlKey)
        if ($scope.building) {
            //doing this to prevent the user from somehow spamming and building two parts on the same location
            return false;
        }
        /*part types:
        structural: basic part. does nothing
        engine: provides thrust
        cannon: provides pewpew
        shield: provides defense vs pewpew
        */
        var deet = {
                p: 0,
                r: 0
            },
            partType = 'structural';
        if (!e.altKey && !e.ctrlKey) {
            partType = 'structural';
        } else if (!e.altKey) {
            partType = 'engine';
            deet.p = 30;
            deet.r = 0;
        } else if (!e.ctrlKey) {
            partType = 'gun';
            deet.p = 30;
            deet.r = 0;
        } else {
            partType = 'shield';
            deet.p = 30;
            deet.r = 0;
        }
        if (partType != 'structural') {
            $scope.specialLeft--;
        }
        if ($scope.specialLeft < 0) {
            bootbox.alert({ title: 'Invalid Part', message: 'You have no more special parts left!' })
            $scope.specialLeft = 0;
        } else {

            //check to see if part's already here.
            var newPart = new ShipBit(partType, p.x, p.y, s, deet)
            if ($scope.checkPartObst(newPart.x, newPart.y)) {
                console.log('part already here!', newPart)
                return false;
            }
            $scope.parts.push(newPart);
            $scope.partsLocs.push(newPart.x + ':' + newPart.y)
            $scope.building = true;
            $scope.buildTimer = setTimeout(() => {
                $scope.building = false;
            }, 500)
        }
    }
    $scope.checkEdge = (p, s) => {
        if (s == 'l' && $scope.partsLocs.indexOf((p.x - 1) + ':' + p.y) > -1) {
            return false;
        } else if (s == 'r' && $scope.partsLocs.indexOf((p.x + 1) + ':' + p.y) > -1) {
            return false;
        } else if (s == 't' && $scope.partsLocs.indexOf(p.x + ':' + (p.y - 1)) > -1) {
            return false;
        } else if (s == 'b' && $scope.partsLocs.indexOf(p.x + ':' + (p.y + 1)) > -1) {
            return false;
        }
        return true;
    }
    $scope.getCgStyle = () => {
        var splitParts = $scope.partsLocs.map((p) => {
            return p.split(':').map((pp) => {
                return parseInt(pp)
            });
        });
        var xt = 0,
            yt = 0;
        splitParts.forEach((sp) => {
            xt += sp[0];
            yt += sp[1];
        });
        var xa = 20 * (xt / splitParts.length),
            ya = 20 * (yt / splitParts.length);
        return {
            x: xa + 10,
            y: ya + 10
        };
    }
    $scope.getScales = () => {
        //y = −0.01x + 1.5 Maybe??
        var maxDim = Math.max(document.querySelector('body > div > div.ship-container').scrollHeight, document.querySelector('body > div > div.ship-container').scrollWidth);
        var scaleAmt = (-0.01 * maxDim) + 1.5;
        return scaleAmt + ',' + scaleAmt;
    }
    $scope.shipRot = 0;
    window.onkeydown = function(e) {
        if (e.which == 65) {
            $scope.shipRot-=3;
        } else if (e.which == 68) {
            $scope.shipRot+=3;
        }
        $scope.$digest();
    }
})

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

// app.factory('contFact', function($rootScope) {
//     return {
//         handleOri: function(z, c, u, r) {
//             var diffx = Math.min(Math.max(z.x - c.x, -70), 70),
//                 diffy = Math.min(Math.max(z.y - c.y, -70), 70),
//                 diffz = Math.min(Math.max(z.z - c.z, -70), 70);
//             socket.emit('phoneOri', {
//                 x: diffx,
//                 y: diffy,
//                 z: diffz,
//                 u: u,
//                 r: r
//             });
//         },
//         cylMaker: function(rez, h, w, p, t, o, e, c) {
//             //height, width, parent(selector), translation, rotation (orientation), capped(boolean)
//             var cylCon = document.createElement('div');
//             cylCon.className = 'cyl-con';
//             document.querySelector(p).appendChild(cylCon);
//             //cylinder-specific vars
//             var rotAmt = 360 / rez;
//             var segw = (Math.PI * w * rotAmt / 360) + 1;
//             for (var i = 0; i < rez; i++) {
//                 var newSeg = document.createElement('div');
//                 newSeg.className = 'cyl-seg';
//                 if (c) {
//                     newSeg.style.background = 'hsl(' + c.h + ',' + c.s + '%,' + ((c.v - 15) + (30 * Math.abs(i - (rez / 2)) / (rez / 2))) + '%)';
//                 } else {
//                     newSeg.style.background = 'hsl(0,0%,' + (40 + (30 * Math.abs(i - (rez / 2)) / (rez / 2))) + '%)';
//                 }
//                 newSeg.style.width = segw + 'px';
//                 newSeg.style.height = h + 'px';
//                 newSeg.style.transform = 'rotateY(' + (rotAmt * i) + 'deg) translateZ(' + (w / 2) + 'px) translateY(' + (h / 2) + 'px)';
//                 cylCon.appendChild(newSeg);
//                 if (e === true) {
//                     var newTop = document.createElement('div');
//                     newTop.className = 'cyl-cap';
//                     if (c) {
//                         newTop.style.borderTop = (w / 2) + 'px solid hsl(' + c.h + ',' + c.s + '%,' + ((c.v - 15) + (30 * Math.abs(i - (rez / 2)) / (rez / 2))) + '%)';
//                     } else {
//                         newTop.style.borderTop = (w / 2) + 'px solid hsl(0,0%,' + (30 + (30 * Math.abs(i - (rez / 2)) / (rez / 2))) + '%)';
//                     }
//                     newTop.style.borderLeft = (segw / 2) + 'px solid transparent';
//                     newTop.style.borderRight = (segw / 2) + 'px solid transparent';
//                     newTop.style.transform = 'rotateX(-90deg)';
//                     $(newSeg).append(newTop);
//                     var newBottom = document.createElement('div');
//                     newBottom.className = 'cyl-cap';
//                     if (c) {
//                     newBottom.style.borderTop = (w / 2) + 'px solid hsl(' + c.h + ',' + c.s + '%,' + ((c.v - 15) + (30 * Math.abs(i - (rez / 2)) / (rez / 2))) + '%)';
//                 } else {
//                     newBottom.style.borderTop = (w / 2) + 'px solid hsl(0,0%,' + (30 + (30 * Math.abs(i - (rez / 2)) / (rez / 2))) + '%)';
//                 }
//                     newBottom.style.borderLeft = (segw / 2) + 'px solid transparent';
//                     newBottom.style.borderRight = (segw / 2) + 'px solid transparent';
//                     newBottom.style.transform = 'rotateX(-90deg) translateZ(' + h + 'px)';
//                     $(newSeg).append(newBottom);
//                 }
//             }
//             //as a last step, we move the parent. Note that rotation happens AFTER translation.
//             $(cylCon).css({ 'transform': 'translateX(' + t.x + 'px) translateY(' + t.y + 'px) translateZ(' + t.z + 'px) rotateX(' + o.x + 'deg) rotateY(' + o.y + 'deg) rotateZ(' + o.z + 'deg)' });
//         }
//     };
// });

// app.factory('socket', function ($rootScope) {
//   console.log('socket factory!');
//   var socket = io.connect();
//   console.log('socket factory!');
//   return {
//     on: function (eventName, callback) {
//       socket.on(eventName, function () { 
//         var args = arguments;
//         $rootScope.$apply(function () {
//           callback.apply(socket, args);
//         });
//       });
//     },
//     emit: function (eventName, data, callback) {
//       socket.emit(eventName, data, function () {
//         var args = arguments;
//         $rootScope.$apply(function () {
//           if (callback) {
//             callback.apply(socket, args);
//           }
//         });
//       });
//     }
//   };
// });