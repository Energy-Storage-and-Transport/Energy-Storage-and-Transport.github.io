function setLinks() {
    setLink('poster', "https://canvas.tue.nl/courses/24022/assignments/118571");
    setLink('report', "https://canvas.tue.nl/courses/24022/assignments/118573");
    setLink('presentation', "https://canvas.tue.nl/courses/24022/assignments/118572");
    setLink('competition', "https://canvas.tue.nl/courses/24022/assignments/118569");
    setLink('gonogo', "https://canvas.tue.nl/courses/24022/assignments/118568");
}

function setLink(classname, url) {
    const selects = document.querySelectorAll('a.' + classname);
    selects.forEach((select) => { select.setAttribute("href", url) });
}