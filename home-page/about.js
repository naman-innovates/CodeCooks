const abouttransition = () => {
  let smallNav = document.querySelector('.smallNav')
  smallNavBounding = smallNav.getBoundingClientRect()
  gsap.to('.smallNav', {
    scrollTrigger: {
      trigger: '.aboutSection',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
    y: window.innerHeight - smallNavBounding.height,
    ease: 'Linear.easeIn',
  })

  let frameBox = document.querySelector('.frameBox')
  frameBoxBounding = frameBox.getBoundingClientRect()
  frmH = frameBoxBounding.height

  let smallNavpadding = window.getComputedStyle(smallNav)

  gsap.to('.frameBox', {
    scrollTrigger: {
      trigger: '.aboutSection',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      // markers: true,
    },
    y:
      window.innerHeight -
      frmH -
      frameBoxBounding.top -
      parseInt(smallNavpadding.paddingBottom) +
      20,
    ease: 'Linear.easeIn',
  })
}

abouttransition()
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('domLoaded')
    document.body.classList.add('noDelay')
  }, 50)
})

