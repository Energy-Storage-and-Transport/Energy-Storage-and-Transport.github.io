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
    //setLink('specsheets', "https://canvas.tue.nl/courses/24022/pages/toolbox-specifications"); TODO: Replace link in index.html. Was not working when deployed on github.
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

//-----------------------------------//
// Read the XLSX schedule            //
//-----------------------------------//

async function readExcelSchedule(fname){

    // Read the Excel file
    const response = await fetch(fname);
    const file     = await response.arrayBuffer();
    const workbook = XLSX.read(file);

    // Get the activities
    const activities = XLSX.utils.sheet_to_json(workbook.Sheets["Activities"], {header: 1}).flat(1);

    // Get the groupsets
    const groups = XLSX.utils.sheet_to_json(workbook.Sheets["Groups"], {header: 1});

    let groupsets = {};
    let levels = ["EST", undefined, undefined, undefined, undefined, undefined];
    groupsets[levels[0]] = []
    for(row of groups){
        if(row.length==0){
            break;
        }

        group = row[0];
        groupsets['EST'].push(group);

        for(let level=1; level<levels.length; level++){
            let groupset = row[level];

            // Update of the group set label if required
            if(groupset!==undefined){
                levels[level]=groupset;
            }

            // Assign the group to the set
            if(levels[level] in groupsets){
                groupsets[levels[level]].push(group);
            }else{
                if(levels[level]===undefined){
                    console.error("Group label expected in the first row of the Excel groups worksheet.");
                }
                groupsets[levels[level]] = [group]; 
            }
        }
    }

    // Get the schedule
    const schedule = XLSX.utils.sheet_to_json(workbook.Sheets["Schedule"]);

    // Set the groups
    for(row of schedule){
        let label = row["Groups [1]"];
        
        if(row["Groups [2]"]!==undefined){
            label += "\\." + row["Groups [2]"];
        }else{
            label += "\\.?(I|II)?";
        }

        if(row["Groups [3]"]!==undefined){
            label += "\\." + row["Groups [3]"];
        }else{
            label += "\\.?(1|2)?";
        }

        if(row["Groups [4]"]!==undefined){
            label += " \\(" + row["Groups [4]"] + "\\)";
        }else{
            label += " ?(\\(odd\\)|\\(even\\))?";
        }

        if(row["Groups [5]"]!==undefined){
            label += " \\(" + row["Groups [5]"] + "\\)";
        }else{
            label += " ?(\\(presentation 1\\)|\\(presentation 2\\)|\\(presentation 3\\)|\\(presentation 4\\))?";
        }

        // Create the regular expression object
        const re = new RegExp(label);
        row["Groups"] = [];
        let matchedkeys = [];
        for (const [key, value] of Object.entries(groupsets)) {
            if(re.test(key)){
                let matched = false;
                for(matchedkey of matchedkeys){
                    if(key.startsWith(matchedkey)){
                        matched=true;
                        break;
                    }
                }
                if(!matched){
                    matchedkeys.push(key);
                    row["Groups"] = row["Groups"].concat(value);
                }
            }
        }
    }

    // Get the time slots
    const slots = Object.fromEntries(XLSX.utils.sheet_to_json(workbook.Sheets["Slots"], {header: 1}));
    
    // Set the slot
    for(row of schedule){
        row["Slot"] = row["Slot [day]"] + " " + slots[row["Slot [time]"]];
    }

    return [schedule, activities];
}