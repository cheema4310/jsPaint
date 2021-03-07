let canvas;
let c;
let savedImageData;
let dragging = false;
let strokeColor = "black";
let fillColor = "black";
let line_Width = 0;
let polygonSides = 6;
let currentTool = "pencil";

let usingBrush = false;
let brushXPoints = new Array();
let brushYPoints = new Array();
let brushDownPos = new Array();

let usingPencil = false;
let pencilXPoints = new Array();
let pencilYPoints = new Array();
let pencilDownPos = new Array();




class ShapedContainer{
    constructor(left, top, width, height){
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

class MouseDownPos {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class MouseCurrentPos {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class polygonPoint{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}



let shapedContainer = new ShapedContainer(0,0,0,0);
let mouseDown = new MouseDownPos(0,0);
let mouseLoc = new MouseCurrentPos(0,0);

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas(){
    canvas = document.getElementById("canvasId");
    c = canvas.getContext("2d");
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    c.strokeStyle = strokeColor;
    c.lineWidth = line_Width;
    

    canvas.addEventListener("mousedown", mouseDownFn);
    canvas.addEventListener("mousemove", mouseMoveFn);
    canvas.addEventListener("mouseup", mouseUpFn);
}


function changeTool(clickedTool){
    document.querySelector('.selected').classList.remove('selected');
    let selectedTool = document.getElementById(clickedTool);
    selectedTool.parentElement.classList.add("selected");

    currentTool = clickedTool;
}



// getting mousePosition 

// ***NOTE*** change CANVAS height and remove "10" below;

function getMousePosition(x,y){
    let canvasSizeData = canvas.getBoundingClientRect();
    return { x: (x-canvasSizeData.left)*(canvas.width/canvasSizeData.width),
        y: (y-canvasSizeData.left)*(canvas.height/canvasSizeData.height)+41
    }
    // let rect = canvas.getBoundingClientRect();
    // return {
    //     x: x - rect.left,
    //     y: y - rect.top
    // }
  
}

// saving image data

function saveCanvasImage(){
    savedImageData = c.getImageData(0,0,canvas.width,canvas.height);
}

// drawing again canvas 

function drawAgainCanvas(){
    c.putImageData(savedImageData, 0, 0);
}

// Update Rubberband Container Size Data class[ShapedContainer]

function updateContainerSizeDate(mouseLoc){
    shapedContainer.width = Math.abs(mouseLoc.x - mouseDown.x);
    shapedContainer.height = Math.abs(mouseLoc.y - mouseDown.y);

    // reverse left "x"
    if(mouseLoc.x > mouseDown.x){
        shapedContainer.left = mouseDown.x;
    } else {
        shapedContainer.left = mouseLoc.x;
    }

    // reverse top "y"
    if(mouseLoc.y > mouseDown.y){
        shapedContainer.top = mouseDown.y;
    } else {
        shapedContainer.top = mouseLoc.y;
    }

}



// Get Angle using x & y

// x = adjacent
// y = opposite
// Tan(θ) = adj / opp
// θ = tan−1 (adj/opp)

function getAngleUsingXandY(mouseLocX, mouseLocY){
    let adj = mouseDown.x - mouseLocX;
    let opp = mouseDown.y - mouseLocY;
    // ArcTan = Math.atan2
    return degreeToRadian(Math.atan2(opp, adj));
}

// Radians to Degrees

function radiansToDegree(rad){
    return (rad*(180/Math.PI)).toFixed(2);
}

// Degrees to Radians 

function degreeToRadian(deg){
    return (deg*(Math.PI/180));
}

// Polygon Points Fn getting the points

function getPolygonPoints() {
    let angle = getAngleUsingXandY(mouseLoc.x, mouseLoc.y);
    let radiusX = shapedContainer.width;
    let radiusY = shapedContainer.height;
    let polygonPoints = [];

    // X = mouseLoc.x + radiusX*sin(angle);
    // Y = mouseLoc.y - radiusY*cos(angle);

    for(let i = 0; i<polygonSides; i++){
        polygonPoints.push(new polygonPoint(mouseLoc.x + radiusX * Math.sin(angle)
        ,mouseLoc.y - radiusY * Math.cos(angle)));
        angle += 2 * Math.PI / polygonSides;
    }
    return polygonPoints;
}
// get polygon Fn
function getPolygon(){
    let polygonPoints = getPolygonPoints();
    c.beginPath();
    c.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    for(let i = 0; i < polygonSides; i++){
        c.lineTo(polygonPoints[i].x, polygonPoints[i].y);
    }
    c.closePath();
}

// Updating container Size on MouseMove

function updateContainerOnMove(mouseLoc){
    updateContainerSizeDate(mouseLoc);
    drawContainerShape(mouseLoc);
}

// Fn to Draw all the Shapes 

function drawContainerShape(mouseLoc) {
    c.strokeStyle = strokeColor;
    c.fillStyle = fillColor;

    // adding tools
    if(currentTool==="brush"){
        drawBrush();
    } else if(currentTool === "line"){
        c.beginPath();
        c.moveTo(mouseDown.x, mouseDown.y);
        c.lineTo(mouseLoc.x, mouseLoc.y);
        c.stroke();
    } else if(currentTool === "rectangle"){
        c.strokeRect(shapedContainer.left, shapedContainer.top, shapedContainer.width, shapedContainer.height);
    } else if(currentTool === "circle"){
        
        let circleRadius = shapedContainer.width;
        
        c.beginPath();
        c.arc(mouseDown.x, mouseDown.y, circleRadius, 0, Math.PI*2);
        c.stroke();
    } else if(currentTool === "ellipse"){
        let radiusX = shapedContainer.width / 2;
        let radiusY = shapedContainer.height / 2;
        c.beginPath();
        c.ellipse(mouseDown.x, mouseDown.y, radiusX, radiusY, Math.PI / 4, 0, Math.PI*2);
        c.stroke();
    } else if(currentTool === "polygon"){
        getPolygon();
        c.stroke();
    } else if(currentTool === "pencil"){
        drawPencil();
    }

    
    

}

// adding brushPoints

function addBrushPoint(x,y, mouseDown){
    brushXPoints.push(x);
    brushYPoints.push(y);
    brushDownPos.push(mouseDown);
}
// drawing Brush
function drawBrush() {
    for(let i = 1; i<brushXPoints.length; i++){
        c.beginPath();
        if(brushDownPos[i]){
            c.moveTo(brushXPoints[i-1], brushYPoints[i-1]);
        } else {
            c.moveTo(brushXPoints[i]-1, brushYPoints[i]);
        }
        c.lineTo(brushXPoints[i], brushYPoints[i]);
        c.lineTo(brushXPoints[i]+1, brushYPoints[i]+1);
        c.lineTo(brushXPoints[i]-1, brushYPoints[i]-1);
        c.lineTo(brushXPoints[i], brushYPoints[i]);
        c.lineTo(brushXPoints[i]+2, brushYPoints[i]+2);

        c.lineTo(brushXPoints[i]-2, brushYPoints[i]-2);
        c.lineTo(brushXPoints[i], brushYPoints[i]);
        c.lineTo(brushXPoints[i]+3, brushYPoints[i]+3);
        c.lineTo(brushXPoints[i]-3, brushYPoints[i]-3);
        c.lineTo(brushXPoints[i], brushYPoints[i]);
    
        c.closePath();
        c.stroke();
    }
}

// adding Pencil Points X, Y

function addPencilPoint(x,y, mouseDown){
    pencilXPoints.push(x);
    pencilYPoints.push(y);
    pencilDownPos.push(mouseDown);
}

function drawPencil() {
    for(let i = 1; i<pencilXPoints.length; i++){
        c.beginPath();
        if(pencilDownPos[i]){
            c.moveTo(pencilXPoints[i-1], pencilYPoints[i-1]);
        } else {
            c.moveTo(pencilXPoints[i], pencilYPoints[i]);
        }
        c.lineTo(pencilXPoints[i], pencilYPoints[i]);
        c.lineTo(pencilXPoints[i+1], pencilYPoints[i+1]);
    
        c.closePath();
        c.stroke();
    }
}






// React to mouseDownFn

function mouseDownFn(e){
    canvas.style.cursor = "crosshair";
    mouseLoc = getMousePosition(e.clientX, e.clientY);
    saveCanvasImage();
    mouseDown.x = mouseLoc.x;
    mouseDown.y = mouseLoc.y;
    dragging = true;

    // Handle "brush" here

    if(currentTool === "brush"){
        usingBrush = true;
        addBrushPoint(mouseLoc.x, mouseLoc.y);
    }

    // // handle pencil here
    
    if(currentTool === "pencil"){
        usingPencil = true;
        addPencilPoint(mouseLoc.x, mouseLoc.y);
    }

}


// React to mouseMove

function mouseMoveFn(e){
    canvas.style.cursor = "crosshair";
    mouseLoc = getMousePosition(e.clientX, e.clientY);


    // Handle "brush" here
    if(currentTool === "brush" && dragging && usingBrush){
        if(mouseLoc.x>0 && mouseLoc.x < canvas.width && mouseLoc.y>0 && mouseLoc.y<canvas.height){
            addBrushPoint(mouseLoc.x,mouseLoc.y);
        }
        drawAgainCanvas();
        drawBrush();
        
    } else if(currentTool==="pencil" && dragging && usingPencil){
        if(mouseLoc.x>0 && mouseLoc.x < canvas.width && mouseLoc.y>0 && mouseLoc.y<canvas.height){
            addPencilPoint(mouseLoc.x,mouseLoc.y);
        }
        drawAgainCanvas();
        drawPencil();
    } else {
        if(dragging){
            drawAgainCanvas();
            updateContainerOnMove(mouseLoc);
        }
    }

    

    
   

}


// React to mouseUp
function mouseUpFn(e){
    canvas.style.cursor = "default";
    mouseLoc = getMousePosition(e.clientX, e.clientY);
    drawAgainCanvas();
    // later
    updateContainerOnMove(mouseLoc);
    dragging = false;
    usingBrush = false;
    usingPencil = false;

}

// Save Image

function saveImage(){
    let imgFile = document.getElementById('imgDownload');
    imgFile.setAttribute('download', 'image.png');
    imgFile.setAttribute('href', canvas.toDataURL())

}



// Open Image

function openImage(){
    let img = new Image();
    img.onload = function(){
        c.clearRect(0,0,canvas.width, canvas.height);
        c.drawImage(img, 0, 0);
    }
    img.src = 'img.png';
}