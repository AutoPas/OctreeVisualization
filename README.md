# OctreeVisualization

This is a small browser app that can visualize the JSON files that are generated by the methods `leavesToJSON`
and `particlesToJSON` of `OctreeLogger`. The app uses [p5js](https://p5js.org/) for visualization.

## Usage

1. Clone the repository
2. Create (if it does not already exist) a directory called `data` in the root directory of this project (alongside
   the `index.html`, `sketch.js`, etc. files)
3. Create the files that should be visualized using the `OctreeLogger` by calling the methods in the AutoPas application
4. Put the generated files inside the `data` directory
5. Open the `index.html` file in the browser (by either dragging and dropping it onto a new tab or by typing the path to
   the file manually, like this: `file:///home/ExampleUser/.../index.html`)