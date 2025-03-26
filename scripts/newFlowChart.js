// Variables
let blockWidth = null;
let blockHeight = null;
let hSpace = null;
let vSpace = null;
let activeBlock = null;
let blocks = {};
let cards = {};
let connectors = {};

// Constants
const fontSize = 18;
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
const canvas = new fabric.Canvas('stage1Flowchart');

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
        strokeWidth: 3,
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
        top: blockData.row*blockHeight + blockData.row*vSpace + hSpace,
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
    const cardTop = blockData.row*blockHeight + blockData.row*vSpace + hSpace; // Initial top position

    // Create the title text
    const title = new fabric.Textbox(blockData.title, {
        left: cardLeft + 10,
        top: cardTop,
        width: cardWidth - 40, // Add some padding for the title width
        fontSize: fontSize,
        fontFamily: 'Verdana',
        fill: 'white',
        textAlign: 'left',
        selectable: false,
        hoverCursor: 'default'
    });

    // Dynamically calculate the header height based on the title height
    const headerHeight = title.height + 10; // Add padding for the header

    // Create the card background
    const card = new fabric.Rect({
        left: cardLeft,
        top: cardTop,
        width: cardWidth,
        height: 0, // Temporary height, will be updated later
        fill: 'white',
        stroke: strokeColors[blockData.id[0]],
        strokeWidth: 3,
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
    const closeIcon = new fabric.Text('✖', {
        left: cardLeft + cardWidth - 30,
        top: cardTop + headerHeight / 2 - fontSize / 2,
        fontSize: fontSize,
        fontFamily: 'Verdana',
        fill: 'white',
        selectable: false,
        hoverCursor: 'pointer'
    });

    // Add event listener for the closeIcon
    closeIcon.on('mousedown', (event) => {
        activeBlock = null; // Reset activeBlock
        draw(); // Redraw the canvas
    });

    // Add the main content (description and links)
    const content = new fabric.Textbox(blockData.description + '\n\nLinks:', {
        left: cardLeft + 10,
        top: cardTop + headerHeight + 10,
        width: cardWidth - 20,
        fontSize: fontSize - 2,
        fontFamily: 'Verdana',
        fill: '#000000',
        textAlign: 'left',
        selectable: false,
        hoverCursor: 'default'
    });

    // Add the links as clickable text
    const linkStartTop = content.top + content.height + 10; // Start position for links
    const linkElements = blockData.links.map((link, index) => {
        // Create the bullet as a separate text object
        const bullet = new fabric.Text('•', {
            left: cardLeft + 10,
            top: linkStartTop + index * (fontSize + 5), // Space between links
            fontSize: fontSize - 2,
            fontFamily: 'Verdana',
            fill: '#000000', // Black color for the bullet
            textAlign: 'left',
            selectable: false,
            hoverCursor: 'default'
        });

        // Create the link text with underline
        const linkText = new fabric.Text(link[0], {
            left: cardLeft + 25, // Adjust position to leave space for the bullet
            top: linkStartTop + index * (fontSize + 5), // Space between links
            fontSize: fontSize - 2,
            fontFamily: 'Verdana',
            fill: '#0000EE', // Blue color for links
            textAlign: 'left',
            selectable: false,
            hoverCursor: 'pointer',
            underline: true // Underline only the link text
        });

        // Add click event to open the link
        linkText.on('mousedown', () => {
            window.location.href = link[1]; // Open the link in the same window
        });

        return [bullet, linkText];
    });

    // Adjust the card height based on the content and links
    const cardHeight = headerHeight + content.height + 20 + linkElements.length * (fontSize + 5);
    card.set('height', cardHeight);

    // Update the positions of header and content
    header.set('top', cardTop);
    content.set('top', cardTop + headerHeight + 10);

    return [card, header, title, closeIcon, content, ...linkElements.flat()];
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

function createConnector(fromBlock, toBlock, type="straight") {
    const from = {
        x: fromBlock.left + blockWidth / 2,
        y: fromBlock.top + blockHeight
    };
    const to = {
        x: toBlock.left + blockWidth / 2,
        y: toBlock.top
    };

    // Define the path for the arrow
    let path;
    if (type === "straight") {
        // Straight line arrow
        path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    } else {
        console.error(`Unknown arrow type: ${type}`);
        return null;
    }

    // Add an arrowhead to the path
    const arrowHeadSize = 10;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
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
        fill: strokeColors[fromBlock.id[0]],
        stroke: strokeColors[fromBlock.id[0]],
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
            connectors[connectorData.from + "-" + connectorData.to] = createConnector(blocks[connectorData.from], blocks[connectorData.to]);
        });
    })
    .catch(error => console.error('Error loading flowchart data:', error));
}

// Draw the canvas
function draw() {
    canvas.clear();
    canvas.add(...Object.values(connectors));
    canvas.add(...Object.values(blocks));
    if (activeBlock) {
        canvas.add(...cards[activeBlock]);
    }
    canvas.renderAll();    
}

// Function to set canvas dimensions to match the container
async function updateCanvas() {
    canvas.setWidth(container.clientWidth);
    canvas.setHeight(container.clientHeight);

    // Set the grid dimensions
    blockWidth  = 0.3*canvas.width;
    blockHeight = 0.5*blockWidth;
    hSpace = 0.025*canvas.width;
    vSpace = 4*hSpace
    
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