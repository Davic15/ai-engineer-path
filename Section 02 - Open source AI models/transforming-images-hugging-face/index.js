import {HfInference} from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGING_FACE_API);

const model = "ghoskno/Color-Canny-Controlnet-model"

const oldImageUrl = "/old-photo.jpeg"
const oldImageResponse = await fetch(oldImageUrl)
const oldImageBlob = await oldImageResponse.blob()

const prompt = `An elderly couple walks together on a gravel path with green 
grass and trees on each side. Wearing neutral-colored clothes, they face away
 from the camera as they carry their bags.`

const newImageBlob = await hf.imageToImage({
    model: model,
    inputs: oldImageBlob,
    parameters: {
        prompt: prompt,
        negative_prompt: "Black and white photo. text, bad anatomy, blurry, low quality",
        strength: 0.85
    }
})

const newImageBase64 = await blobToBase64(newImageBlob)
const newImage = document.getElementById("new-image")
newImage.src = newImageBase64