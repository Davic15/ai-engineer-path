import {openai} from './config.js';

const form = document.querySelector('form');
const input = document.querySelector('input');
const reply = document.querySelector('.reply');


const asstID = 'asst_IJxCso3BFFKNKNeMFcIB5X8N';
const threadID = 'thread_EdfAeetyZtgQiuLq2NW2eG5f';

form.addEventListener('submit', function(e) {
    e.preventDefault();
    main();
    input.value = '';
});

// Bring it all together
async function main() {
    reply.innerHTML = 'Thinking...';

    // Create a message
    await createMessage(input.value);

    // Create a run
    const run = await runThread();

    // Retrieve the current run
    let currentRun = await retrieveRun(threadID, run.id);

    // Keep Run status up to date
    // Poll for updates and check if run status is completed
    while (currentRun.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(currentRun.status);
        currentRun = await retrieveRun(threadID, run.id);
    }

    // Get messages from the thread
    const { data } = await listMessages();

    // Display the last message for the current run
    reply.innerHTML = data[0].content[0].text.value;
}

/* -- Assistants API Functions -- */

// Create a message
async function createMessage(question) {
    const threadMessages = await openai.beta.threads.messages.create(
        threadID,
        { role: "user", content: question }
    );
}

// Run the thread / assistant
async function runThread() {
    const run = await openai.beta.threads.runs.create(
        threadID,
        {
            assistant_id: asstID,
            instructions: `Please do not provide annotations in your reply. Only reply about movies in the provided file. If questions are not related to movies, respond with "Sorry, I don't know." Keep your answers short.`
        }
    );
    return run;
}

// List thread Messages
async function listMessages() {
    return await openai.beta.threads.messages.list(threadID);
}

// Get the current run
async function retrieveRun(thread, run) {
    return await openai.beta.threads.runs.retrieve(thread, run);
}