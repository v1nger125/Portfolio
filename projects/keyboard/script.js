let area = document.createElement("textarea");
area.setAttribute("name", "area");
area.setAttribute("id","area");
area.setAttribute("class","area");
area.setAttribute("cols", "100");
area.setAttribute("rows", "10");
document.body.append(area);
let keyboard = document.createElement("div");
keyboard.setAttribute("class", "keyboard");
document.body.append(keyboard);
let arr = [
  ["Backquote", "`","~","ё","Ё"],
  ["Digit1", "1","!","1","!"],
  ["Digit2", "2","@","2",'"'],
  ["Digit3", "3","#","3","№"],
  ["Digit4", "4","$","4",";"],
  ["Digit5", "5","%","5","%"],
  ["Digit6", "6","^","6",":"],
  ["Digit7", "7","&","7","?"],
  ["Digit8", "8","*","8","*"],
  ["Digit9", "9","(","9","("],
  ["Digit0", "0",")","0",")"],
  ["Minus", "-","_","-","_"],
  ["Equal", "=","+","=","+"],
  ["Backspace", "Backspace","Backspace","Backspace","Backspace"],
  ["Tab", "Tab","Tab","Tab","Tab"],
  ["KeyQ", "q","Q","й","Й"],
  ["KeyW", "w","W","ц","Ц"],
  ["KeyE", "e","E","у","У"],
  ["KeyR", "r","R","к","К"],
  ["KeyT", "t","T","е","Е"],
  ["KeyY", "y","Y","н","Н"],
  ["KeyU", "u","U","г","Г"],
  ["KeyI", "i","I","ш","Ш"],
  ["KeyO", "o","O","щ","Щ"],
  ["KeyP", "p","P","з","З"],
  ["BracketLeft", "[","{","х","Х"],
  ["BracketRight", "]","}","ъ","Ъ"],
  ["Backslash", "\\","|","\\","/"],
  ["Delete", "Del", "Del", "Del", "Del"],
  ["CapsLock", "CapsLock","CapsLock","CapsLock","CapsLock"],
  ["KeyA", "a","A","ф","Ф"],
  ["KeyS", "s","S","ы","Ы"],
  ["KeyD", "d","D","в","В"],
  ["KeyF", "f","F","а","А"],
  ["KeyG", "g","G","п","П"],
  ["KeyH", "h","H","р","Р"],
  ["KeyJ", "j","J","о","О"],
  ["KeyK", "k","K","л","Л"],
  ["KeyL", "l","L","д","Д"],
  ["Semicolon", ";",":","ж","Ж"],
  ["Quote", "'",'"',"э","Э"],
  ["Enter", "\n","\n","\n","\n"],
  ["ShiftLeft", "Shift","Shift","Shift","Shift"],
  ["KeyZ", "z","Z","я","Я"],
  ["KeyX", "x","X","ч","Ч"],
  ["KeyC", "c","C","с","С"],
  ["KeyV", "v","V","м","М"],
  ["KeyB", "b","B","и","И"],
  ["KeyN", "n","N","т","Т"],
  ["KeyM", "m","M","ь","Ь"],
  ["Comma", ",","<","б","Б"],
  ["Period", ".",">","ю","Ю"],
  ["Slash", "/","?",".",","],
  ["ShiftRight", "Shift","Shift","Shift","Shift"],
  ["ControlLeft", "Ctrl","Ctrl","Ctrl","Ctrl"],
  ["MetaLeft", "Meta","Meta","Meta","Meta"],
  ["AltLeft", "Alt","Alt","Alt","Alt"],
  ["Space", " "," "," "," "],
  ["AltRight", "Alt","Alt","Alt","Alt"],
  ["MetaRight", "Meta","Meta","Meta","Meta"],
  ["ControlRight", "Ctrl","Ctrl","Ctrl","Ctrl"]
]

let lang = +localStorage.getItem("lang");
class Key{
  constructor(value, elem){
    this.value = value;
    this.elem = elem;
    elem.addEventListener("mousedown", ()=>{
      this.activate();
    });
    elem.addEventListener("mouseup", ()=>{
      this.deactivate();
    });
  }
  activate(){
    if (!this.elem.classList.contains("active")){
      this.elem.classList.add("active");
      this.speak();
    }
    else {
      this.speak();
    }
  }
  deactivate(){
    this.elem.classList.remove("active");
  }
  speak(){
    if (this.value[1] === "Backspace") {
      area.value = area.value.slice(0, -1);
    }
    else if(this.value[1] !== "Ctrl" && this.value[1] !== "Meta" && this.value[1] !== "Alt" && this.value[1] !== "Shift" && this.value[1] !== "CapsLock" && this.value[1] !== "Tab" && this.value[1] !== "Del"){
      area.value += this.value[lang];
    }
  }
}

function update(){
  for (let item of keyArr) {
    if(item.value[lang] === "\n") item.elem.textContent = "Enter";
    else item.elem.textContent = item.value[lang];
  }
}

function changeLang(){
  if (lang <= 2) {
    localStorage.setItem("lang", "3");
    lang = 3;
  }
  else {
    localStorage.setItem("lang", "1");
    lang = 1;
  }
}

let keyArr = [];
for (let item of arr) {
  let node;
  node = document.createElement("div");
  node.setAttribute("class", "item");
  keyArr.push(new Key(item, node))
  if(item[0] === "Backspace" || item[0] === "Enter") {
    node.style.gridColumnEnd = "span " + 7;
  }
  else if(item[0] === "CapsLock"){
    node.style.gridColumnEnd = "span " + 6;
  } 
  else if(item[0] === "Tab"){
    node.style.gridColumnEnd = "span " + 4;
  }
  else if(item[1] === "Shift"){
    node.style.gridColumnEnd = "span " + 8;
  }
  else if(item[0] === "Space"){
    node.style.gridColumnEnd = "span " + 28;
  }
  keyboard.append(node);
}
update();


function getKey(code){
  for (const item of keyArr) {
    if(item.value[0] === code) {
      return item;
    }
  }
  return -1;
}

document.addEventListener("keydown", function(e){
  e.preventDefault();
  let elem = getKey(e.code);
  if (elem != -1){
    elem.activate();
  }
  if (e.shiftKey && e.altKey) {
    changeLang();
    update();
  }
  else if (e.shiftKey && lang % 2 !== 0) {
    lang++;
    update();
    console.log(lang)
  }
});
document.addEventListener("keyup", function(e){
  if (e.key === "Shift" && lang % 2 == 0) {
    lang--;
    update();
  }
  let elem = getKey(e.code);
  if (elem != -1){
    elem.deactivate();
  }
});