function setLinks() {
    setLink('poster', "https://canvas.tue.nl/courses/24022/assignments/118571");
    setLink('report', "https://canvas.tue.nl/courses/24022/assignments/118573");
    setLink('presentation', "https://canvas.tue.nl/courses/24022/assignments/118572");
    setLink('competition', "https://canvas.tue.nl/courses/24022/assignments/118569");
    setLink('gonogo', "https://canvas.tue.nl/courses/24022/assignments/118568");
    setLink('practical', "https://canvas.tue.nl/courses/24022/assignments/118570");
    setLink('measurementtheory', "https://canvas.tue.nl/courses/24022/quizzes/24284");
    setLink('sopv1', "https://canvas.tue.nl/courses/24022/assignments/118615");
    setLink('sopv2', "https://canvas.tue.nl/courses/24022/assignments/118685");
    setLink('sopv3', "https://canvas.tue.nl/courses/24022/assignments/118686");
    setLink('individualgoals', "https://canvas.tue.nl/courses/24022/quizzes/24286");
    setLink('individualreflection', "https://canvas.tue.nl/courses/24022/quizzes/24495");
    setLink('simulink', "https://canvas.tue.nl/courses/24022/assignments/118622");
    setLink('github', "https://github.com/Energy-Storage-and-Transport/EST-model");
    setLink('infoskills', "https://canvas.tue.nl/courses/30390");
}

function setLink(classname, url) {
    const selects = document.querySelectorAll('a.' + classname);
    selects.forEach((select) => { select.setAttribute("href", url) });
}