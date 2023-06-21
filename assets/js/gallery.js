//gallery filter

var x, i, tar;
x = document.getElementsByClassName("artworks");

window.onclick = (e) => {
  tar = e.target.innerText.length;
};

filterSelect("all");
function filterSelect(c) {
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    removeClassShow(x[i], "show");
    if (x[i].className.indexOf(c) > -1) addClassShow(x[i], "show");
  }
}

function addClassShow(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

function removeClassShow(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}
