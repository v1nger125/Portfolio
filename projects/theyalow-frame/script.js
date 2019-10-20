document.body.querySelector(".switch").addEventListener("click", (e) => {
  e.preventDefault();
  if(document.body.querySelector(".switch").innerHTML == "MOBILE") {
    document.querySelector(".iframe").setAttribute("width", 640);
    document.body.querySelector(".switch").innerHTML = "DESKTOP";
  }
  else {
    document.querySelector(".iframe").setAttribute("width", 1300);
    document.body.querySelector(".switch").innerHTML = "MOBILE";
  }
})
//1300 640