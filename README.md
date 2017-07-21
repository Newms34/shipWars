#Dave's Heli Sim &#128641;

##Contents: 
 - [&#128712;About](#about)
 - [&#128377;Usage](#usage)
 - [&#128421;Server](#server)
 - [&#128202;Technical Stuff](#technical-stuff)
 - [&#128203;Credits](#credits)

#About
Dave's Heli Sim is a simple demonstration of the power of raw CSS/JS. I'm using css and some relatively basic trigonometry/physics to animate (and then allow you to fly) a helicopter. I use AngularJS for most of the animations.

##Usage
###Setup
To use Dave's Heli Sim, you'll need follow the following instructions:

*NOTE: The server's not live yet, so for now you'll just have to wait and see!*

 1. Log onto the site (*pending!* Something on Herokuapp.com). 
 2. Decide how you want to control the heli. You can either use two phones or one phone and your mouse.
 3. For each phone, log onto the site. You'll be redirected to the mobile version of the site.
 4. Again, for each phone, enter the code displayed on the phone under Phone Code in the box on the desktop version of the site.
 5. Click "Done" on the desktop version.
 6. Fly!

###Controls (phone&#128241;)

 - The **cyclic** is akin to the joystick in other aircraft: it controls, generally, speaking, the direction of the vehicle. Note that the initial position of your phone is considered the "neutral" point. Remember that **pitch** is forward and back tilt, **yaw** is left and right in a flat plane, while **roll** is left and right about an axis from nose to tail. When going around a corner, your car *yaws*, but it does not (hopefully!) *roll*.
  - Roll left to increase lift on the right-facing blades, while decreasing it on the left-facing blades, thus pushing the aircraft left.
  - Roll right to move to the right.
  - Yaw left to simulate pushing the left pedal. This temporarily decreases the blade angle of the tail rotors. In turn, this increases the effect of the torque of the main rotors, thus turning the aircraft left.
  - Yaw right to turn right.
  - Pitch forward to increase the angle of the rear-facing blades, while decreasing the angle of the forward facing blade. This pushes the aircraft forward.
  - Pitch backwards to push the aircraft backwards. 
 - The **collective** is generally the 'power' control. However, in most helicopters, the blades actually spin at a constant rate. Instead, it's the job of the collective to adjust the angle of the blades. 
  - Tilt backwards to decrease blade angle, and thus decrease lift.
  - Tilt forwards to increase blade angle, and thus increase lift.

###Controls (mouse&#128432;)
*NOTE: if you're using a one button mouse, you will not be able to yaw your craft. Sorry!*

 - **Cyclic**
  - Move the mouse to the left temporarily to slide left.
  - Move the mouse to the right to slide right.
  - Move the mouse to forward to pitch forward and begin moving forward.
  - Move the mouse backwards to pitch back, and begin sliding backwards.
  - Finally, click the left and right mousebuttons to yaw left or right (i.e., use the rudder pedals);
 - **Collective**
  - Move the mouse forward to increase throttle. 
  - Move the mouse backwards to decrease throttle.

##Server
Currently, there is no live version of this app. However, it'll eventually be located (probably!) at *daveheligame.herokuapp.com*.

##Technical Stuff
Dave's Heli Game uses the following technologies:

 - AngularJS for front-end responsiveness. Particularly, I'm using it to animate the different parts of the heli.
 - The native deviceorientation API (`window.addeventlistener("deviceorientation",callback)`) to capture phone orientation information.
 - NodeJS and ExpressJS on the back-end for the server.
 - Websockets, via socket.io, to allow quick communication between the server, phones, and game.
 - CSS3 for the 3d. I'm also using some of CSS3's filters (namely the `blur()` filter) to create a motion blur effect.
 - Lots and lots of trigonometry and basic physics to control the aircraft's movement. I am *not* an aircraft person, so I'm only using what I can google! If it looks wrong, it probably is!

##Credits
Dave's Heli Game was written by me, [Dave](https://github.com/Newms34). Other various libraries/technologies are from their respective creators. I'm just usin em."# shipWars" 
