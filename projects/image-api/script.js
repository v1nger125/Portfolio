let setting = localStorage.getItem("setting");
if(!setting){
  setting = {
    selectedSize: 1, //1, 2, 3
    selectedTool: 1, //1, 2, 3, 4
    color: "#000000",
    prevColor: "#ffffff",
    arr: []
  }
}
else{
  setting = JSON.parse(setting);
};

window.addEventListener('load', () => {
  document.querySelector(`.right__size-list > div:nth-child(${setting.selectedSize})`).classList.add("active");
  objCanvas.changeSize(setting.selectedSize);
  objCanvas.color = setting.color;
  if(setting.arr.length !== 0){
    objCanvas.arr = setting.arr;
  }
  document.querySelector(`.left__tool-list > div:nth-child(${setting.selectedTool})`).classList.add("active");
  document.querySelector(`.left__color-list > div:nth-child(1) > div:nth-child(1)`).style.backgroundColor = setting.color;
  document.getElementById("palette").value = setting.color;
  document.querySelector(`.left__color-list > div:nth-child(2) > div:nth-child(1)`).style.backgroundColor = setting.prevColor;
  objCanvas.updateCanvas();
});
window.addEventListener('beforeunload', () => {
  setting.arr = objCanvas.arr;
  localStorage.setItem("setting", JSON.stringify(setting));
});

let objCanvas = {
  canvasSize: null,
  pixelSize: null,
  color: null,
  arr: [],
  ctx: document.getElementById("canvas").getContext("2d"),
  changeSize(sizeSetting){
    objCanvas.clearCanvas();
    switch(sizeSetting) {
      case 1: this.pixelSize = 8; break;
      case 2: this.pixelSize = 4; break;
      case 3: this.pixelSize = 2; break;
      case 4: this.pixelSize = 1; break;
    }
    this.canvasSize = this.ctx.canvas.clientWidth/this.pixelSize;
    this.arr = new Array(this.canvasSize);
    for (let i = 0; i < this.canvasSize; i++) {
      this.arr[i] = new Array(this.canvasSize);
      for (let j = 0; j < this.canvasSize; j++) {
        this.arr[i][j] = "#ffffff";
      }
    }
  },
  clearCanvas(){
    this.ctx.clearRect(0,0,this.ctx.canvas.clientWidth,this.ctx.canvas.clientHeight);
    for (let i = 0; i < this.canvasSize; i++) {
      for (let j = 0; j < this.canvasSize; j++) {
        this.arr[i][j] = "#ffffff";
      }
    }
  },
  updateCanvas(){
    for (let i = 0; i < this.canvasSize; i++) {
      for (let j = 0; j < this.canvasSize; j++) {
        this.ctx.fillStyle = this.arr[i][j];
        this.ctx.fillRect(i*this.pixelSize,j*this.pixelSize, this.pixelSize, this.pixelSize);
      }
    }
  },
  getPixelColor(clX,clY){
    let x = Math.floor(clX/this.pixelSize);
    let y = Math.floor(clY/this.pixelSize);
    if(this._checkTrust(x, y)) {
      let color = this.arr[x][y];
      if(color.slice(0,4) == "rgba"){
        color = this._colorSwitcher(color);
      }
      return color;
    }
    else return;
  },
  setPixelColor(clX,clY){
    let x = Math.floor(clX/this.pixelSize);
    let y = Math.floor(clY/this.pixelSize);
    if (this.arr[x][y] === this.color) return;
    if (this._checkTrust(x, y)){ 
      this.arr[x][y] = this.color;
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(x*this.pixelSize,y*this.pixelSize, this.pixelSize, this.pixelSize);
    }
  },
  fillArea(clX,clY){
    let x = Math.floor(clX/this.pixelSize);
    let y = Math.floor(clY/this.pixelSize);
    if (!this._checkTrust(x, y)) return;
    this._fillAreaHelper(x, y, this.arr[x][y]);
    this.updateCanvas();
  },
  drawImage(img){
    img.setAttribute('crossOrigin', '');
    let scale = img.width > img.height ? img.width : img.height;
    scale = this.canvasSize / scale;
    let sizeX = Math.floor(scale*img.width);
    let sizeY = Math.floor(scale*img.height);
    this.ctx.drawImage(img,0,0,sizeX,sizeY);
    let imageArr = this.ctx.getImageData(0,0,sizeX,sizeY).data;
    let startX = Math.floor((this.canvasSize - sizeX)/2);
    let startY = Math.floor((this.canvasSize - sizeY)/2);
    let k = 0;
    for (let j = startY; j < startY+sizeY; j++) {
      for (let i = startX; i < startX+sizeX; i++) {
        this.arr[i][j] = `rgba(${imageArr[k]},${imageArr[k+1]},${imageArr[k+2]},${imageArr[k+3]})` 
        k += 4;
      }
    }
    this.updateCanvas();
  },
  grayScale(){
    let imageArr = this.ctx.getImageData(0,0,this.ctx.canvas.clientWidth,this.ctx.canvas.clientHeight).data;
    let k = 0;
    for (let j = 0; j < this.canvasSize; j++) {
      k = j*4*this.ctx.canvas.clientWidth*this.pixelSize;
      for (let i = 0; i < this.canvasSize; i++) {
        let avg = Math.floor((imageArr[k]+imageArr[k+1]+imageArr[k+2])/3);
        this.arr[i][j] = `rgba(${avg},${avg},${avg},${imageArr[k+3]})`;
        k += 4*this.pixelSize;
        this.ctx.fillStyle = this.arr[i][j];
        this.ctx.fillRect(i*this.pixelSize,j*this.pixelSize, this.pixelSize, this.pixelSize);
      }
    }
  },
  _checkTrust(x, y){
    return (x >= 0 && x < this.canvasSize && y >= 0 && y < this.canvasSize);
  },
  _fillAreaHelper(x,y, oldColor){
    if (oldColor === this.color) return;
    let startX = x;
    let arrX = new Array();
    while (this._checkTrust(x, y) && (this.arr[x][y] === oldColor || this._colorSwitcher(this.arr[x][y]) === oldColor)) {
      this.arr[x][y] = this.color;
      arrX.push(x);
      x++;
    }
    x = startX - 1;
    while (this._checkTrust(x, y) && (this.arr[x][y] === oldColor || this._colorSwitcher(this.arr[x][y]) === oldColor)) {
      this.arr[x][y] = this.color;
      arrX.push(x);
      x--;
    }
    arrX.forEach((item) => {this._fillAreaHelper(item, y + 1, oldColor)});
    arrX.forEach((item) => {this._fillAreaHelper(item, y - 1, oldColor)});
  },
  _colorSwitcher(color){
    if(color.slice(0,4) == "rgba") {
      color = color.slice(5,-1);
      color = color.split(",")
      for (let i = 0; i < color.length; i++) {
        color[i] = (+color[i]).toString(16);
        if(color[i].length === 1) color[i] = "0" + color[i];
      }
      color = "#" + color[0] + color[1] + color[2];
    }
    else {
      color = [color.slice(1,3),color.slice(3,5),color.slice(5)];
      for (let i = 0; i < color.length; i++) {
        color[i] = '0x' + color[i];
        color[i] = parseInt(color[i]);
      }
      color = `rgba(${color.join()},255)`;
    }
    return color;
  }
}
// listener for pencil
document.getElementById("canvas").addEventListener("mousedown", function(e){
  if (setting.selectedTool === 3 || e.button !== 0) return;
  let cnv = document.getElementById("canvas");
  let x = e.offsetX + 1;
  let y = e.offsetY + 1;
  if (x >= objCanvas.ctx.canvas.clientWidth || y >= objCanvas.ctx.canvas.clientHeight) return;
  if (setting.selectedTool === 1) {
    function onMouseMove(event){
      function bLines(x_1, y_1, x_2, y_2) {
        let step = true;
        if(Math.abs(x_1 - x_2) < Math.abs(y_1 - y_2)){
          step = false;
          [x_2, y_2] = [y_2, x_2];
          [x_1, y_1] = [y_1, x_1];
        }
        if (x_1 > x_2){
          [x_2, x_1] = [x_1, x_2];
          [y_1, y_2] = [y_2, y_1];
        }
        const dx = x_2-x_1;
        const dy = Math.abs(y_2-y_1);
        let y = y_1;
        let error = 0;
        for (let i = x_1; i <= x_2; i++) {
          if(step){
            objCanvas.setPixelColor(i,y)
          }
          else{
            objCanvas.setPixelColor(y,i);
          }
          error += dy;
          if (error > dx){
            y += y_1  >y_2 ? -1 : 1;
            error -= dx;
          }
        }
      }
      let newX = event.offsetX + 1;
      let newY = event.offsetY + 1;
      if (x >= 512 || y >= 512) return;
      if (newX !== x || newY !== y) {
        bLines(x,y,newX,newY);
        x = newX;
        y = newY;
      }
    }
    cnv.addEventListener("mousemove", onMouseMove);
    cnv.onmouseup = function(){
      cnv.removeEventListener("mousemove", onMouseMove);
      cnv.onmouseup = null;
    }
    cnv.onmouseleave = function(){
      cnv.removeEventListener("mousemove", onMouseMove);
      cnv.onmouseleave = null;
    }
  }
});
//listener for bucket and chose color tool
document.getElementById("canvas").addEventListener("click", function(e) {
  let x = e.offsetX + 1;
  let y = e.offsetY + 1;
  if (x >= objCanvas.ctx.canvas.clientWidth || y >= objCanvas.ctx.canvas.clientHeight) return;
  if (setting.selectedTool === 3) {
    let event = new Event("change", {bubbles: true});
    document.getElementById("palette").value = objCanvas.getPixelColor(x,y);
    document.getElementById("palette").dispatchEvent(event);
  }
  else if (setting.selectedTool === 1){
    objCanvas.setPixelColor(x, y);
  }
  else if (setting.selectedTool === 2){
    objCanvas.fillArea(x, y);
  }
});
//listener for change size
document.querySelector(".right__size-list").addEventListener('click', (e) => {
  const target = e.target.closest(".list__item");
  if(!target || target.classList.contains("active")) return;
  document.querySelector(`.right__size-list > div:nth-child(${setting.selectedSize})`).classList.remove("active");
  target.classList.add("active");
  const list = document.querySelector(".right__size-list").children; 
  for (let num = 0; num < list.length; num++) {
    if(list[num].classList.contains("active")){
      setting.selectedSize = ++num;
      break;
    }
  }
  objCanvas.changeSize(setting.selectedSize);
});
//listener for change tool
document.querySelector(".left__tool-list").addEventListener('click', (e) => {
  const target = e.target.closest(".list__item");
  if(!target || target.classList.contains("active") || target.classList.contains("inactive")) return;
  document.querySelector(`.left__tool-list > div:nth-child(${setting.selectedTool})`).classList.remove("active");
  target.classList.add("active");
  const list = document.querySelector(".left__tool-list").children; 
  for (let num = 0; num < list.length; num++) {
    if(list[num].classList.contains("active")){
      setting.selectedTool = ++num;
      break;
    }
  }
});
//listeners for changing color
document.getElementById("palette").onchange = (e) => {
  setting.prevColor = setting.color;
  setting.color = e.target.value;
  objCanvas.color = setting.color;
  document.querySelector(`.left__color-list > div:nth-child(1) > div:nth-child(1)`).style.backgroundColor = setting.color;
  document.querySelector(`.left__color-list > div:nth-child(2) > div:nth-child(1)`).style.backgroundColor = setting.prevColor;
}
document.querySelector('.left__color-list > div:nth-child(2)').addEventListener('click', (e) => {
  [setting.prevColor, setting.color] = [setting.color, setting.prevColor];
  objCanvas.color = setting.color;
  document.querySelector(`.left__color-list > div:nth-child(1) > div:nth-child(1)`).style.backgroundColor = setting.color;
  document.querySelector(`.left__color-list > div:nth-child(2) > div:nth-child(1)`).style.backgroundColor = setting.prevColor;
});
document.querySelector('.left__color-list > div:nth-child(3)').addEventListener('click', (e) => {
  setting.prevColor = setting.color;
  setting.color = "#ff0000"
  objCanvas.color = setting.color;
  document.querySelector(`.left__color-list > div:nth-child(1) > div:nth-child(1)`).style.backgroundColor = setting.color;
  document.querySelector(`.left__color-list > div:nth-child(2) > div:nth-child(1)`).style.backgroundColor = setting.prevColor;
});
document.querySelector('.left__color-list > div:nth-child(4)').addEventListener('click', (e) => {
  setting.prevColor = setting.color;
  setting.color = "#00ff00"
  objCanvas.color = setting.color;
  document.querySelector(`.left__color-list > div:nth-child(1) > div:nth-child(1)`).style.backgroundColor = setting.color;
  document.querySelector(`.left__color-list > div:nth-child(2) > div:nth-child(1)`).style.backgroundColor = setting.prevColor;
});
//

//hotkeys
document.addEventListener('keydown', (e) => {
  let event = new Event("click", {bubbles: true})
  if(e.code === "KeyP"){
    document.querySelector('.left__tool-list > div:nth-child(1)').dispatchEvent(event);
  }
  else if(e.code === "KeyC"){
    document.querySelector('.left__tool-list > div:nth-child(3)').dispatchEvent(event);
  }
  else if(e.code === "KeyB"){
    document.querySelector('.left__tool-list > div:nth-child(2)').dispatchEvent(event);
  }
});

//if you try to click on small image this listener focus your on input 
document.querySelector(".canvas__top_input-wrapper").addEventListener('click', () => {
  document.getElementById('city').focus();
});
//image download
document.querySelector('.canvas__top_setting > div:nth-child(1)').addEventListener('click', () => {
  let url = `https://api.unsplash.com/photos/random?query=town,${document.getElementById('city').value}&client_id=517ea9755f8dc51ad850f22f4621640c833d1f82aa9ef55c59f4c99d4e8d11a8`
  fetch(url)
  .then(res => res.json())
  .then(data => data.urls.small)
  .then(function(src){
    let img = new Image();
    img.src = src;
    img.setAttribute('crossOrigin', '');
    img.onload = () => {
      objCanvas.drawImage(img);
    }
  });
});
//B&W
document.querySelector('.canvas__top_setting > div:nth-child(3)').addEventListener('click', () => {
  objCanvas.grayScale();
});