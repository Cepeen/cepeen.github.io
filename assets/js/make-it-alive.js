if (window.innerWidth >= 1024) {

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

//heading rotating text
// gsap.registerPlugin(ScrollTrigger);

// const animatedText = document.querySelector(".rotate-text");

// const animationTimeline = gsap.timeline({
//   scrollTrigger: {
//     start: 'top top',
//     end: "bottom end",
//     scrub: true, 
//   },
// });

// animationTimeline.to(animatedText, {

//   rotation:360,
//   duration:1, ease:'none',
//   scale: 0.01,
//   x: -120,
//   y: -200,
// });




  //heading letters animation
  var $heading = $('#heading');
  var chars = $heading.text().split('');
  var wrappedChars = '';
  for (var i = 0; i < chars.length; i++) {
    var char = (chars[i] == ' ') ? '&nbsp;' : chars[i];
    wrappedChars += '<span>' + char +  '</span>';
  }
  $heading.html(wrappedChars+'&nbsp;'+'&nbsp;');
  
  var timeline = new TimelineMax();
  var $chars = $heading.find('span');
  
  $chars.each(function (index) {
    var charWidth = $(this).width();
    var containerWidth = $heading.width();
    var initialX = -charWidth;
  
    timeline.add(
      TweenMax.fromTo(this, 1, {
        x: initialX,
        y: getRandom(100, 200),
        opacity: 0
      }, {
        x: index * 0, 
        y: 0,
        opacity: 1,
        ease: Power2.easeInOut
      }), 0.1 * index 
    );
  });



//author info animation
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
}


var prevScrollpos = window.scrollY;
var navbar = document.getElementById("navbar");

// Function to detect mobile devices or small screens
function isMobileOrSmallScreen() {
  return window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (!isMobileOrSmallScreen()) {
  window.onscroll = function() {
    var currentScrollPos = window.scrollY;
    if (prevScrollpos > currentScrollPos) {
      navbar.style.top = "0";
    } else {
      navbar.style.top = "-50px";
    }
    prevScrollpos = currentScrollPos;
  };

  window.addEventListener('mousemove', function(e) {
    if (e.clientY < 150) {
      navbar.style.top = "0";
    } else if (window.scrollY > 50) {
      navbar.style.top = "-50px";
    }
  });
} else {
  navbar.style.top = "0"; // Ensure navbar is visible on mobile devices and small screens
}


//background color change



gsap.fromTo( ".wrap", {
	backgroundColor: gsap.getProperty("html", "--dark")
}, {
	scrollTrigger: {
		trigger: ".color-light",
		scrub: true,
		end: "bottom bottom",
	},
	backgroundColor: gsap.getProperty("html", "--light")
});
