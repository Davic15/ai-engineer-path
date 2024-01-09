import { listModels } from "@huggingface/hub";

const token = import.meta.env.VITE_HUGGING_FACE_API;

async function isModelInferenceEnabled(modelName) {
    const response = await fetch(`https://api-inference.huggingface.co/status/${modelName}`)
    const data = await response.json()
    return data.state == "Loadable"
}

const models = []

for await (const model of listModels({
    credentials: {
        accessToken: token
    },
    search: {
        task: "text-to-image"
    }
})) {
    if (model.likes < 2000) {
        continue
    }

    if (await isModelInferenceEnabled(model.name)) {
        models.push(model)
    }
}

models.sort((model1, model2) => model2.likes - model1.likes)
for (const model of models) {
    console.log(`${model.likes} Likes: https://huggingface.co/${model.name}`)
}