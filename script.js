let items = document.getElementsByClassName("slider__item");
let current = 0;
let enabled = true;
function nextItem(){
  hideItem("to-left");
  current = (current + 1 + items.length) % items.length;
  showItem("from-right");
}

function prevItem(){
  hideItem("to-right");
  current = (current - 1 + items.length) % items.length;
  showItem("from-left");
}

// to-left to-right
function hideItem(direction){
  enabled = false;
  items[current].classList.add(direction);
  items[current].addEventListener("animationend", function(){
    this.classList.remove("active", direction);
  });
}

// from-left from-right
function showItem(direction){
  items[current].classList.add("next", direction);
  items[current].addEventListener("animationend", function(){
    this.classList.remove("next", direction);
    this.classList.add("active");
    enabled = true;
  });
}

document.querySelector(".slider__arrow_left").addEventListener("click", function() {
  if (enabled) {
    prevItem();
  }
});
document.querySelector(".slider__arrow_right").addEventListener("click", function() {
  if (enabled) {
    nextItem();
  }
});

function swipe(element){
  let distX, distY;
  element.addEventListener("mousedown", (e) => {
    distX = e.pageX;
    distY = e.pageY;
    e.preventDefault();
  });
  element.addEventListener("mouseup", (e) => {
    distX = e.pageX - distX;
    distY = e.pageY - distY;
    if (Math.abs(distY) < 100 && Math.abs(distX) > 100) {
      if (distX > 0 && enabled) prevItem();
      else if(enabled) nextItem();
    }
    e.preventDefault();
  });
  element.addEventListener("touchstart", (e) => {
    if (e.target.classList.contains("slider__item_name")) {   
      if (e.target.parentNode.children[2].classList.contains("show-description")) {
        e.target.parentNode.children[2].classList.remove("show-description");
      }
      else {
        e.target.parentNode.children[2].classList.add("show-description");
      }
    }
    if (e.target.classList.contains("slider__item_link")) {   
      location.href = e.target.href;
    }
    distX = e.changedTouches[0].pageX;
    distY = e.changedTouches[0].pageY;
    e.preventDefault();
  });
  element.addEventListener("touchmove", (e) => {
    e.preventDefault();
  });
  element.addEventListener("touchend", (e) => {
    distX = e.changedTouches[0].pageX - distX;
    distY = e.changedTouches[0].pageY - distY;
    if (Math.abs(distY) < 100 && Math.abs(distX) > 100) {
      if (distX > 0 && enabled) prevItem();
      else if(enabled) nextItem();
    }
    e.preventDefault();
  });
}
swipe(document.querySelector(".slider__container"))

let checkState = true;
document.querySelector(".main__education").addEventListener("click", (event) => {
  event.preventDefault();
  if (checkState) {
    document.querySelector(".main__move-section").classList.add("show");
    checkState = false;
  }
  else {
    checkState = true;
    document.querySelector(".show").classList.remove("show");
  }
})

