const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const modeBtn = document.querySelector('#mode-change');
const color = document.querySelector('#color');
const colorOption = Array.from(document.querySelectorAll('.color-option'));
const range = document.querySelector('#range');
const eraser = document.querySelector('#eraser');
const destroy = document.querySelector('#destroy');
const fileInput = document.querySelector('#file');
const textInput = document.querySelector('#text-input');
const save = document.querySelector('#save');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let paintMode = false;
let modeChange = false;

ctx.lineWidth = range.value;
ctx.lineCap = 'round';

function onMouseMove(event) {
  if (paintMode) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function onPainting() {
  paintMode = true;
}

function offPainting() {
  paintMode = false;
  ctx.beginPath();
}

function onModeChange() {
  if (modeChange) {
    modeChange = false;
    modeBtn.innerText = 'Fill';
    canvas.removeEventListener('click', onFillCanvas);
  } else {
    modeChange = true;
    modeBtn.innerText = 'Stroke';
    canvas.addEventListener('click', onFillCanvas);
  }
}

function onFillCanvas() {
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onColorChange(event) {
  const newColor = event.target.value;
  ctx.fillStyle = newColor;
  ctx.strokeStyle = newColor;
}

function onColorOptionChange(item) {
  item.addEventListener('click', function (event) {
    color.value = event.target.dataset.color;
    ctx.fillStyle = color.value;
    ctx.strokeStyle = color.value;
  });
}

function onRangeChange(event) {
  ctx.lineWidth = event.target.value;
}

function onEraserMode() {
  modeChange = false;
  modeBtn.innerText = 'Fill';
  canvas.removeEventListener('click', onFillCanvas);
  ctx.strokeStyle = '#ffffff';
  color.value = ctx.strokeStyle;
}

function onDestroy() {
  modeChange = true;
  modeBtn.innerText = 'Stroke';
  canvas.addEventListener('click', onFillCanvas);
  ctx.fillStyle = '#ffffff';
  color.value = ctx.fillStyle;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onFileInput(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, 800, 800);
    fileInput.value = '';
  };
}

function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== '') {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = '68px serif';
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}

function onSaveImage() {
  const url = canvas.toDataURL();
  console.log(url);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Image.png';
  a.click();
}

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onPainting);
canvas.addEventListener('mouseup', offPainting);
canvas.addEventListener('mouseleave', offPainting);
canvas.addEventListener('dblclick', onDoubleClick);

modeBtn.addEventListener('click', onModeChange);

color.addEventListener('change', onColorChange);

colorOption.forEach(onColorOptionChange);

range.addEventListener('change', onRangeChange);

eraser.addEventListener('click', onEraserMode);

destroy.addEventListener('click', onDestroy);

fileInput.addEventListener('change', onFileInput);

save.addEventListener('click', onSaveImage);
