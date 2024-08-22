console.log("working...");

let greetimage = document.getElementById("greet");

document.addEventListener("DOMContentLoaded", function () {
    var greetings = ["assets/greetings/hey.png", "assets/greetings/hi.png", "assets/greetings/hiiii.png"]
    var sgr = Math.floor(Math.random() * greetings.length);
    var greet = greetings[sgr];
    greetimage.src = greet;
});