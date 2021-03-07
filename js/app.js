let canvas = document.getElementById("canvasId");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");



// mousemove start drawing with pen 

// let drawing = false;

//     function startDrawing(e){
//         drawing = true;
//         draw(e);
//     }

//     function endDrawing(){
//         drawing = false;
//         c.beginPath();
//     }

//     function draw(e){


//         if(!drawing) return;

//         c.lineWidth = 3;
//         c.lineCap = "round";
//         c.lineTo(e.clientX, e.clientY);
//         c.stroke();
//         c.beginPath();
//         c.moveTo(e.clientX, e.clientY);
//     }


//     // add event listeners

// canvas.addEventListener("mousedown", startDrawing);
// canvas.addEventListener("mouseup", endDrawing);
// canvas.addEventListener("mousemove", draw);



// // button to upload image

// // get popUp window
// let popupWindow = document.getElementById("popupWindow");

// // Get the button that upload image
// let imageBtn = document.getElementById("imageBtn");

// // Get the <span> element that closes the Popup Window
// let closePopup = document.getElementById("closePopup");

// // When the user clicks the button, open the Dialog Box 
// imageBtn.onclick = function() {
//   popupWindow.style.display = "block";
// }

// // When the user clicks on <span> (x), close the Popup Window / Dialog Box
// closePopup.onclick = function() {
//   popupWindow.style.display = "none";
//   outputImage.style.display = "none";
// }

// // When the user clicks anywhere outside of the Dialog Box, close it
// window.onclick = function(event) {
//   if (event.target == popupWindow) {
//     popupWindow.style.display = "none";
//     outputImage.style.display = "none";
//   }
// }




// let inputImage = document.getElementById("inputImage");

// let outputImage = document.getElementById('output');

// inputImage.addEventListener("change", (e)=>{
    
//     const reader = new FileReader();
//     reader.addEventListener("load", ()=> {
//         sessionStorage.setItem("new-image", reader.result);

//         let btnToggle = document.createElement("button");

//     })


//     reader.readAsDataURL(e.target.files[0]);
//     outputImage.src = URL.createObjectURL(e.target.files[0]);
//     outputImage.style.display = "block";
// })


// var loadFile = function(event) {
// 	var image = document.getElementById('output');
// 	image.src = URL.createObjectURL(event.target.files[0]);
// }


