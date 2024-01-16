import {openai, supabase} from './config.js';

const favorite_movie = document.getElementById("favorite-movie");
const your_mood = document.getElementById("your-mood");
const have_fun = document.getElementById("have-fun");
const after_content = document.getElementById("content") ;
const after_btn = document.getElementById("after-btn");
const questioner = document.getElementById('submit-btn');

after_btn.addEventListener("click", loadUI);

let formHandler = function(e) {
    e.preventDefault()
    const input = favorite_movie.value + " and am in the mood for " + your_mood.value + " and am for a " + have_fun.value;
    favorite_movie.value="";
    your_mood.value="";
    have_fun.value="";
    main(input);
}

questioner.addEventListener("click", formHandler);

function loadUI() {
    window.location.reload();
}

async function main(input) {
    try {
        const embedding = await createEmbedding(input);
        const match = await findNearestMatch(embedding);
        const { title, description } = await getChatCompletion(match, input);
        after_content.innerHTML = `
            <div class="content">
            <h3 class="movie-title">${title}</h3>
            <p  class="movie-description">${description}</p>
        ` ;
        after_btn.style.display = "block";
    } catch (error) {
        console.error('Error in main function.', error.message);
    }
}

// Create an embedding vector representing the query
async function createEmbedding(input) {
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input
    });
    return embeddingResponse.data[0].embedding;
}

// Query Supabase and return a semantically matching text chunk
async function findNearestMatch(embedding) {
    const { data } = await supabase.rpc('match_popchoice', {
        query_embedding: embedding,
        match_threshold: 0.50,
        match_count: 4
    });
    return data.map(obj => obj.content).join('\n');
}

// Use OpenAI to make the response conversational
const chatMessages = [{
    role: 'system',
    content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.`
}];

async function getChatCompletion(text, query) {
    chatMessages.push({
        role: 'user',
        content: `Context: ${text} Question: ${query}`
    });

    const { choices } = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: chatMessages,
        temperature: 0.65,
        frequency_penalty: 0.5
    });

    const content = choices[0].message.content;
    let title = "";
    let description = "";

    if(content.match("Sorry, I don't know the answer"))  {
        if(content.match("However, if you're interested")) {
            title = content.match(/['"]{1}([^'"]+)['"]{1}/)[1];
        } else {
            title="No movie found";
            description="Nothing to describe";
            return {title, description};
        }
    }

    if(title === "") {
        title = content.match(/['"]{1}([^'"]+)['"]{1}/)[1];
    }


    description = content.match(/\. *(.*)/)[1];

    if(description === "") {
        description = "Nothing to describe";
    }

    if(title === "") {
        title="No movie found";
        description = "Nothing to describe";
    }
    return { title, description };
}
