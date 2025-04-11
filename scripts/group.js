// Load the teams data
var request = new XMLHttpRequest();
request.open("GET", "data/Teams.json", false);
request.send(null);
const groupInfo = JSON.parse(request.responseText);
const groupKeys = Object.keys(groupInfo);

// Change the group (called when selector is changed)
function changeGroup() {
  let oldgroup = getCookie("group");
  let newgroup = -1;

  const selects = document.querySelectorAll('select[name="group"]');
  selects.forEach((select) => {
    if (select.value > -1 && select.value != oldgroup){
      newgroup = select.value;
    }
  });
  setCookie("group", newgroup, 100);
  setTeamData(newgroup);
}

function setTeamData(team){

  // Set selectors
  const selects = document.querySelectorAll('select[name="group"]');
  selects.forEach((select) => { select.value = team; });

  // Set the supply and demand data
  setTeamFiles(team);

  // Set the team schedule
  setTeamSchedule(team);
}

function setTeamFiles(team){
  
  const table = document.getElementById("supplyanddemandtable");
  if(table==null){
    return;
  }

  // Hide the table if team == -1
  if(team==-1){
      table.style.display = "none";
      return;
  }

  // Show the table if a team is selected
  table.style.display = "table";

  supplyObject = document.querySelector('#supplydescription');
  if (supplyObject === null){ return; }

  demandObject = document.querySelector('#demanddescription');
  if (demandObject === null){ return; }

  // Supply and demand table
  supplyObject.innerHTML = groupInfo[groupKeys[team]]["supplyInfo"];
  demandObject.innerHTML = groupInfo[groupKeys[team]]["demandInfo"];

  var supplyLink = document.createElement('a');
  supplyLink.setAttribute('href', 'data/' + groupInfo[groupKeys[team]]["supplyFile"]);
  supplyLink.setAttribute('download', groupInfo[groupKeys[team]]["supplyFile"]);
  supplyLink.innerHTML = groupInfo[groupKeys[team]]["supplyFile"];

  let supplyFile = document.querySelector('#supplyfile');
  supplyFile.replaceChild(supplyLink, supplyFile.childNodes[0]);

  var demandLink = document.createElement('a');
  demandLink.setAttribute('href', 'data/' + groupInfo[groupKeys[team]]["demandFile"]);
  demandLink.setAttribute('download', groupInfo[groupKeys[team]]["demandFile"]);
  demandLink.innerHTML = groupInfo[groupKeys[team]]["demandFile"];

  let demandFile = document.querySelector('#demandfile');
  demandFile.replaceChild(demandLink, demandFile.childNodes[0]);
}

async function setTeamSchedule(team){

  const table = document.getElementById("activities");
  if(table==null){
    return;
  }  

  // Hide the table if team == -1
  if(team==-1){
      table.style.display = "none";
      return;
  }

  // Show the table if a team is selected
  table.style.display = "table";

  // Remove all rows except the first (header row)
  while (table.rows.length > 1) {
      table.deleteRow(1);
  }

  activity_names = {
    "Opening lecture": "Opening lecture",
    "Tutor-supervised meeting": "Tutor-supervised meeting",
    "Lab session": "SIM/zone meeting",
    "Measurement practical": "Measurement practical",
    "Technical briefing (presentation)": "Presentation",
    "Closure lecture": "Closure lecture",
    "Individual assessment": "Evaluation"
  };

  // Load the Excel schedule
  let [schedule, activities] = await readExcelSchedule("data/Schedule2425.xlsx");
  schedule = schedule.filter(r=>r.Groups.includes(parseInt(groupKeys[team])));

  for (const [activity_key, activity_name] of Object.entries(activity_names)) {
    let filtered_schedule = schedule.filter(r=>(r.Activity==activity_name));
    for(let i=0; i<filtered_schedule.length; i++){
      let activity = filtered_schedule[i];

      // Create a new row
      let row = table.insertRow();

      // Activity name
      if(i==0){
        let cell = row.insertCell();
        cell.setAttribute("rowspan", filtered_schedule.length);
        cell.innerHTML = activity_key;
        firstEntry = false;
      }
      
      // Weeks
      cell = row.insertCell();
      cell.innerHTML = activity.Weeks;

      // Slot
      cell = row.insertCell();
      cell.innerHTML = activity.Slot;

      // Rooms
      let rooms = activity.Rooms.split(',').map(room => room.trim());
      let group = activity.Groups.indexOf(parseInt(groupKeys[team]));
      let groups_per_room = activity.Groups.length / rooms.length;
      let group_rooms = Math.floor(group / groups_per_room);

      cell = row.insertCell();
      cell.innerHTML = rooms[group_rooms];
    }
  }
}

function initGroups() {
  const selects = document.querySelectorAll('select[name="group"]');
  selects.forEach((select) => {
    for (let i = 0; i < groupKeys.length; i++) {
      let newOption = new Option('Team ' + groupKeys[i].padStart(2, '0'), i);
      select.add(newOption,undefined);
    }
  });
  setTeamData(getCookie("group"));
}

function groupCompare(a, b){
  for(let i=0; i<Math.min(a["Groups"].length, b["Groups"].length); i++){
    if(a["Groups"][i]!=b["Groups"][i]){
      return a["Groups"][i]-b["Groups"][i];
    }
  }

  if(a["Groups"].length!=b["Groups"].length){
    return a["Groups"].length-b["Groups"].length;
  };
}

// function slotCompare(a, b){

//   const weekDays = {"monday":1, "tuesday":2, "wednesday":3, "thursday":4, "friday":5};
//   let daya = weekDays[a["Slot"].split(' ')[0].trim().toLowerCase()];
//   let dayb = weekDays[b["Slot"].split(' ')[0].trim().toLowerCase()];

//   if(daya!=dayb){
//     return daya-dayb;
//   }

//   let timea = a["Slot"].split(' ')[1].trim();
//   let houra = parseInt(timea.split(':')[0].trim());
//   let timeb = b["Slot"].split(' ')[1].trim();
//   let hourb = parseInt(timeb.split(':')[0].trim());

//   if(houra!=hourb){
//     return houra-hourb;
//   }
  
//   let mina  = parseInt(timea.split(':')[1].trim());
//   let minb  = parseInt(timeb.split(':')[1].trim());

//   return mina-minb;
// }

function groupsString(groups){
  let groupsets = [];
  let groupset = [];
  for(group of groups){
    if(groupset.length==0 || groupset[groupset.length-1]==group-1)
    {
      groupset.push(group)
    }
    else
    {
      groupsets.push(groupset);
      groupset = [group];
    }
  }
  groupsets.push(groupset);

  let strings = [];
  for( groupset of groupsets)
  {
    let first = groupset[0];
    let last  = groupset[groupset.length-1];

    if(last-first==0)
    {
      strings.push(first.toString());
    }
    else if(last-first==1)
    {
      strings.push(first.toString());
      strings.push(last.toString());
    }
    else
    {
      strings.push(first.toString() + '-' + last.toString());
    }
  }
  return strings.join(',');
}

async function fillScheduleTables(fname) {
  // Load the Excel schedule
  let [schedule, activities] = await readExcelSchedule(fname);

  // Loop over the tables for the different activities
  let tables = document.getElementsByTagName("table");
  for(table of tables){
    activity = table.getAttribute('id');
    if(activity=="activities"){
      continue;
    }

    if(!activities.includes(activity)){ 
      console.warn(activity + " not found in Excel file");
      continue;
    }

    // Filter the schedule for the specific activity
    activity_schedule = schedule.filter(row=>(row["Activity"]==activity))
    // activity_schedule.sort(slotCompare);
    activity_schedule.sort(groupCompare);

    // Add rows to the table
    for(session of activity_schedule){
      addSessionToTable(table, session)
    }
  }
}

function addSessionToTable(table, session){
  var row = document.createElement("tr");

  // Groups
  let lastGroupset = undefined;
  for(let i=table.rows.length-1; i>=0; i--){
      if(table.rows[i].cells.length==4){
        lastGroupset = table.rows[i].cells[0];
        break;
      }
  }

  var cell = document.createElement("td");
  let grp = groupsString(session["Groups"]);
  if(lastGroupset.innerHTML==grp){
    let rowspan = Number(lastGroupset.getAttribute("rowspan"));
    if(!rowspan){
      rowspan=2;
    }else{
      rowspan+=1;
    }
    lastGroupset.setAttribute("rowspan", rowspan);
  }else{
    var cellText = document.createTextNode(groupsString(session["Groups"]));
    cell.appendChild(cellText);
    row.appendChild(cell);
  }
  
  // Weeks
  var cell = document.createElement("td");
  if("Weeks" in session){
    var cellText = document.createTextNode(session["Weeks"]);
  } else {
    var cellText = document.createTextNode("-");
  }
  cell.appendChild(cellText);
  row.appendChild(cell);

  // Meeting time
  var cell = document.createElement("td");
  var cellText = document.createTextNode(session["Slot"]);
  cell.appendChild(cellText);
  row.appendChild(cell);
    
  // Locations
  var cell = document.createElement("td");
  var cellText = document.createTextNode(session["Rooms"]);
  cell.appendChild(cellText);
  row.appendChild(cell);

  table.appendChild(row);
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