import {HfInference} from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGING_FACE_API);

const text = "It's an exciting time to be an A.I. engineer."

const response = await hf.textToSpeech({
    inputs: text,
    model: 'espnet/kan-bayashi_ljspeech_vits'
})

console.log(response);

const audioElement = document.getElementById('speech')
const speechUrl = URL.createObjectURL(response)
audioElement.src = speechUrl