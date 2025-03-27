// Variables
let blockWidth = null;
let blockHeight = null;
let hSpace = null;
let vSpace = null;
let vPadding = null;
let activeBlock = null;
let blocks = {};
let cards = {};
let connectors = {};

// Constants
const fontSize = 18;
const textPadding = 10;
const strokeWidth = 3;
const strokeColors = {
    "S" : "#c86419ff", // System
    "M" : "#19c819ff", // Model
    "E" : "#1919c8ff", // Experiment
    "C" : "#c81919ff"  // Course
};
const fillColors = {
    "S" : "#c8641980",
    "M" : "#19c81980",
    "E" : "#1919c880",
    "C" : "#c8191980"
};

// Get the container and canvas elements
const container = document.getElementsByClassName('stage1-container')[0];
const canvas = new fabric.Canvas('stage1Flowchart', { 
    selection: false, // Disable box selection
    allowTouchScrolling: true // Enable touch scrolling
});

// Create a task block
function createBlock(blockData) {
    // Create the block
    const block = new fabric.Rect({
        left: 0,
        top: 0,
        fill: fillColors[blockData.id[0]],
        width: blockWidth,
        height: blockHeight,
        stroke: strokeColors[blockData.id[0]],
        strokeWidth: strokeWidth,
        selectable: false
    });

    // Create the text
    const text = new fabric.Textbox(blockData.title, {
        left: blockWidth / 2,
        top: blockHeight / 2,
        width: blockWidth,
        fill: 'white',
        fontSize: fontSize,
        fontFamily: 'Verdana',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        selectable: false
    });

    // Group the block and its text
    const group = new fabric.Group([block, text], {
        left: blockData.col*blockWidth + (blockData.col+1)*hSpace,
        top: blockData.row*blockHeight + blockData.row*vSpace + vPadding,
        selectable: false,
        hoverCursor: 'default'
    });

    // Add hover effect for the group
    group.id = blockData.id;
    group.toObject(["id"]);

    group.on('mouseover', () => {
        group.item(0).set('fill', strokeColors[group.id[0]]);
        draw();
        group.item(0).set('fill', fillColors[group.id[0]]);
    });

    group.on('mouseout', () => {
        draw();
    });

    group.on('mousedown', () => {
        activeBlock = group.id;
        draw();
    });

    return group;
}

// Create a task card
function createCard(blockData) {
    // Card dimensions
    const cardWidth = 3 * blockWidth + 2 * hSpace;
    const cardLeft = hSpace;
    const cardTop = blockData.row*blockHeight + blockData.row*vSpace + vPadding; // Initial top position

    // Create the title text
    const title = new fabric.Textbox(blockData.title, {
        left: cardLeft + textPadding,
        top: cardTop,
        width: cardWidth - 2*textPadding,
        fontSize: fontSize,
        fontFamily: 'Verdana',
        fill: 'white',
        textAlign: 'left',
        selectable: false,
        hoverCursor: 'default'
    });

    // Dynamically calculate the header height based on the title height
    const headerHeight = title.height + textPadding; // Add padding for the header

    // Create the card background
    const card = new fabric.Rect({
        left: cardLeft,
        top: cardTop,
        width: cardWidth,
        height: 0, // Temporary height, will be updated later
        fill: 'white',
        stroke: strokeColors[blockData.id[0]],
        strokeWidth: strokeWidth,
        selectable: false,
        hoverCursor: 'default'
    });

    // Create the header bar
    const header = new fabric.Rect({
        left: cardLeft,
        top: cardTop,
        width: cardWidth,
        height: headerHeight,
        fill: strokeColors[blockData.id[0]],
        selectable: false,
        hoverCursor: 'default'
    });

    // Adjust the title position to center it vertically in the header
    title.set('top', cardTop + headerHeight / 2 - title.height / 2);

    // Add the "close card" icon
    const closeIcon = new fabric.Text('✕', {
        left: cardLeft + cardWidth - 3*textPadding,
        top: cardTop + headerHeight / 2 - fontSize / 2,
        fontSize: fontSize,
        fontFamily: 'Verdana',
        fill: 'white',
        selectable: false,
        hoverCursor: 'pointer',
        fontWeight: 'bold'
    });

    // Add event listener for the closeIcon
    closeIcon.on('mousedown', (event) => {
        activeBlock = null; // Reset activeBlock
        draw(); // Redraw the canvas
    });

    // Add the main content (description and links)
    const textSize = fontSize - 2;
    const content = new fabric.Textbox(blockData.description + '\n\nLinks:', {
        left: cardLeft + textPadding,
        top: cardTop + headerHeight + textPadding,
        width: cardWidth - 2*textPadding,
        fontSize: textSize,
        fontFamily: 'Verdana',
        fill: '#000000',
        textAlign: 'left',
        selectable: false,
        hoverCursor: 'default'
    });

    // Add the links as clickable text
    let linkStartTop = content.top + content.height + textPadding; // Start position for links
    const linkElements = blockData.links.map((link, index) => {
        // Create the bullet as a separate text object
        const bullet = new fabric.Text('•', {
            left: cardLeft + textPadding,
            top: linkStartTop,
            fontSize: textSize,
            fontFamily: 'Verdana',
            fill: 'black',
            textAlign: 'left',
            selectable: false,
            hoverCursor: 'default'
        });

        // Create the link text with underline
        const linkText = new fabric.Textbox(link[0], {
            left: cardLeft + 2.5*textPadding,
            top: linkStartTop,
            width: cardWidth - 3.5*textPadding,
            fontSize: textSize,
            fontFamily: 'Verdana',
            fill: 'blue',
            textAlign: 'left',
            selectable: false,
            hoverCursor: 'pointer',
            underline: true
        });

        linkStartTop += linkText.height + 0.5*textPadding;

        // Add click event to open the link
        linkText.on('mousedown', () => {
            window.location.href = link[1]; // Open the link in the same window
        });

        return [bullet, linkText];
    });

    // Adjust the card height based on the content and links
    const linksHeight = linkStartTop - content.top - content.height - textPadding;
    const cardHeight = headerHeight + content.height + 2*textPadding + linksHeight;
    card.set('height', cardHeight);

    // Update the positions of header and content
    header.set('top', cardTop);
    content.set('top', cardTop + headerHeight + textPadding);

    // Shift the elements it needed
    elements = [card, header, title, closeIcon, content, ...linkElements.flat()];

    return elements;
}

// Update the cards
async function updateCards() {
    // Fetch block data from the JSON file
    await fetch('/data/flowchartData.json')
    .then(response => response.json())
    .then(data => {
        data['blocks'].forEach(blockData => {
            cards[blockData.id] = createCard(blockData);
        });
    })
    .catch(error => console.error('Error loading flowchart data:', error));
}

function createConnector(connectorData) {

    let fromBlock = connectorData.from ? blocks[connectorData.from] : undefined;
    let toBlock = connectorData.to ? blocks[connectorData.to] : undefined;
    let fromOffset = connectorData.fromOffset ?? 0;
    let toOffset = connectorData.toOffset ?? 0;
    let type = connectorData.type ?? "straight";
    let fromSide = connectorData.fromSide ?? "bottom";
    let toSide = connectorData.toSide ?? "top";

    let from = null;
    if(!fromBlock){
        from = {
            x: toBlock.left + blockWidth / 2 + fromOffset*hSpace,
            y: 0
        };        
    }else{
        if (fromSide === "bottom") {
            from = {
                x: fromBlock.left + blockWidth / 2 + fromOffset*hSpace,
                y: fromBlock.top + blockHeight
            };
        } else if (fromSide === "right") {
            from = {
                x: fromBlock.left + blockWidth,
                y: fromBlock.top + blockHeight / 2 + fromOffset*hSpace
            };
        } else {
            console.error(`Unknown side: ${fromSide}`);
            return null;
        }
    }

    let to = null;
    if(!toBlock){
        to = {
            x: fromBlock.left + blockWidth / 2 + fromOffset*hSpace,
            y: getCanvasHeight()
        };        
    }else{
        if (toSide === "top") {
            to = {
                x: toBlock.left + blockWidth / 2 + toOffset*hSpace,
                y: toBlock.top
            };
        } else if (toSide === "left") {
            to = {
                x: toBlock.left,
                y: toBlock.top + blockHeight / 2 + toOffset*hSpace
            };
        } else {
            console.error(`Unknown side: ${toSide}`);
            return null;
        }
    }

    const mid = {
        x: (from.x + to.x) / 2,
        y: (from.y + to.y) / 2
    };

    // Define the path for the arrow
    let path;
    let angle;
    if (type === "straight") {
        path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
        angle = Math.atan2(to.y - from.y, to.x - from.x);
    } else if (type === "zigzag") {
        path = `M ${from.x} ${from.y} L ${from.x} ${mid.y} L ${to.x} ${mid.y} L ${to.x} ${to.y}`;
        angle = Math.atan2(to.y - mid.y, to.x - to.x);
    } else {
        console.error(`Unknown arrow type: ${type}`);
        return null;
    }

    // Add an arrowhead to the path
    const arrowHeadSize = hSpace/2;
    const arrowHead = [
        {
            x: to.x - arrowHeadSize * Math.cos(angle - Math.PI / 6),
            y: to.y - arrowHeadSize * Math.sin(angle - Math.PI / 6)
        },
        {
            x: to.x,
            y: to.y
        },
        {
            x: to.x - arrowHeadSize * Math.cos(angle + Math.PI / 6),
            y: to.y - arrowHeadSize * Math.sin(angle + Math.PI / 6)
        }
    ];
    path += ` M ${arrowHead[0].x} ${arrowHead[0].y} L ${arrowHead[1].x} ${arrowHead[1].y} L ${arrowHead[2].x} ${arrowHead[2].y} Z`;

    // Create the fabric.Path object
    const arrow = new fabric.Path(path, {
        fill: "transparent",
        stroke: fromBlock ? strokeColors[fromBlock.id[0]] : strokeColors["C"],
        strokeWidth: strokeWidth,
        selectable: false,
        hoverCursor: "default"
    });

    return arrow;
}

// Update the grid
async function updateGrid() {
    // Fetch block data from the JSON file
    await fetch('/data/flowchartData.json')
    .then(response => response.json())
    .then(data => {
        data['blocks'].forEach(blockData => {
            blocks[blockData.id] = createBlock(blockData);
        });
        data['connectors'].forEach(connectorData => {
            connectors[connectorData.from + "-" + connectorData.to] = createConnector(connectorData);
        });
    })
    .catch(error => console.error('Error loading flowchart data:', error));
}

// Get the canvas height
function getCanvasHeight() {
    let height = 0;
    Object.entries(blocks).forEach(([id, block]) => {
        if (id.split('.')[0].endsWith('1')) {
            height = Math.max(height, block.top + block.height + vPadding);
        }
    });
    return height;
}

// Draw the canvas
function draw() {
    // Clear the canvas
    canvas.clear();

    // Reset the height of the canvas
    const canvasHeight = getCanvasHeight();
    console.log(canvasHeight);
    if(canvasHeight != canvas.height){
        canvas.setHeight(canvasHeight);
    }
    
    // Add all elements
    canvas.add(...Object.values(connectors));
    canvas.add(...Object.values(blocks));
    if (activeBlock) {
        canvas.add(...cards[activeBlock]);
        const overflow = cards[activeBlock][0].top + cards[activeBlock][0].height + strokeWidth - canvas.height;
        if (overflow > 0) {
            canvas.setHeight(canvas.height + overflow + vPadding);
        }
    }

    // Render all elements
    canvas.renderAll();    
}

// Function to set canvas dimensions to match the container
async function updateCanvas() {

    canvas.setWidth(container.clientWidth);

    // Set the grid dimensions
    blockWidth  = 0.3*canvas.width;
    blockHeight = 0.6*blockWidth;
    hSpace = 0.025*canvas.width;
    vSpace = 4*hSpace;
    vPadding = 2*hSpace;

    // Update the grid
    await updateGrid();
    await updateCards();
}

// Initial canvas size setup
async function initializeCanvas() {
    await updateCanvas();
    draw();
}

initializeCanvas(); // Call the async initialization function

// Add event listener for window resize
window.addEventListener('resize', initializeCanvas);