import {openai, supabase} from './config.js';
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";

/*
  Challenge: Text Splitters, Embeddings, and Vector Databases!
    1. Use LangChain to split the content in movies.txt into smaller chunks.
    2. Use OpenAI's Embedding model to create an embedding for each chunk.
    3. Insert all text chunks and their corresponding embedding
       into a Supabase database table.
 */

/* Split movies.txt into text chunks.
Return LangChain's "output" – the array of Document objects. */
async function splitDocument(document) {
    const response = await fetch(document);
    const text = await response.text();
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 250,
        chunkOverlap: 35,
    });
    return await splitter.createDocuments([text]);
}

/* Create an embedding from each text chunk.
Store all embeddings and corresponding text in Supabase. */
// Function to add a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Function to create and store embeddings
async function createAndStoreEmbeddings() {
    const chunkData = await splitDocument("movies.txt");
    const data = [];

    for (const chunk of chunkData) {
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: chunk.pageContent
        });

        data.push({
            content: chunk.pageContent,
            embedding: embeddingResponse.data[0].embedding
        });

        // Wait for a specified time before making the next request
        // Adjust the delay time as needed to comply with the rate limit
        console.log(chunk)
        await delay(60000); // n seconds delay
    }

    await supabase.from('movies').insert(data);
    console.log('SUCCESS!');
}
createAndStoreEmbeddings();