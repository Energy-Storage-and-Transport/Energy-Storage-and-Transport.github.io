// Variables
let blockWidth = null;
let blockHeight = null;
let hSpace = null;
let vSpace = null;
let activeBlock = null;

// Constants
const fontSize = 18;

// Create a task block
function createBlock(blockData) {
    // Create the block
    const block = new fabric.Rect({
        left: 0,
        top: 0,
        fill: '#19c81980',
        width: blockWidth,
        height: blockHeight,
        stroke: '#19c819ff',
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
        group.item(0).set('fill', group.item(0).stroke);
        canvas.renderAll();
        console.log(group.id);
    });

    group.on('mouseout', () => {
        group.item(0).set('fill', '#19c81980');
        canvas.renderAll();
    });

    group.on('mousedown', () => {
        activeBlock = group.id;
        console.log('Active block set to:', activeBlock);
    });

    return group;
}

// Function to draw the grid
function drawGrid(canvas) {
    // Fetch block data from the JSON file
    fetch('/data/flowchartData.json')
    .then(response => response.json())
    .then(blocks => {
        blocks.forEach(blockData => {
            // Create the block
            const group = createBlock(blockData);

            // Add the group to the canvas
            canvas.add(group);
        });
        canvas.renderAll();
    })
    .catch(error => console.error('Error loading flowchart data:', error));
}

// Function to set canvas dimensions to match the container
function resizeCanvas(canvas) {
    canvas.setWidth(container.clientWidth);
    canvas.setHeight(container.clientHeight);

    // Set the grid dimensions
    blockWidth  = 0.3*canvas.width;
    blockHeight = 0.5*blockWidth;
    hSpace = 0.1*canvas.width/3;
    vSpace = 4*hSpace
    
    // Clear the canvas
    canvas.clear();

    // Draw the grid
    drawGrid(canvas);
}

// Get the container and canvas elements
const container = document.getElementsByClassName('stage1-container')[0];
const canvas = new fabric.Canvas('stage1Flowchart');

// Initial canvas size setup
resizeCanvas(canvas);

// Add event listener for window resize
window.addEventListener('resize', () => resizeCanvas(canvas));