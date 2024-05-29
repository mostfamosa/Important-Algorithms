const gridContainer = document.getElementById('grid-container');
const boxes = [];
let startPoint = null;
let endPoint = null;
let stopBFS = false; // Flag to stop the BFS process


let columns = 5;
let rows = 5;
let cnt = 1;
// Initialize the grid
for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= columns; j++) {
        const box = document.createElement('div');
        box.className = 'box';
        box.id = i + '-' + j;
        box.onclick = () => selectBox(box);
        box.innerHTML = i + '-' + j;
        gridContainer.appendChild(box);
        boxes.push(box);
    }
}

function selectBox(box) {
    if (box === startPoint) {
        startPoint.style.backgroundColor = '';
        startPoint = null;
    } else if (box === endPoint) {
        endPoint.style.backgroundColor = '';
        endPoint = null;
    } else if (!startPoint) {
        startPoint = box;
        box.className += ' start';
    } else if (!endPoint) {
        endPoint = box;
        box.className += ' end';
    }
}

function getNeighbors(box) {
    const [row, col] = box.id.split('-').map(Number);
    const neighbors = [];

    if (row > 1) neighbors.push(document.getElementById(`${row - 1}-${col}`));
    if (row < rows) neighbors.push(document.getElementById(`${row + 1}-${col}`));
    if (col > 1) neighbors.push(document.getElementById(`${row}-${col - 1}`));
    if (col < columns) neighbors.push(document.getElementById(`${row}-${col + 1}`));

    return neighbors;
}

// Function to start BFS visualization
async function startBFS() {
    if (startPoint === null || endPoint === null) {
        alert('Please select both start and end points.');
        return;
    }

    stopBFS = false;
    
    const visited = {};
    const parent = {};
    for (let box of boxes) {
        visited[box.id] = false;
        parent[box.id] = null;
    }

    const queue = [startPoint];
    visited[startPoint.id] = true;

    while (queue.length > 0) {
        if (stopBFS) return;
        const currentNode = queue.shift();
        currentNode.className += ' current-box'
        const neighbors = getNeighbors(currentNode);

        currentNode.style.backgroundColor = '#FFA07A'; // Light red

        for (const neighbor of neighbors) {
            if (neighbor === endPoint) {
                parent[neighbor.id] = currentNode;
                highlightPath(startPoint, endPoint, parent);
                return;
            }

            if (!visited[neighbor.id]) {
                neighbor.style.backgroundColor = '#98FB98'; // Light green
                visited[neighbor.id] = true;
                parent[neighbor.id] = currentNode;
                queue.push(neighbor);
            }
        }
        updateInfo(currentNode, queue);
        await new Promise(r => setTimeout(r, 2000));
        currentNode.className = 'box';
    }
}

// Function to highlight the shortest path
function highlightPath(startPoint, endPoint, parent) {
    let currentNode = endPoint;
    const path = [];

    while (currentNode !== startPoint) {
        path.unshift(currentNode.id);
        currentNode.style.backgroundColor = 'yellow';
        currentNode = parent[currentNode.id];
        if (!currentNode) {
            console.error('No path found to the start point.');
            return;
        }
    }
    path.unshift(startPoint.id);
    startPoint.style.backgroundColor = 'yellow'; // Highlight start point as well
    document.getElementById('shortest-path-info').textContent = `${path.join(' ~> ')}`;
}

// Function to update the information section
function updateInfo(currentNode, queue) {
    document.getElementById('queue-items').textContent = `${queue.map(node => node.id).join(', ')}`;
    document.getElementById('current-box').textContent = `${currentNode.id}`;
}

function resetGrid() {
    stopBFS = true;
    startPoint.className = 'box';
    endPoint.className = 'box';
    startPoint = null;
    endPoint = null;
    
    for (let box of boxes) {
        box.style.backgroundColor = '';
    }
    document.getElementById('queue-items').textContent = '';
    document.getElementById('current-box').textContent = '';
    document.getElementById('shortest-path-info').textContent = '';
}