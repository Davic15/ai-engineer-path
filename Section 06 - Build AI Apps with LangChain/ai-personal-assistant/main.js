import {ChatOpenAI} from 'langchain/chat_models/openai'
import {PromptTemplate} from 'langchain/prompts'
import {StringOutputParser} from 'langchain/schema/output_parser'
import {retriever} from '/utils/retriever'
import {combineDocuments} from '/utils/combineDocuments'
import {formatConvHistory} from '/utils/formatconvHistory'
import {RunnablePassthrough, RunnableSequence} from 'langchain/schema/runnable'

document.addEventListener('submit', (e) => {
    e.preventDefault()
    chatConversation()
})

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY
const llm = new ChatOpenAI({openAIApiKey})

const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question.
conversation history: {conv_history}
question: {question}
standalone question:
`
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `
You are a famous, helpful, and enthusiastic bot who can answer a given question about my personal info based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." Don't try to make up an answer. Respond like a famous celebrity-like also, make your answer short.
context: {context}
conversation history: {conv_history}
question: {question}
answer: 
`
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

const standaloneChain = RunnableSequence.from([
    standaloneQuestionPrompt,
    llm,
    new StringOutputParser()
])

const retrieverChain = RunnableSequence.from([
    prevResult => prevResult.standalone_question,
    retriever,
    combineDocuments
])

const answerChain = RunnableSequence.from([
    answerPrompt,
    llm,
    new StringOutputParser()
])

const chain = RunnableSequence.from([
    {
        standalone_question: standaloneChain,
        original_input: new RunnablePassthrough()
    },
    {
        context: retrieverChain,
        question: ({original_input}) => original_input.question,
        conv_history: ({original_input}) => original_input.conv_history
    },
    answerChain
])

const convHistory = []

async function chatConversation() {
    const userInput = document.getElementById('user-input');
    const chatbotConversation = document.getElementById('chatbot-conversation-container');
    const question = userInput.value;
    userInput.value = '';

    // Create HTML structure for user's question
    const newHumanChatbotContainer = document.createElement('div');
    newHumanChatbotContainer.classList.add('chatbot');
    const currentDate = new Date().toLocaleString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })
    newHumanChatbotContainer.innerHTML = `
        <span id='date'>${currentDate}</span>
        <div class='chatbot-inner'>
            <img src='./assets/user-photo.avif' class='user-avatar avatar' alt="avatar"/>
            <div class='speech speech-human'>${question}</div>
        </div>
    `;
    chatbotConversation.appendChild(newHumanChatbotContainer);
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

    const loader = document.createElement('div')
    loader.classList.add('loader-container')
    loader.innerHTML = `<div class='loader-container'>
                            <div class="loader">
                                <div class="loader__circle"></div>
                                <div class="loader__circle"></div>
                                <div class="loader__circle"></div>
                                <div class="loader__circle"></div>
                            </div>
                        </div>`
    chatbotConversation.appendChild(loader)

    // Get AI's response
    const response = await chain.invoke({
        question: question,
        conv_history: formatConvHistory(convHistory)
    });
    convHistory.push(question);
    convHistory.push(response);

    loader.remove()

    // Create HTML structure for AI's response
    const newAIChatbotContainer = document.createElement('div');
    newAIChatbotContainer.classList.add('chatbot');
    newAIChatbotContainer.innerHTML = `
        <span id='date'>${currentDate}</span>
        <div class='chatbot-inner'> 
            <div class='speech speech-ai'>${response}</div>
            <img src='./assets/friday.jpg' class='avatar' alt="img"/>
        </div>
    `
    chatbotConversation.appendChild(newAIChatbotContainer);
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}