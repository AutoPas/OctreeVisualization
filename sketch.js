let leaves;
let slider;
let fnCheckbox;
let fnlCheckbox;
let enCheckbox;
let enlCheckbox;
let vnCheckbox;
let vnlCheckbox;

function bmm(minx, miny, minz, maxx, maxy, maxz) {
    push();
    const dimx = maxx - minx, dimy = maxy - miny, dimz = maxz - minz;
    /*strokeWeight(10);
    point(minx, miny, minz);
    point(maxx, maxy, maxz);*/
    //strokeWeight(1);
    translate(minx + 0.5 * dimx, miny + 0.5 * dimy, minz + 0.5 * dimz);
    scale(dimx, dimy, dimz);
    box(1);
    pop();
}

function arraybmm(arr) {
    bmm(arr[0], arr[1], arr[2],
        arr[3], arr[4], arr[5]);
}

function preload() {
    leaves = loadJSON("data/leaves.json");
}

function setup() {
    createCanvas(800, 600, WEBGL);

    // This length calculation is a little bit clumsy since the "leaves" variable is not an array and does not allow for
    // easy length observation.
    let leafCount = 0;
    for(let leaf of Object.keys(leaves)) {
        ++leafCount;
    }
    slider = createSlider(0, leafCount - 1, 1, 1);

    slider.style('width', width + 'px');
    fnCheckbox = createCheckbox("Face neighbors", true);
    fnlCheckbox = createCheckbox("Face neighbor leaves", false);
    enCheckbox = createCheckbox("Edge neighbors", false);
    enlCheckbox = createCheckbox("Edge neighbor leaves", false);
    vnCheckbox = createCheckbox("Vertex neighbors", false)
    vnlCheckbox = createCheckbox("Vertex neighbor leaves", false);
    p = createElement("p");
}

function draw() {
    orbitControl();
    background(255);
    noFill();

    // flip y-axis to create a rhs coordinate system where the y-axis points upwards
    scale(1, -1, 1);

    scale(50);
    translate(-0.5, -0.5, -0.5);

    // draw a small axis marker
    push();
    translate(-0.1, -0.1, -0.1);
    scale(0.1);
    stroke(255, 0, 0);
    line(0, 0, 0, 1, 0, 0);
    stroke(0, 255, 0);
    line(0, 0, 0, 0, 1, 0);
    stroke(0, 0, 255);
    line(0, 0, 0, 0, 0, 1);
    pop();

    strokeWeight(1);

    // draw the container
    stroke(220);
    bmm(0, 0, 0, 10, 10, 10);

    if(true) {
        let leaf = leaves[slider.value()];
        {
            stroke(144, 0, 0);
            fill(255, 0, 0);
            arraybmm(leaf.minmax);
            noFill();

            if(fnCheckbox.checked()) {
                for(let neighbor of leaf.fn) {
                    stroke(180, 180, 180);
                    arraybmm(neighbor);
                }
            }

            if(fnlCheckbox.checked()) {
                for(let neighbor of leaf.fnl) {
                    stroke(144, 0, 0);
                    arraybmm(neighbor);
                }
            }

            if(enCheckbox.checked()) {
                for(let neighbor of leaf.en) {
                    stroke(255, 0, 255);
                    arraybmm(neighbor);
                }
            }

            if(enlCheckbox.checked()) {
                for(let neighbor of leaf.enl) {
                    stroke(144, 0, 0);
                    arraybmm(neighbor);
                }
            }

            if(vnCheckbox.checked()) {
                for(let neighbor of leaf.vn) {
                    stroke(0, 255, 255);
                    arraybmm(neighbor);
                }
            }

            if(vnlCheckbox.checked()) {
                for(let neighbor of leaf.vnl) {
                    stroke(144, 0, 0);
                    arraybmm(neighbor);
                }
            }

            p.html("Leaf #" + slider.value() + "<br>face neighbor count: " + leaf.fn.length + "<br>edge neighbor count: " + leaf.en.length + "<br>vertex neighbor count: " + leaf.vn.length);
        }
    } else {
        // draw the leaf
        stroke(255, 0, 0);
        bmm(0.5, 0, 0, 1, 0.5, 0.5);

        // draw the neighbor
        stroke(144, 144, 144);
        bmm(0, 0, 0.5, 0.5, 0.5, 1.0);
    }
}