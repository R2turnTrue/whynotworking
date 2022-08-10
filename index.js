var shakingElements = [];

var shake = function (element, magnitude = 16, angular = false) {
  //First set the initial tilt angle to the right (+1) 
  var tiltAngle = 1;

  //A counter to count the number of shakes
  var counter = 1;

  //The total number of shakes (there will be 1 shake per frame)
  var numberOfShakes = 15;

  //Capture the element's position and angle so you can
  //restore them after the shaking has finished
  var startX = 0,
      startY = 0,
      startAngle = 0;

  // Divide the magnitude into 10 units so that you can 
  // reduce the amount of shake by 10 percent each frame
  var magnitudeUnit = magnitude / numberOfShakes;

  //The `randomInt` helper function
  var randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //Add the element to the `shakingElements` array if it
  //isn't already there
  if(shakingElements.indexOf(element) === -1) {
    //console.log("added")
    shakingElements.push(element);

    //Add an `updateShake` method to the element.
    //The `updateShake` method will be called each frame
    //in the game loop. The shake effect type can be either
    //up and down (x/y shaking) or angular (rotational shaking).
    if(angular) {
      angularShake();
    } else {
      upAndDownShake();
    }
  }

  //The `upAndDownShake` function
  function upAndDownShake() {

    //Shake the element while the `counter` is less than 
    //the `numberOfShakes`
    if (counter < numberOfShakes) {

      //Reset the element's position at the start of each shake
      element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';

      //Reduce the magnitude
      magnitude -= magnitudeUnit;

      //Randomly change the element's position
      var randomX = randomInt(-magnitude, magnitude);
      var randomY = randomInt(-magnitude, magnitude);

      element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';

      //Add 1 to the counter
      counter += 1;

      requestAnimationFrame(upAndDownShake);
    }

    //When the shaking is finished, restore the element to its original 
    //position and remove it from the `shakingElements` array
    if (counter >= numberOfShakes) {
      element.style.transform = 'translate(' + startX + ', ' + startY + ')';
      shakingElements.splice(shakingElements.indexOf(element), 1);
    }
  }

  //The `angularShake` function
  function angularShake() {
    if (counter < numberOfShakes) {
      console.log(tiltAngle);
      //Reset the element's rotation
      element.style.transform = 'rotate(' + startAngle + 'deg)';

      //Reduce the magnitude
      magnitude -= magnitudeUnit;

      //Rotate the element left or right, depending on the direction,
      //by an amount in radians that matches the magnitude
      var angle = Number(magnitude * tiltAngle).toFixed(2);
      console.log(angle);
      element.style.transform = 'rotate(' + angle + 'deg)';
      counter += 1;

      //Reverse the tilt angle so that the element is tilted
      //in the opposite direction for the next shake
      tiltAngle *= -1;

      requestAnimationFrame(angularShake);
    }

    //When the shaking is finished, reset the element's angle and
    //remove it from the `shakingElements` array
    if (counter >= numberOfShakes) {
      element.style.transform = 'rotate(' + startAngle + 'deg)';
      shakingElements.splice(shakingElements.indexOf(element), 1);
      //console.log("removed")
    }
  }

};

window.onload = () => {
  let currentAnger = 0.0; // 0~1.0
  let streakAnger = 0.0
  let streak = 1
  let streakTimeout
  const overlay = document.getElementById("overlay");
  const shakeElement = document.getElementById("shake")
  const ang = document.getElementById("ang");
  let mouseDown = false;

  const breakSfx = new Howl({ src: ['break.wav'], volume: 0.15 })
  const scoreSfx = new Howl({ src: ['score.wav'], volume: 2.0 })

  document.body.onmousedown = () => mouseDown = true
  document.body.onmouse = () => mouseDown = false

  const invoke = () => {
    breakSfx.play()
    currentAnger += 0.05;
    streakAnger += 0.05

    ang.style.fontSize = `${40 + 15 * streakAnger}px`;
    
    if(currentAnger >= 0.8) {
      if(streakTimeout !== undefined) clearTimeout(streakTimeout)
      scoreSfx.play()
      currentAnger = 0
      streak++
      streakTimeout = setTimeout(() => {
        streak = 1
      }, 3000)
    }

    shake(shakeElement, 100 * streak + 100 * currentAnger)
    console.log("current anger: " + currentAnger);
    overlay.style.backgroundColor = `rgba(255, 0, 0, ${currentAnger})`;
  }

  document.onkeydown = () => {
    invoke()
  }

  //setInterval(() => {
  document.addEventListener('click', () => {
    //if(!mouseDown) return
    
    invoke()
  //}, 80)f
  }, true)
};
