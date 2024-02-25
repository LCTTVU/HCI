document.addEventListener("DOMContentLoaded", function() {
    var brightnessRange1 = document.getElementById("brightnessRange1");
    var image1 = document.getElementById("image1");
  
    var zoomRange2 = document.getElementById("zoomRange2");
    var image2 = document.getElementById("image2");

    var saturationRange3 = document.getElementById("saturationRange3");
    var image3 = document.getElementById("image3");

    var submitButton = document.getElementById("submitButton");
  
    brightnessRange1.addEventListener("input", function() {
      var brightnessValue = this.value;
      image1.style.filter = "brightness(" + brightnessValue + "%)";
    });
  
    zoomRange2.addEventListener("input", function() {
      var zoomValue = this.value;
      image2.style.transform = "scale(" + (zoomValue / 100) + ")";
    });

    saturationRange3.addEventListener("input", function() {
      var saturationValue3 = this.value;
      image3.style.filter = "saturate(" + saturationValue3 + "%)";
    });

    submitButton.addEventListener("click", function() {
      var brightnessValue1 = brightnessRange1.value;
      var zoomValue2 = zoomRange2.value;
      var saturationValue3 = saturationRange3.value;
      console.log("Brightness Value for Image 1:", brightnessValue1);
      console.log("Zoom Value for Image 2:", zoomValue2);
      console.log("Saturation Value for Image 3:", saturationValue3);
    });
  });
  
