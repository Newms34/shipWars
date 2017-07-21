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
