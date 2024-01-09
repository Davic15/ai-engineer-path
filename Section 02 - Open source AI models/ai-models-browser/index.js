//import { pipeline } from '@xenova/transformers';
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.8.0'

// Reference the elements that we will need
const status = document.getElementById('status')
const image = document.getElementById('image')

// Load model and create a new object detection pipeline
status.textContent = 'Loading model...'
const detector = await pipeline('object-detection', 'Xenova/yolos-tiny')
status.textContent = 'Detecting Objects...'
console.log(detector)

const detectedObjects = await detector(image.src, {
    threshold: 0.5,
    percentage: true
})
detectedObjects.forEach(object => {
    console.log(object)
})

status.textContent = 'Done!'