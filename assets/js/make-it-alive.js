// gsap is boring

import "https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js";

const scrollTracker = document.querySelector(".scroll-tracker");

const animatedText = document.querySelector(".rotate-text");

const scrollTrackingTimeline = new ScrollTimeline({
  source: document.scrollingElement,
  orientation: "block",
  scrollOffsets: [CSS.percent(0), CSS.percent(100)],
});

const animatedTextTimeline = new ScrollTimeline({
  scrollOffsets: [
    { target: animatedText, edge: "end", treshold: "1" },
    { target: animatedText, edge: "start", treshold: "1" },
  ],
});


animatedText.animate(
  {
    transform: [
      "perspective(1000px) rotateZ(-360deg)",
    ],

    scale: (1, 0.01),
    translate: (120, 50),
  },
  {
    duration: 1,
    timeline: animatedTextTimeline,
  }
);

// gsap is exciting

gsap.registerPlugin(ScrollTrigger);
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
