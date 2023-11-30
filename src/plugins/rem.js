

(function (doc, win) {
  let docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      // let clientWidth = docEl.getBoundingClientRect().width > 1400 ? docEl.getBoundingClientRect().width : 1400
      let clientWidth = docEl.getBoundingClientRect().width 
      if (!clientWidth) return
      docEl.style.fontSize = 20 * (clientWidth / 375) + 'px'
    }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
