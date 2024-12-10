const CANVAS_WIDTH  = 2000;
const CANVAS_HEIGHT = 2*CANVAS_WIDTH;
const FONT_SIZE     = 16;
const LINE_WIDTH    = 10;
const H_SPACING     = CANVAS_WIDTH/40;
const V_SPACING     = CANVAS_WIDTH/5;
const MAXSCALE      = 4;

strokeColors = {
    "system"     : "#c86419ff",
    "model"      : "#19c819ff",
    "experiment" : "#1919c8ff",
    "course"     : "#c81919ff"
};

fillColors = {
    "system"     : "#c8641980",
    "model"      : "#19c81980",
    "experiment" : "#1919c880",
    "course"     : "#c8191980"
};

class Textbox {
    constructor(x, y, w, h=undefined, text, color, fontsize=FONT_SIZE, weight="normal", lineheight=1.2, halign="center", valign="top", maxscale=MAXSCALE){
        this.x          = x;
        this.y          = y;
        this.w          = w;
        this.h          = h;
        this.text       = text;
        this.color      = color;
        this.fontSize   = fontsize;
        this.lineHeight = lineheight*fontsize;
        this.halign     = halign;
        this.valign     = valign;
        this.weight     = weight;
        this.maxScale   = maxscale;
    }

    update(ctx, scale, props=undefined){
        var scale = Math.min(scale, this.maxScale);
        if(props!=undefined){
            Object.assign(this, props);
        }
        ctx.fillStyle    = this.color;
        ctx.textAlign    = this.halign;
        ctx.textBaseline = "top";
        ctx.font         = this.weight + " " + String(Math.round(scale*this.fontSize)) + "px Verdana";
        this.h           = this.#lines(scale).length*this.lineHeight*scale;
    }

    draw(ctx, scale){
        var scale = Math.min(scale, this.maxScale);
        this.update(ctx, scale);

        var x = this.x;
        if(this.halign=="center"){
            x += this.w/2
        }else if(this.halign=="right"){
            x += this.w
        }

        var y = this.y;
        if(this.valign=="center"){
            y -= this.h/2;
        }else if(this.valign=="bottom"){
            y -= this.h;
        }

        for(let line of this.#lines(scale)){
            ctx.fillText(line, x, y);
            y += this.lineHeight*scale;
        }
    }
    
    #lines(scale){
        var scale = Math.min(scale, this.maxScale);
        var words = this.text.split(' ');
        var line  = '';
        var lines = [];
        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine.trim());
            var testWidth = metrics.width;
            if (testWidth > this.w && n > 0) {
              lines.push(line.trim());
              line = words[n] + ' ';
            }
            else {
              line = testLine;
            }
        }
        lines.push(line.trim());
        return lines;
    }

    isPointOnText(x, y){
        return (x>this.x & x<this.x+this.w & y>this.y & y<this.y+this.h);
    }
}

class Card{

    constructor(x, y, w, h=undefined, spacing=0, data){
        this.x           = x;
        this.y           = y;
        this.w           = w;
        this.h           = h;
        this.h           = undefined;
        this.track       = data["track"];
        this.radius      = spacing;
        this.spacing     = spacing;

        var xtext = x+spacing;
        var wtext = w-2*spacing;

        this.title       = new Textbox(xtext, y+spacing, wtext, undefined, data["title"], "white", undefined, "bold", undefined, "left", "top");
        this.description = new Textbox(xtext, undefined, wtext, undefined, data["description"], "black", undefined, undefined, undefined, "left", undefined);
        this.linksheader = new Textbox(xtext, undefined, wtext, undefined, "Links", "black", undefined, "oblique", undefined, "left", undefined);
        this.links = [];
        this.hrefs = [];
        for(let link of data["links"]){
            this.links.push(new Textbox(xtext, y, wtext, undefined, "• " + link[0], "black", undefined, undefined, undefined, "left", undefined));
            this.hrefs.push(link[1]);
        }
    }

    clear(ctx) {
        ctx.clearRect(this.x, this.y, this.w, this.h);
    }

    draw(ctx, scale=1) {

        var y = this.y;
        
        // Title text
        this.title.update(ctx, scale);

        // Title box
        var titlePath = new Path2D();
        titlePath.roundRect(this.x, y, this.w, this.title.h+2*this.spacing, this.radius);
        titlePath.rect(this.x, y+0.5*this.title.h+this.spacing, this.w, 0.5*this.title.h+this.spacing);
        
        // Cross
        this.cross_xstart = this.x+this.w-this.radius-this.title.h;
        this.cross_xstop  = this.x+this.w-this.radius;
        this.cross_ystart = y+this.spacing;
        this.cross_ystop  = y+this.spacing+this.title.h;

        var crossPath = new Path2D();
        crossPath.moveTo(this.cross_xstart, this.cross_ystart);
        crossPath.lineTo(this.cross_xstop , this.cross_ystop );
        crossPath.moveTo(this.cross_xstop , this.cross_ystart);
        crossPath.lineTo(this.cross_xstart, this.cross_ystop );

        // Description
        y += this.title.h+3*this.spacing;
        this.description.update(ctx, scale, {y: y});
        
        // Links header
        y+= this.description.h+this.spacing;
        this.linksheader.update(ctx, scale, {y: y});

        // Links 
        y += this.linksheader.h+0.25*this.spacing;
        for(let link of this.links){
            link.update(ctx, scale, {y:y});
            y += link.h+0.25*this.spacing;
        }

        // Box
        y += this.spacing
        var boxPath = new Path2D();
        boxPath.roundRect(this.x, this.y, this.w, y-this.y, this.radius);

        // Draw the complete card
        ctx.fillStyle = "white";
        ctx.fill(boxPath);
        ctx.strokeStyle = strokeColors[this.track];
        ctx.stroke(boxPath);
        ctx.fillStyle = strokeColors[this.track];
        ctx.fill(titlePath);
        ctx.strokeStyle = "white";
        ctx.stroke(crossPath);
        this.title.draw(ctx, scale);
        this.description.draw(ctx, scale);
        this.linksheader.draw(ctx, scale);
        for(let link of this.links){
            link.draw(ctx, scale);
        }
    }

    onMouseMove(ctx, x, y, scale){
        for(let link of this.links){
            if(link.isPointOnText(x, y)){
                link.update(ctx, scale, {"color":strokeColors[this.track]});
                link.draw(ctx, scale);
            }else{
                link.update(ctx, scale, {"color":"black"});
                link.draw(ctx, scale);
            }
        }
    }

    onClick(ctx, x, y, scale){
        for(let l=0; l<this.links.length; l++){
            if(this.links[l].isPointOnText(x, y)){
                open(this.hrefs[l], "_parent");
            }
        }
    }

    isPointOnCross(x, y){
        return (x>this.cross_xstart & x<this.cross_xstop  & y>this.cross_ystart & y<this.cross_ystop);
    }

}

class Block {

    constructor(x, y, w, h, xgrid, wgrid, spacing=0, data) {
        this.x       = x;
        this.y       = y;
        this.w       = w;
        this.h       = h;
        this.track   = data["track"];
        this.title   = data["title"];
        this.text    = new Textbox(this.x+spacing, undefined, w-2*spacing, undefined, this.title, "black", undefined, undefined, undefined, undefined, "center");
        this.radius  = spacing;
        this.spacing = spacing;
        this.card    = new Card(xgrid, y, wgrid, undefined, spacing, data);
        this.path    = new Path2D();
        this.path.roundRect(this.x, this.y, this.w, this.h, this.radius);
    }

    clear(ctx) {
        ctx.clearRect(this.x, this.y, this.w, this.h);
    }

    draw(ctx, fill=false, scale=1){
        this.clear(ctx);
        ctx.strokeStyle = strokeColors[this.track];
        ctx.fillStyle   = fillColors[this.track];
        if(fill){ctx.fill(this.path)};
        ctx.stroke(this.path);

        this.text.update(ctx, scale);
        this.text.y = this.y+this.h/2
        this.text.draw(ctx, scale);
        this.text.draw(ctx, scale);
    }

}

class Grid {

    constructor(w, h, hspacing, vspacing, lineWidth, ncols, nrows, headers) {
        this.activeCard   = -1;
        this.h            = h;
        this.ncols        = ncols;
        this.nrows        = nrows;
        this.hspacing     = hspacing;
        this.vspacing     = vspacing;
        this.lineWidth    = lineWidth;
        this.spacing      = hspacing;
        this.blockWidth   = Math.floor((w-(ncols-1)*hspacing)/ncols)-lineWidth;
        this.blockHeight  = Math.floor(this.blockWidth/2);
        this.headerHeight = this.blockHeight;
        for(let i=0; i<headers.length; i++){
            headers[i].x = lineWidth+i*(lineWidth+this.blockWidth+hspacing);
            headers[i].y = 0.5*this.headerHeight;
            headers[i].w = this.blockWidth;
        }
        this.headers      = headers;
        this.w            = ncols*(this.blockWidth+lineWidth)+(ncols-1)*(this.hspacing);
        this.blocks       = [];
    }

    *[Symbol.iterator]() { 
        for(let block of this.blocks.filter(x=>!!x)){
            yield block;
        }
    }

    onMouseMove(ctx, x, y, scale){
        if(this.activeCard<0){
            for(let block of this){
                block.draw(ctx, ctx.isPointInPath(block.path, x, y), scale);
            }
        }else{
            this.blocks[this.activeCard].card.onMouseMove(ctx, x, y, scale);
        }
    }

    onClick(ctx, x, y, scale){
        if(this.activeCard<0){
            for(let b=0; b<this.blocks.length; b++){
                if(this.blocks[b]!=undefined){
                    if(ctx.isPointInPath(this.blocks[b].path, x, y)){
                        this.activeCard=b;
                        this.draw(ctx, scale);
                    }
                }
            }
        }else{
            if(this.blocks[this.activeCard].card.isPointOnCross(x, y)){
                this.activeCard = -1;
                this.draw(ctx, scale);
            }
            else
            {
                this.blocks[this.activeCard].card.onClick(ctx, x, y, scale);
            }
        }
    }

    addBlock(i, j, data){
        var I = j*this.ncols+i;
        this.blocks[I] = new Block(i*(this.blockWidth + this.lineWidth + this.hspacing) + this.lineWidth/2, this.headerHeight + j*(this.blockHeight + this.lineWidth + this.vspacing) + this.lineWidth/2, this.blockWidth, this.blockHeight, this.lineWidth/2, this.w-this.lineWidth, this.spacing, data);
    }

    draw(ctx, scale){
        ctx.clearRect(0, 0, this.w, this.h);
        for(let header of this.headers){
            header.draw(ctx, scale);
        }
        for(let block of this){
            block.draw(ctx, false, scale);
        }
        if(this.activeCard>=0){
            this.blocks[this.activeCard].card.draw(ctx, scale);
        }
    }
}

var c = document.getElementById("flowchart");

// Set the size of the Canvas picture (different from the html element size)
c.width  = CANVAS_WIDTH;
c.height = CANVAS_HEIGHT;

// Get the canvas coordinate scale
function getCanvasScale(c){
    var rect  = c.getBoundingClientRect();
    return c.width / rect.width;
}

function getCanvasCoordinate(c, event){
    var scale = getCanvasScale(c);
    return [event.offsetX*scale, event.offsetY*scale, scale];
}

var ctx  = c.getContext("2d");

ctx.lineWidth = LINE_WIDTH;

var headers = [
    new Textbox(undefined, undefined, undefined, undefined, "System definition", strokeColors["system"], fontsize=FONT_SIZE, weight="bold", lineheight=1.2, halign="center", valign="center"),
    new Textbox(undefined, undefined, undefined, undefined, "Model development", strokeColors["model"], fontsize=FONT_SIZE, weight="bold", lineheight=1.2, halign="center", valign="center"),
    new Textbox(undefined, undefined, undefined, undefined, "Experimental validation", strokeColors["experiment"], fontsize=FONT_SIZE, weight="bold", lineheight=1.2, halign="center", valign="center"),
    new Textbox(undefined, undefined, undefined, undefined, "Deliverables", strokeColors["course"], fontsize=FONT_SIZE, weight="bold", lineheight=1.2, halign="center", valign="center")
];

var grid = new Grid(c.width, c.height, H_SPACING, V_SPACING, LINE_WIDTH, 4, 10, headers);

var data1 = {
    track: "system", 
    title: "Literature survey",
    description:  "Perform a literature review on EST systems. Tabulate the explored systems in terms of essential storage characteristics, such as storage duration, storage capacity and system size.",
    links: [["The energy transition: an engineering challenge", "html/challenge-background.html"],
            ["The system definition track", "html/tracks-system.html"]]
}

var data2 = {
    track: "model",
    title: "Power analysis",
    description: "Install the Simulink EST model and use it to analyze the supply and demand signals. Define requirements for the EST system, such as storage duration and storage capacity.",
    links: [["The modeling track", "html/tracks-model.html"]]
}

grid.addBlock(0, 0, data1);
grid.addBlock(3, 1, data2);

grid.draw(ctx, getCanvasScale(c));

c.addEventListener('mousemove', event=>grid.onMouseMove(ctx, ...getCanvasCoordinate(c, event)), false);
c.addEventListener('click'    , event=>grid.onClick(ctx, ...getCanvasCoordinate(c, event)), false);

window.addEventListener("resize", event=>grid.draw(ctx, getCanvasScale(c)), false);

console.log(grid);