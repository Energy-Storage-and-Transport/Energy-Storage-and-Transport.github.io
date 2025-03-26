// Variables
let blockWidth = null;
let blockHeight = null;
let hSpace = null;
let vSpace = null;
let activeBlock = null;
let grid = [];
let cards = {};

// Constants
const fontSize = 18;
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

// Update the grid
async function updateGrid() {
    grid.length = 0; // Clear the grid
    // Fetch block data from the JSON file
    await fetch('/data/flowchartData.json')
    .then(response => response.json())
    .then(blocks => {
        blocks.forEach(blockData => {
            grid.push( createBlock(blockData) );
            console.log( grid.length );
        });
    })
    .catch(error => console.error('Error loading flowchart data:', error));
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
        selectable: false
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
        selectable: false
    });

    // Create the header bar
    const header = new fabric.Rect({
        left: cardLeft,
        top: cardTop,
        width: cardWidth,
        height: headerHeight,
        fill: strokeColors[blockData.id[0]],
        selectable: false
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
        selectable: true,
        hoverCursor: 'pointer'
    });

    // Add event listener for the closeIcon
    closeIcon.on('mousedown', (event) => {
        activeBlock = null; // Reset activeBlock
        draw(); // Redraw the canvas
    });

    // Add the main content (description and links)
    const content = new fabric.Textbox(blockData.description + '\n\nLinks:\n' + blockData.links.join('\n'), {
        left: cardLeft + 10,
        top: cardTop + headerHeight + 10,
        width: cardWidth - 20,
        fontSize: fontSize - 2,
        fontFamily: 'Verdana',
        fill: '#000000',
        textAlign: 'left',
        selectable: false
    });

    // Adjust the card height based on the content height
    const contentHeight = content.height + 20; // Add padding
    const cardHeight = headerHeight + contentHeight; // Add padding for the bottom
    card.set('height', cardHeight);

    // Update the positions of header and content
    header.set('top', cardTop);
    content.set('top', cardTop + headerHeight + 10);

    return [card, header, title, closeIcon, content];
}

// Update the grid
async function updateCards() {
    // Fetch block data from the JSON file
    await fetch('/data/flowchartData.json')
    .then(response => response.json())
    .then(blocks => {
        blocks.forEach(blockData => {
            cards[blockData.id] = createCard(blockData);
        });
    })
    .catch(error => console.error('Error loading flowchart data:', error));
}

// Draw the canvas
function draw() {
    canvas.clear();
    canvas.add(...grid);
    if (activeBlock) {
        canvas.add(...cards[activeBlock]);
    }
    canvas.renderAll();    
}

// Function to set canvas dimensions to match the container
async function updateCanvas() {
    console.log("Resizing canvas");
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