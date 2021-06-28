let owned, halo;
let particles;
let slider;
let redBoxCheckbox;
let fnCheckbox;
let fnlCheckbox;
let enCheckbox;
let enlCheckbox;
let vnCheckbox;
let vnlCheckbox;
let haloCheckbox;
let haloMin, haloMax;
let dynamicInfo;
let staticInfo;

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
    owned = loadJSON("data/owned.json");
    halo = loadJSON("data/halo.json");
    print(halo);

    particles = loadJSON("data/particles.json");
    print(particles);
}

function line3D(x1, y1, z1, x2, y2, z2) {
    beginShape(LINES);
    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
    endShape();
}

function setup() {
    createCanvas(800, 600, WEBGL);

    // This length calculation is a little bit clumsy since the "leaves" variable is not an array and does not allow for
    // easy length observation.
    let ownedLeafCount = 0;
    for(let leaf of Object.keys(owned)) {
        ++ownedLeafCount;
    }
    slider = createSlider(0, ownedLeafCount - 1, 1, 1);

    // Compute the halo octree bounding box
    haloMin = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
    haloMax = [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];
    for(let key of Object.keys(halo)) {
        const haloLeaf = halo[key];
        const minmax = haloLeaf["minmax"];
        for(let d = 0; d < 3; ++d) {
            if(haloMin[d] > minmax[d]) {
                haloMin[d] = minmax[d];
            }
            if(haloMax[d] < minmax[d+3]) {
                haloMax[d] = minmax[d+3];
            }
        }
    }
    print(haloMin);
    print(haloMax);

    slider.style('width', width + 'px');
    staticInfo = createElement("p");
    staticInfo.html(`haloMin=${haloMin}, haloMax=${haloMax}`);
    redBoxCheckbox = createCheckbox("Current leaf", true);
    fnCheckbox = createCheckbox("Face neighbors", true);
    fnlCheckbox = createCheckbox("Face neighbor leaves", false);
    enCheckbox = createCheckbox("Edge neighbors", false);
    enlCheckbox = createCheckbox("Edge neighbor leaves", false);
    vnCheckbox = createCheckbox("Vertex neighbors", false)
    vnlCheckbox = createCheckbox("Vertex neighbor leaves", false);
    haloCheckbox = createCheckbox("Show halo leaves", false)
    dynamicInfo = createElement("p");
}

function draw() {
    orbitControl();
    background(255);
    noFill();

    // flip y-axis to create a rhs coordinate system where the y-axis points upwards
    scale(1, -1, 1);

    scale(100);
    translate(-1.5, -1.5, -1.5);

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

    // draw the owned container
    stroke(220);
    let d = 1.5; // dimensions of the enclosing (owned box) in each direction
    bmm(0, 0, 0, d, d, d);

    // draw the halo octree
    stroke(127, 255, 127);
    bmm(haloMin[0], haloMin[1], haloMin[2], haloMax[0], haloMax[1], haloMax[2]);

    if(true) {
        let leaf = owned[slider.value()];
        {
            strokeWeight(1);
            stroke(144, 0, 0);
            if(redBoxCheckbox.checked()) {
                fill(255, 0, 0);
                arraybmm(leaf.minmax);
                noFill();
            }

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

            if(haloCheckbox.checked()) {
                stroke(127, 255, 127);
                for(let key of Object.keys(halo)) {
                    const haloLeaf = halo[key];
                    const minmax = haloLeaf["minmax"];
                    arraybmm(minmax);
                }
            }

            strokeWeight(10);
            stroke(0, 0, 0);
            for(let particle of particles["owned"]) {
                point(particle[0], particle[1], particle[2]);
            }

            stroke(0, 255, 0);
            for(let particle of particles["halo"]) {
                point(particle[0], particle[1], particle[2]);
            }

            strokeWeight(5);

            stroke(255, 255, 0);
            line3D(0.745235, 1.188626, 1.417393, 1.465768, 1.538422, 1.603554);
            //line3D(1.424756, 0.100978, 2.862123, 1.788266, 0.722760, 3.171402);
            line3D(1.262250, 1.439857, 0.691782, 1.465768, 1.538422, 1.603554);
            line3D(1.452783, 1.051016, 0.996993, 1.465768, 1.538422, 1.603554);
            //line3D(1.490471, 2.377251, 2.834787, 2.347070, 2.571557, 3.200641);
            line3D(1.478945, 1.319024, 1.298905, 1.465768, 1.538422, 1.603554);
            line3D(1.197687, 1.427137, 0.767789, 1.465768, 1.538422, 1.603554);

            stroke(0, 255, 255);
            //line3D(0.571186, 0.611561, 2.616735, 0.229999, 0.610257, 3.252689);
            //line3D(0.571186, 0.611561, 2.616735, -0.179455, 0.714753, 3.210076);
            stroke(127, 127, 0);
            //line3D(2.224714, 0.113547, 2.718097, 1.788266, 0.722760, 3.171402);
            stroke(127, 0, 127);
            //line3D(2.957890, 2.638047, 2.597811, 2.347070, 2.571557, 3.200641);
            stroke(0, 127, 127);
            //line3D(0.528584, 0.760166, 2.358350, 0.229999, 0.610257, 3.252689);

            dynamicInfo.html("Leaf #" + slider.value() + "<br>face neighbor count: " + leaf.fn.length + "<br>edge neighbor count: " + leaf.en.length + "<br>vertex neighbor count: " + leaf.vn.length);
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