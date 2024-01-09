import {HfInference} from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGING_FACE_API);

const textToGenerate = 'The definition of machine learning inference is ';

// Text generation
// const response = await hf.textGeneration({
//     inputs: textToGenerate,
//     model: 'HuggingFaceH4/zephyr-7b-beta'
// })
//
// console.log(response);

// Text classification

// const textToClassify = `I just bought a new camera. It's the best camera I've ever owned!`;
//
// const response = await hf.textClassification({
//     model: 'distilbert-base-uncased-finetuned-sst-2-english',
//     inputs: textToClassify
// })
//
// console.log(response)

// Text translation
const textToTranslate = "It's an exciting time to be an AI engineer"

const textTranslationResponse = await hf.translation({
    model: 'facebook/mbart-large-50-many-to-many-mmt',
    inputs: textToTranslate,
    parameters: {
        src_lang: 'en_XX',
        tgt_lang: 'ar_AR'
    }
})

const translation = textTranslationResponse.translation_text;
console.log("\ntranslation:\n")
console.log(translation)