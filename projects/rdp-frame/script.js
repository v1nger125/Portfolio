document.body.querySelector(".switch").addEventListener("click", (e) => {
  e.preventDefault();
  if(document.body.querySelector(".switch").innerHTML == "MOBILE") {
    document.querySelector(".iframe").setAttribute("width", 375);
    document.body.querySelector(".switch").innerHTML = "DESKTOP";
  }
  else {
    document.querySelector(".iframe").setAttribute("width", 1440);
    document.body.querySelector(".switch").innerHTML = "MOBILE";
  }
})
//1440 375