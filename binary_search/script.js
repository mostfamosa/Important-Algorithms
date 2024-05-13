let currentStep = 0;
const arr = getSortedArrayFromUser();
let steps = null;
let target = null;
if (arr !== null) {
    target = parseInt(prompt("Enter the target value:"));
    steps = binarySearch(arr, target).steps
    visualizeStep(arr, target, currentStep);
}

// Event listeners for the buttons
document.getElementById('prevBtn').addEventListener('click', prevStep);
document.getElementById('nextBtn').addEventListener('click', nextStep);


// Function to perform binary search on a sorted array
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let steps = [];

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        steps.push({ left: left, right: right, mid: mid });

        if (arr[mid] === target) {
            return { index: mid, steps: steps };
        }
        if (arr[mid] < target) {
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    return { index: -1, steps: steps };
}

// Function to visualize the current step of the binary search algorithm
function visualizeStep(arr, target, stepIndex) {
    const result = binarySearch(arr, target);
    const steps = result.steps;
    const arrayDiv = document.getElementById('array');
    arrayDiv.innerHTML = '';
    
    if (stepIndex === steps.length) {
        let arrayHTML = arr.map((num, index) => {
            let classNames = 'array-element';
            if (num === target) {
                classNames += ' highlight-target';
            }
            return `<div class="${classNames}">${num}<br>(${index})</div>`;
        }).join('');
        arrayDiv.innerHTML = arrayHTML;
    } else {
        let arrayHTML = arr.map((num, index) => {
            let classNames = 'array-element';
            const step = steps[stepIndex];
            if (index === step.left) {
                classNames += ' highlight-left';
            } else if (index === step.right) {
                classNames += ' highlight-right';
            } else if (index === step.mid) {
                classNames += ' highlight-middle';
            }
            return `<div class="${classNames}">${num}<br>(${index})</div>`;
        }).join('');
        arrayDiv.innerHTML = arrayHTML;
    }
    if (stepIndex === steps.length) {
        const visualizationDiv = document.getElementById('visualization');

        if (result.index !== -1) {
            visualizationDiv.innerHTML += `<p>Target ${target} found at index ${result.index}</p>`;
        } else {
            visualizationDiv.innerHTML += `<p>Target ${target} not found in the array</p>`;
        }
    }
    else {
        const visualizationDiv = document.getElementById('visualization');
        visualizationDiv.innerHTML = '<h2>Steps of Binary Search Algorithm:</h2>';
        const currentStep = steps[stepIndex];
        visualizationDiv.innerHTML += `<p class = highlight-left style="width : fit-content;">Left Index = ${currentStep.left}</p>`;
        visualizationDiv.innerHTML += `<p class = highlight-middle style="width : fit-content;">Middle Index = ${currentStep.mid}</p>`;
        visualizationDiv.innerHTML += `<p class = highlight-right style="width : fit-content;">Right Index = ${currentStep.right}</p>`;
        visualizationDiv.innerHTML += `<p>Step ${stepIndex + 1}: Compare ${arr[currentStep.mid]} with ${target}</p>`;
    }
}

// Function to go to the previous step
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        visualizeStep(arr, target, currentStep);
    }
}

// Function to go to the next step
function nextStep() {
    if (currentStep < steps.length) {
        currentStep++;
        visualizeStep(arr, target, currentStep);
    }
}

// Function to prompt the user to enter a sorted array
function getSortedArrayFromUser() {
    let inputArray = prompt("Enter a sorted array (comma-separated):");

    if (inputArray === null) {
        return null;
    }
    inputArray = inputArray.split(',').map(Number);
    for (let i = 0; i < inputArray.length - 1; i++) {
        if (inputArray[i] > inputArray[i + 1]) {
            alert("The entered array is not sorted. Please enter a sorted array.");
            return getSortedArrayFromUser(); // Ask the user to re-enter the array
        }
    }
    return inputArray;
}


