async function initToolboxes() {
    const selects = document.querySelectorAll('select[name="toolbox"]');
    const [toolboxes, components] = await readExcelComponents("data/components.xlsx");
    selects.forEach((select) => {
        // Read the Excel file
        for (let i = 0; i < toolboxes.length; i++) {
            let newOption = new Option(toolboxes[i], i);
            select.add(newOption,undefined);
        }
    });
    setToolboxData(getCookie("toolbox"));
}

// Change the toolbox (called when selector is changed)
function changeToolbox() {
    let oldtoolbox = getCookie("toolbox");
    let newtoolbox = -1;
  
    const selects = document.querySelectorAll('select[name="toolbox"]');
    selects.forEach((select) => {
      if (select.value > -1 && select.value != oldtoolbox){
        newtoolbox = select.value;
      }
    });
    setCookie("toolbox", newtoolbox, 100);
    setToolboxData(newtoolbox);
}

function setToolboxData(toolbox){

    // Set selectors
    const selects = document.querySelectorAll('select[name="toolbox"]');
    selects.forEach((select) => { select.value = toolbox; });
    
    fillToolboxTable(parseInt(toolbox));
}

async function fillToolboxTable(toolbox) {
    const table = document.getElementById("components");
    
    // Hide the table if toolbox == -1
    if(toolbox==-1){
        table.style.display = "none";
        return;
    }

    // Show the table if a valid toolbox is selected
    table.style.display = "table";

    // Remove all rows except the first (header row)
    while (table.rows.length > 1) {
        table.deleteRow(1); // Always delete the second row (index 1) until only the header remains
    }

    // Load the Excel inventory file
    const [toolboxes, components] = await readExcelComponents("data/components.xlsx");
    const cols = {0:10, 1:11, 2:12, 3:13};

    components.filter(r=>(r[cols[toolbox]]>0)).forEach((r) => {
        const row = table.insertRow();

        //Name
        let cell = row.insertCell();
        cell.innerHTML = r[0];

        //Description
        cell = row.insertCell();
        cell.innerHTML = r[1] ? r[1] : "-";

        //Specs
        cell = row.insertCell();
        if (r[2]) {
            let links = [];
            r[2].split(";").forEach((s) => {
                const [name, ref] = s.trim().slice(1, -1).split(",");
                const link = document.createElement("a");
                let url = ref.trim();
                if(url.startsWith("http")==false){
                    url = "data/components/" + url;
                }
                link.href = url;
                link.textContent = name.trim();
                link.target = "_blank";
                links.push(link);
            });
            
            // Append links to the cell, separated by commas
            links.forEach((link, index) => {
            cell.appendChild(link);
            if (index < links.length - 1) {
                cell.appendChild(document.createTextNode(", "));
            }
    });

        } else {
            cell.innerHTML = "-";
        }

        //Amount
        cell = row.insertCell();
        cell.innerHTML = r[cols[toolbox]];
    });
}

//-----------------------------------//
// Read the XLSX components file     //
//-----------------------------------//

async function readExcelComponents(fname){

    // Read the Excel file
    const response = await fetch(fname);
    const file     = await response.arrayBuffer();
    const workbook = XLSX.read(file);

    // Get the toolboxes
    const toolboxes = XLSX.utils.sheet_to_json(workbook.Sheets["Toolboxes"], {header: 1}).map(r => r[0]);
    const components = XLSX.utils.sheet_to_json(workbook.Sheets["Components"], {header: 1}).slice(1);

    return [toolboxes, components];
}