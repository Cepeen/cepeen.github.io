

gsap.registerPlugin(ScrollTrigger);

const animatedText = document.querySelector(".rotate-text");

const animationTimeline = gsap.timeline({
  scrollTrigger: {
    start: 'top top',
    end: "bottom end",
    scrub: true, 
  },
});

animationTimeline.to(animatedText, {

  rotation:360,
  duration:1, ease:'none',
  scale: 0.01,
  x: -120,
  y: -200,
});


gsap.utils.toArray("#author").forEach(function (elem) {
  ScrollTrigger.create({
    trigger: elem,
    start: "top 80%",
    end: "bottom 20%",

    onEnter: function () {
      gsap.fromTo(
        elem,
        { y: 100, autoAlpha: 0 },
        {
          duration: 1.25,
          y: 0,
          autoAlpha: 1,
          ease: "back",
          overwrite: "auto",
        }
      );
    },
    onLeave: function () {
      gsap.fromTo(elem, { autoAlpha: 1 }, { autoAlpha: 0, overwrite: "auto" });
    },
    onEnterBack: function () {
      gsap.fromTo(
        elem,
        { y: -100, autoAlpha: 0 },
        {
          duration: 1.25,
          y: 0,
          autoAlpha: 1,
          ease: "back",
          overwrite: "auto",
        }
      );
    },
    onLeaveBack: function () {
      gsap.fromTo(elem, { autoAlpha: 1 }, { autoAlpha: 0, overwrite: "auto" });
    },
  });
});


