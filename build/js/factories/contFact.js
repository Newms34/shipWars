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
