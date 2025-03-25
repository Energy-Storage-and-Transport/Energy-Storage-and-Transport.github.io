const container = document.getElementsByClassName('stage1-container')[0];
const canvas = new fabric.Canvas('stage1Flowchart');
const fontSize = 18;

// Function to set canvas dimensions to match the container
function resizeCanvas() {
    canvas.setWidth(container.clientWidth);
    canvas.setHeight(container.clientHeight);

    // Clear the canvas
    canvas.clear();

    const canvasWidth = canvas.getWidth();
    const blockWidth = canvasWidth * 0.3;
    const blockHeight = blockWidth * 0.6;
    const hSpace = canvasWidth * 0.025;
    const vSpace = canvasWidth * 0.05;

    // Create the first block and its text
    const block1 = new fabric.Rect({
        left: 0,
        top: 0,
        fill: '#19c81980',
        width: blockWidth,
        height: blockHeight,
        stroke: '#19c819ff',
        strokeWidth: 3,
        selectable: false
    });

    const text1 = new fabric.Textbox('Literature review', {
        left: block1.width / 2,
        top: block1.height / 2,
        width: blockWidth,
        fill: 'white',
        fontSize: fontSize,
        fontFamily: 'Verdana',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        selectable: false
    });

    // Group the first block and its text
    const group1 = new fabric.Group([block1, text1], {
        left: hSpace,
        top: vSpace,
        selectable: false,
        hoverCursor: 'default'
    });

    // Explicitly set the group's height to match the block's height
    group1.height = block1.height;
    group1.width  = block1.width;

    // Create the second block and its text
    const block2 = new fabric.Rect({
        left: 0,
        top: 0,
        fill: '#19c81980',
        width: blockWidth,
        height: blockHeight,
        stroke: '#19c819ff',
        strokeWidth: 3,
        selectable: false
    });

    const text2 = new fabric.Textbox('Supply & demand analysis', {
        left: block2.width / 2,
        top: block2.height / 2,
        width: blockWidth,
        fill: 'white',
        fontSize: fontSize,
        fontFamily: 'Verdana',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        selectable: false
    });

    // Group the second block and its text
    const group2 = new fabric.Group([block2, text2], {
        left: hSpace,
        top: group1.top + group1.height + vSpace,
        selectable: false,
        hoverCursor: 'default'
    });

    // Add hover effect for groups
    [group1, group2].forEach(group => {
        group.on('mouseover', () => {
            group.item(0).set('fill', group.item(0).stroke); // Change fill to stroke color
            canvas.renderAll(); // Re-render the canvas
        });

        group.on('mouseout', () => {
            group.item(0).set('fill', '#19c81980'); // Reset fill color
            canvas.renderAll(); // Re-render the canvas
        });
    });

    // Create the arrow
    const arrow = new fabric.Path(`M 0 0 L 0 ${vSpace-3} M -8 ${vSpace - 11} L 0 ${vSpace-3} L 8 ${vSpace - 11}`, {
        left: group1.left + group1.width / 2,
        top: group1.top + group1.height,
        stroke: '#19c819ff',
        fill: '#19c819ff',
        strokeWidth: 3,
        selectable: false, // Make the arrow non-interactive
        originX: 'center',
        originY: 'top'
    });


    // Add the blocks, text, and arrow to the canvas
    canvas.add(arrow);
    canvas.add(group1);
    canvas.add(group2);


    canvas.renderAll();
}

// Initial canvas size setup
resizeCanvas();

// Add event listener for window resize
window.addEventListener('resize', resizeCanvas);

