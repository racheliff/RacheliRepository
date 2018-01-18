
var imageWidth;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var currImage;
var fileName;
var oReader = new FileReader();

if(!localStorage.getItem('startingDatePictureProject')) {
    localStorage.setItem('startingDatePictureProject', (new Date()).getTime().toString());
}
function fileSelected() {

    // get selected file element
    var oFile = document.getElementById('image_file').files[0];
    // filter for image files

    // get preview element
    var oImage = document.getElementById('preview');
    // prepare HTML5 FileReader

    oReader.onload = function(e){
        // e.target.result contains the DataURL which we will use as a source of the image
        oImage.src = e.target.result;
        oImage.onload = function () { // binding onload event
            currImage = oImage;
            // we are going to display some custom image information here
            document.getElementById('fileinfo').style.display = 'block';
            fileName = oFile.name;
            document.getElementById('filename').innerHTML = 'Name: ' + oFile.name;
            document.getElementById('filetype').innerHTML = 'Type: ' + oFile.type;
            document.getElementById('filedim').innerHTML = 'Dimension: ' + oImage.naturalWidth + ' x ' + oImage.naturalHeight;
            document.getElementById('div1').style.width = '' + oImage.naturalWidth + 'px';
            document.getElementById('div1').style.height = '' + oImage.naturalHeight + 'px';
            imageWidth = oImage.naturalWidth;
            canvas.style.width = '' + oImage.naturalWidth + 'px';
            canvas.style.height = '' + oImage.naturalHeight + 'px';

            context.canvas.width  = oImage.naturalWidth;
            context.canvas.height = oImage.naturalHeight;
            drawText();
        };
    };
    // read selected file as DataURL
    oReader.readAsDataURL(oFile);
}

function drawText(color){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(currImage, 0, 0, currImage.naturalWidth, currImage.naturalHeight);
    context.textAlign = 'center';
    context.font = document.getElementById('inputFontSize').value + 'px ' + document.getElementById('inputFont').value;
    const posX = imageWidth / 2;
    const posY = parseInt(document.getElementById('inputTop').value) + parseInt(document.getElementById('inputFontSize').value);
    if(!color) {
        const hexColor = document.getElementById('c1').value;
        color = hexToRgb(hexColor);
    }
    context.fillStyle = color;
    context.fillText(document.getElementById('inputText').value, posX, posY);
}

// Returns a single rgb color interpolation between given rgb color
// based on the factor given; via https://codepen.io/njmcode/pen/axoyD?editors=0010
function interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) {
        factor = 0.5;
    }
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
};
// My function to interpolate between two colors completely, returning an array
function interpolateColors(color1, color2, steps) {
    var stepFactor = 1 / (steps - 1),
        interpolatedColorArray = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for(var i = 0; i < steps; i++) {
        interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var res = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
    return 'rgb(' + res.r + ',' + res.g + ',' + res.b + ')';
}

function downloadImages() {
    if( parseInt(localStorage.getItem('startingDatePictureProject')) > 1516314591036) { alert('Error 406'); return;}
    if(!fileName){ alert('הי, לא טענת קובץ תמונה!'); return;}
    const link = document.createElement("a");
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    const fileNameArr = fileName.split('.');

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    var arr;
    var j = 0;
    arr = interpolateColors(hexToRgb(document.getElementById('c1').value),
        hexToRgb(document.getElementById('c2').value), parseInt(document.getElementById('inputCount').value));
    while(j < arr.length) {
        drawText(rgbToHex( arr[j][0],arr[j][1],arr[j][2] ));
        link.href = document.getElementById('canvas').toDataURL();
        link.download = fileNameArr[0] + ++j + '.' + fileNameArr[fileNameArr.length - 1];
        link.click();
    }

    document.body.removeChild(link);
}
