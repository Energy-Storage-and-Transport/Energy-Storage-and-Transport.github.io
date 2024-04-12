var slideIndex = {
  "infographic": 1,
  "toolbox": 1 
};

for(var classname in slideIndex) {
  showSlides(classname, slideIndex[classname]);
}

// Next/previous controls
function plusSlides(classname, n) {
  showSlides(classname, slideIndex[classname] += n);
}

// Thumbnail image controls
function currentSlide(classname, n) {
  showSlides(classname, slideIndex[classname] = n);
}

function showSlides(classname, n) {
  let i;
  console.log(classname);
  let slides = document.getElementsByClassName(classname + "slide");
  let dots = document.getElementsByClassName(classname + "dot");
  if (n > slides.length) {slideIndex[classname] = 1} 
  if (n < 1) {slideIndex[classname] = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"; 
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex[classname]-1].style.display = "block"; 
  dots[slideIndex[classname]-1].className += " active";
}