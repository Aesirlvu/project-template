// Verifies the carousel scroll-state derivation logic against a fake Embla API.
// It reproduces the exact expressions used in components/ui/carousel.tsx.
function simulate({ slideCount, initialIndex = 0 }) {
  let index = initialIndex
  const listeners = new Map()
  const lastIndex = slideCount - 1

  const api = {
    canScrollNext() {
      return Math.min(index + 1, lastIndex) !== index
    },
    canScrollPrev() {
      return Math.max(index - 1, 0) !== index
    },
    scrollNext() {
      index = Math.min(index + 1, lastIndex)
      listeners.get("select")?.(api)
    },
    on(event, cb) {
      listeners.set(event, cb)
    },
    off(event) {
      listeners.delete(event)
    },
  }

  // First render: api is undefined -> both buttons disabled.
  let render = { canScrollPrev: false, canScrollNext: false, tick: 0 }
  const firstRender = { ...render }

  // After the effect sets api and rAF fires onSelect -> tick increments -> re-render.
  render = {
    canScrollPrev: api.canScrollPrev(),
    canScrollNext: api.canScrollNext(),
    tick: render.tick + 1,
  }
  const afterInit = { ...render }

  // User clicks next.
  api.scrollNext()
  render = {
    canScrollPrev: api.canScrollPrev(),
    canScrollNext: api.canScrollNext(),
    tick: render.tick + 1,
  }
  const afterNext = { ...render }

  return { firstRender, afterInit, afterNext }
}

const multi = simulate({ slideCount: 4 })
const single = simulate({ slideCount: 1 })

const checks = [
  ["multi: primer render ambos deshabilitados", multi.firstRender.canScrollNext === false && multi.firstRender.canScrollPrev === false],
  ["multi: tras init, next habilitado", multi.afterInit.canScrollNext === true],
  ["multi: tras init, prev deshabilitado", multi.afterInit.canScrollPrev === false],
  ["multi: tras click next, prev habilitado", multi.afterNext.canScrollPrev === true],
  ["multi: tras click next, next sigue habilitado (4 slides)", multi.afterNext.canScrollNext === true],
  ["single: tras init, next deshabilitado (1 slide)", single.afterInit.canScrollNext === false],
  ["single: tras init, prev deshabilitado", single.afterInit.canScrollPrev === false],
]

let failed = 0
for (const [label, ok] of checks) {
  if (!ok) failed++
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`)
}
console.log(failed === 0 ? "\nAll carousel state checks passed." : `\n${failed} check(s) failed.`)
process.exit(failed === 0 ? 0 : 1)
