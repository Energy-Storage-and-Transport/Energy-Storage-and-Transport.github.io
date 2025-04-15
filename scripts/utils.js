function setLinks() {
    setLink('gonogo', "https://canvas.tue.nl/courses/27554/assignments/135990");
    setLink('poster', "https://canvas.tue.nl/courses/27554/assignments/135993");
    setLink('sopv1', "https://canvas.tue.nl/courses/27554/assignments/135996");
    setLink('sopfeedback', "https://canvas.tue.nl/courses/27554/assignments/137810");
    setLink('sopfinal', "https://canvas.tue.nl/courses/27554/assignments/135997");
    setLink('report', "https://canvas.tue.nl/courses/27554/assignments/135999");
    setLink('presentation', "https://canvas.tue.nl/courses/27554/assignments/135998");
    setLink('competition', "https://canvas.tue.nl/courses/27554/assignments/135991");
    setLink('contact', "https://canvas.tue.nl/courses/27554/pages/homepage/#contact");
    setLink('practical', "https://canvas.tue.nl/courses/27554/assignments/135992");
    setLink('measurementtheory', "https://canvas.tue.nl/courses/27554/assignments/135398");
    setLink('github', "https://github.com/Energy-Storage-and-Transport/EST-model");
    setLink('githubdocs', "https://github.com/Energy-Storage-and-Transport/EST-model/#readme");
    setLink('infoskills', "https://canvas.tue.nl/courses/27554/pages/professional-skills-information-literacy-basics-for-me-students-only");
    setLink('interimstep1', "https://canvas.tue.nl/courses/27554/assignments/135754");
    setLink('interimstep2', "https://canvas.tue.nl/courses/27554/assignments/135755");
    setLink('finalstep1', "https://canvas.tue.nl/courses/27554/assignments/135855");
    setLink('finalstep2', "https://canvas.tue.nl/courses/27554/assignments/135856");
}



function setLink(classname, url) {
    const selects = document.querySelectorAll('a.' + classname);
    selects.forEach((select) => { select.setAttribute("href", url) });
}

//-----------------------------------//
// Cookies                           //
//-----------------------------------//

// Cookie to store group ID
function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return -1;
}