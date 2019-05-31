
class AnimateComponent {
  constructor(displayObject, delay, duration, minX, maxX) {
    this.displayObject = displayObject;
    this.delay = delay;
    this.duration = duration;
    this.minX = minX;
    this.maxX = maxX;
  }
  
  start(timestamp) {
    if (this.isAnimating) return;
    const displayObject = this.displayObject;
    const now = timestamp + this.delay;
    setTimeout(() => {
      this.tween = new TWEEN.Tween({x: this.minX})
        .to({x: this.maxX}, this.duration)
        .repeat(Infinity)
        .yoyo(true)
        .easing(TWEEN.Easing.Quartic.InOut)
        .onUpdate(function onUpdate() {
          displayObject.x = this.x;
        })
        .start(now);
      this.isAnimating = true;
      this.step(now);
    }, this.delay);
  }
  
  stop() {
    if (!this.isAnimating) return;
    this.isAnimating = false;
    this.tween.stop();
    this.reset();
  }
  
  reset() {
    this.displayObject.x = 0;
  }
  
  step(timestamp) {
    if (this.isAnimating) requestAnimationFrame((time) => this.step(time));
    this.tween.update(timestamp);
  }
}

  export default AnimateComponent;