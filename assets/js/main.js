document.addEventListener("DOMContentLoaded", function () {
    var Images = ["assets/hi.png", "assets/hi2.png"];
    var Random = Math.floor(Math.random() * Images.length);
    var SelectedImage = Images[Random];
    var Image = document.getElementById("image");
    Image.src = SelectedImage;
});