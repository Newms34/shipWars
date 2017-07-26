const socket = io();

//ship width: document.querySelector('body > div > div.ship-container').scrollWidth+20. Same idea for height
const app = angular.module('ships', []).controller('shipCon', ($scope) => {
    $scope.id = Math.floor(Math.random() * 9999999999999999).toString(32);
    class ShipBit {
        constructor(type, inpX, inpY, side, deets) {
            this.type = type || 'structural';
            this.px = inpX;
            this.py = inpY;
            this.x = side == 'l' ? inpX - 1 : side == 'r' ? inpX + 1 : inpX;
            this.y = side == 't' ? inpY - 1 : side == 'b' ? inpY + 1 : inpY;
            this.deets = deets || {};
            this.hp = 100;
        }
    }
    $scope.pos = {
        x: 90,
        y: 90
    }
    $scope.noBubble = (e) => {
        e.stopPropagation();
    }
    $scope.removeKey = function(n) {
        $scope.currKeys.slice(n, 1)
    }
    $scope.pickStats = (p, n) => {
        if (p.type == 'gun') {
            //gun stuff!
            //we COULD use bootbox here, we'd need to write a custom dialog anyway
            $scope.currKeys = p.keys || []; //array of current keys.
            $scope.deetPart = n;
            $scope.$digest();
        } else if (p.type == 'engine') {
            //engine stuff
            $scope.currKeys = p.keys || []; //array of current keys.
            $scope.deetPart = n;
            $scope.$digest();
        } else {
            //no stuff, as this is not a customizable part
        }
    }
    $scope.parseNewKey = (e) => {
        console.log(e)
        var whichKey = e.key.toUpperCase();
        if (whichKey.length == 1 && whichKey.charCodeAt(0) > 64 && whichKey.charCodeAt(0) < 91) {
            $scope.newKey = whichKey
        } else if (whichKey = 'ENTER') {
            console.log('ENTER PRESSED!')
            $scope.currKeys.push($scope.newKey);
            $scope.newKey = '';
        }
    }
    $scope.deetPart = -1;
    $scope.specialLeft = 5;
    $scope.totalLeft = 10;
    $scope.removeLast = function() {
        if ($scope.parts.length < 2) {
            return false;
        }
        var removedPart = $scope.parts.pop();
        if (removedPart.type != 'structural') {
            $scope.specialLeft++;
        }
        $scope.totalLeft++;
        $scope.partsLocs.pop();
    }
    $scope.checkPartObst = (px, py) => {
        if ($scope.partsLocs.indexOf(px + ':' + py) > -1) {
            return true;
        }
        return false;
    }
    $scope.parts = [];
    $scope.buildMode = true;
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
                r: 0,
                keys: []
            },
            partType = 'structural';
        if (!e.altKey && !e.ctrlKey) {
            partType = 'structural';
        } else if (!e.altKey) {
            partType = 'engine';
            deet.p = 5;
            deet.r = 0;
            deet.keys = [];
        } else if (!e.ctrlKey) {
            partType = 'gun';
            deet.p = 30;
            deet.r = 0;
            deet.keys = [];
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
            $scope.totalLeft--;
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
        if (!$scope.totalLeft) {
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
        var xa = (xt / splitParts.length),
            ya = (yt / splitParts.length);
        return {
            x: xa,
            y: ya
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
        if ($scope.buildMode) {
            if (e.which == 65) {
                $scope.shipRot -= 3;
            } else if (e.which == 68) {
                $scope.shipRot += 3;
            } else if (e.which == 27) {
                $scope.removeLast();
            }
        } else {
            $scope.getAccels(e);
        }
        $scope.$digest();
    }
    $scope.getMass = (parts) => {
        var numStr = parts.filter((ps) => {
                return ps.type == 'structural'
            }).length,
            numEng = parts.filter((pe) => {
                return pe.type == 'engine'
            }).length,
            numGun = parts.filter((pg) => {
                return pg.type == 'gun'
            }).length,
            numShi = parts.filter((pp) => {
                return pp.type == 'shield'
            }).length;

        return (numStr * 1) + (numEng * 1.9) + (numShi * 1.2) + (numGun * 1.5);

    }
    $scope.play = () => {
        var noKeyWarn = '';
        for (var i = 0; i < $scope.parts.length; i++) {
            if (($scope.parts[i].type == 'engine' || $scope.parts[i].type == 'gun') && (!$scope.parts[i].keys || !$scope.parts[i].keys.length)) {
                noKeyWarn = '<br>Warning: One or more of your activateable parts (engine or gun) has no keys mapped to it.';
            }
        }
        bootbox.confirm('Are you sure you want to use this design to play?' + noKeyWarn, (r) => {
            if (r && r != null) {
                $scope.buildMode = false;
                $scope.ship = {
                    parts: angular.copy($scope.parts),
                    score: 0,
                    extra: 0,
                    x: Math.floor(Math.random() * 500),
                    y: Math.floor(Math.random() * 500),
                    r: Math.floor(Math.random() * 360),
                    vx: 0,
                    vy: 0,
                    vr: 0,
                    mass: $scope.getMass($scope.parts),
                    id: $scope.id
                };
                console.log('SHIP:', $scope.ship)
                socket.emit('newPlayer', $scope.ship);
                $scope.$digest();
            } else {
                //do nothin?
            }
        })
    };
    var scWd = $(window).width(),
        scHt = $(window).height();
    $scope.playDisp = function() {
        if (!$scope.ship) {
            return { x: 0, y: 0 }
        }
        return {
            x: 0 - ($scope.ship.x - (scWd / 2)),
            y: 0 - ($scope.ship.y - (scHt / 2))
        }
    }
    $scope.constExplain = () => {
        bootbox.alert({
            title: 'Ship-Building Controls',
            message: `To build your ship, use the following controls:<ul><li>To place a structural part, click an exposed edge.</li><li>To place an engine, hold CTRL and click an exposed edge.</li><li>To place an gun, hold ALT and click an exposed edge.</li><li>To place an shield, hold CTRL+ALT and click an exposed edge.</li><li>To remove the last part, click the undo button or press ESC.</li><li>Press A or D to rotate your ship in or out.</li><li>Click PLAY when you're happy with your design!</li></ul>`
        });
    }
    $scope.getAccels = (key) => {
        if (key.key.toUpperCase().length != 1 || key.key.toUpperCase().charCodeAt(0) < 65 || key.key.toUpperCase().charCodeAt(0) > 90) {
            //invalid key
            return false;
        }
        var cm = $scope.getCgStyle();
        var hThrust = 0,
            fThrust = 0;
        for (var i = 0; i < $scope.parts.length; i++) {
            if ($scope.parts[i].type == 'engine' && $scope.parts[i].keys.indexOf(key.key.toUpperCase()) > -1) {
                var xDiff = $scope.parts[i].x - cm.x,
                    yDiff = $scope.parts[i].y - cm.y,
                    theta = Math.atan(yDiff / xDiff);
                fThrust += $scope.parts[i].deets.p * Math.sin(theta);
                hThrust += $scope.parts[i].deets.p * Math.cos(theta);
                console.log('engine', i, 'xDiff', xDiff, 'yDiff', yDiff)
            }
        }
        console.log('THRUSTS:', fThrust, hThrust)
        $scope.ship.vr -= hThrust;
        //y:cos(theta), x:sin(theta)
        $scope.ship.vx += fThrust * Math.sin($scope.ship.r * Math.PI / 180);
        $scope.ship.vy -= fThrust * Math.cos($scope.ship.r * Math.PI / 180);
        console.log('SHIP TO BACKEND:', $scope.ship)
        socket.emit('playerMove', $scope.ship);
    }
    console.log('socket.on', socket)
    $scope.bgPos = {
        x: 0,
        y: 0
    };
    socket.on('shipPosits', function(p) {
        //on updated player position, reposition all players.
        console.log('SHIP UPDATE', p.ships.length ? p.ships[0].vy : '')
        $scope.allShips = p.ships;
        for (var i = 0; i < p.ships.length; i++) {
            if (p.ships[i].id == $scope.id) {
                $scope.ship = p.ships[i];
            }
        }
        $scope.lazers = p.lazers;
        $scope.bgPos = $scope.playDisp();
        $scope.$digest();
    })
})
