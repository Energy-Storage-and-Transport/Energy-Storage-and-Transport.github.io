const COURSE_ID = "31139";

const ASSIGNMENT_IDS = {
    home:              undefined,
    gonogo:            "153956",
    poster:            "153962",
    sopfeedback:       "153965",
    report:            "153968",
    presentation:      "153967",
    competition:       "153958",
    practical:         "153963",
    measurementtheory: "153966",
    interimstep1:      "153959",
    finalstep1:        "153954"
};

function setLinks() {
    const base = `https://canvas.tue.nl/courses/${COURSE_ID}`;

    for (const [name, id] of Object.entries(ASSIGNMENT_IDS)) {
        if (id === undefined){
          setLink(name, base);
        } else {    
          setLink(name, `${base}/assignments/${id}`);
        }
    }

    setLink('contact',    `${base}/pages/homepage/#contact`);
    setLink('infoskills', `${base}/pages/professional-skills-information-literacy-basics-for-me-students-only`);
    setLink('github',     "https://github.com/Energy-Storage-and-Transport/EST-model");
    setLink('githubdocs', "https://github.com/Energy-Storage-and-Transport/EST-model/#readme");
}

function setLink(classname, url) {
    const selects = document.querySelectorAll('a.' + classname);
    selects.forEach((select) => {
        select.setAttribute("href", url);
        select.setAttribute("target", "_blank");
        select.setAttribute("rel", "noopener noreferrer");
    });
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