import { selectorPrefix } from './config'

export default class Slider {
  constructor({ horOrVert, leftOrRight, topOrBottom }) {
    this.isDragging = false
    this.positionArr = [horOrVert, leftOrRight, topOrBottom]
    this.slider = null
  }

  init(onMove) {
    const selector = `.slider.${selectorPrefix}${
      this.positionArr[0]
    }.${selectorPrefix}${this.positionArr[1]}.${selectorPrefix}${
      this.positionArr[2]
    }`
    this.slider = document.querySelector(selector)
    document.addEventListener('mousedown', this.onMouseDown.bind(this))
    document.addEventListener('mousemove', this.onMouseMove.bind(this, onMove))
    document.addEventListener('mouseup', this.onMouseUp.bind(this))
  }

  onMouseDown(e) {
    if(e.target.className !== 'slider__thumb') return
    let isCurrentSlider = this.positionArr.every(item => {
      return e.target.parentNode.classList.contains(selectorPrefix + item)
    })
    if (!isCurrentSlider) return
    this.slider.classList.add('active')
    this.isDragging = true
  }

  onMouseMove(onMove, e) {
    if (!this.isDragging) return

    let dis = 0
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

    dis = Math.abs(
      e[clientSuffix] - this.slider.getBoundingClientRect()[position]
    )

    let percent = Math.round(dis / (this.slider[offsetSuffix] / 100))
    this.slider.style.setProperty('--percent', percent)
    onMove(this.positionArr, percent + '%')
  }

  onMouseUp() {
    this.isDragging = false
    this.slider.classList.remove('active')
  }

  updateSlider() {
    window.getComputedStyle(box, null).borderR
  }
}
