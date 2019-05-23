import { selectorPrefix } from './config'

export default class Slider {
  constructor({ horOrVert, leftOrRight, topOrBottom }) {
    this.isDragging = false
    this.isLimitRange = true
    this.positionArr = [horOrVert, leftOrRight, topOrBottom]
    this.slider = null
  }

  init(moveCallback) {
    const selector = `.slider.${selectorPrefix}${
      this.positionArr[0]
    }.${selectorPrefix}${this.positionArr[1]}.${selectorPrefix}${
      this.positionArr[2]
    }`
    this.slider = document.querySelector(selector)
    document.addEventListener('mousedown', this.onDown.bind(this))
    document.addEventListener('mousemove', this.onMove.bind(this, moveCallback))
    document.addEventListener('mouseup', this.onUp.bind(this))

    if (
      'ontouchstart' in document &&
      'ontouchmove' in document &&
      'ontouchend' in document
    ) {
      document.addEventListener('touchstart', this.onDown.bind(this))
      document.addEventListener('touchmove', this.onMove.bind(this, moveCallback))
      document.addEventListener('touchend', this.onUp.bind(this))
    }
  }

  onDown(e) {
    console.log('onDown')
    if (e.target.className !== 'slider__thumb') return
    let isCurrentSlider = this.positionArr.every(item => {
      return e.target.parentNode.classList.contains(selectorPrefix + item)
    })
    if (!isCurrentSlider) return
    this.slider.classList.add('active')
    this.isDragging = true
  }

  onMove(moveCallback, e) {
    console.log('onMove')
    if (!this.isDragging) return

    let dis = 0
    let percent = 0
    let offsetSuffix
    let clientSuffix
    let position

    if (this.positionArr[0] === 'hor') {
      clientSuffix = 'clientX'
      offsetSuffix = 'offsetWidth'
      if (this.positionArr[1] === 'right') {
        position = 'right'
      } else {
        position = 'left'
      }
    } else {
      clientSuffix = 'clientY'
      offsetSuffix = 'offsetHeight'
      if (this.positionArr[2] === 'bottom') {
        position = 'bottom'
      } else {
        position = 'top'
      }
    }

    let clientAxis = e[clientSuffix] || e.touches[0][clientSuffix]

    dis = Math.abs(clientAxis - this.slider.getBoundingClientRect()[position])
    if (dis >= 0) {
      percent = dis / (this.slider[offsetSuffix] / 100)
    } else {
      percent = 0
    }
    if (percent >= 100 && this.isLimitRange) percent = 100
    this.slider.style.setProperty('--percent', percent)
    moveCallback(this.positionArr, percent)
  }

  onUp() {
    console.log('onUp')
    this.isDragging = false
    this.slider.classList.remove('active')
  }

  setLimitRange(isLimit) {
    this.isLimitRange = isLimit
  }
}
