import {openai} from './config'
import {functions, getCurrentWeather, getLocation} from './tools'

const minusBtn = document.getElementById('minus')
const addBtn = document.getElementById('add')
const counterEl = document.getElementById('counter')
const departureLocation = document.getElementById('departure-location')
const destinationLocation = document.getElementById('destination-location')
const startDate = document.getElementById('start-date')
const endDate = document.getElementById('end-date')
const budget = document.getElementById('budget')
const submitBtn = document.getElementById('submit-btn')
const fromDateEl = document.getElementById('from-date')
const toDate = document.getElementById('to-date')
const weatherEl = document.getElementById('weather')
const departure = document.getElementById('departure')
const destination = document.getElementById('destination')
const loader = document.getElementById('loader')
const bookingContainer = document.getElementById('booking-container')
const backBtn = document.getElementById('back-btn')
const bookedContainer = document.getElementById('booked-container')
const home = document.getElementById('home')
const homeBtn = document.getElementById('home-btn')

homeBtn.addEventListener('click', () => {
    home.classList.add('hidden')
    bookingContainer.classList.add('show')
})

let count = 0

function updateCount() {
    if (counterEl) {
        counterEl.textContent = count
    }
}

function add() {
    count = count + 1
    updateCount()
}

function subtract() {
    if (count > 0) {
        count = count - 1
        updateCount()
    }
}

if (addBtn && minusBtn) {
    addBtn.addEventListener('click', add)
    minusBtn.addEventListener('click', subtract)
}
updateCount()

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


submitBtn.addEventListener('click', async () => {
    const bookingDetails = [count, departureLocation.value, destinationLocation.value, startDate.value, endDate.value, budget.value].join(', ')

    if (!departureLocation.value || !destinationLocation.value || !startDate.value || !endDate.value || !budget.value) {
        alert('Please fill out all required fields.');
        return;
    }

    if (bookingDetails) {
        bookingContainer.classList.remove('show')
        loader.style.display = 'block'
        bookingContainer.classList.add('hidden')


        await weatherAgent(bookingDetails)
        await delay(20000); // n seconds delay
        await flightAgent(bookingDetails)
        await delay(20000); // n seconds delay
        await hotelRecoAgent(bookingDetails)
        await delay(20000); // n seconds delay
        await activityReco(count, bookingDetails)
        await delay(20000); // n seconds delay

        loader.style.display = 'none'
        bookedContainer.classList.add('show')

        fromDateEl.textContent = startDate.value
        toDate.textContent = endDate.value
        destination.textContent = destinationLocation.value
        departure.textContent = departureLocation.value

        count = 0
        departureLocation.value = ''
        destinationLocation.value = ''
        startDate.value = ''
        endDate.value = ''
        budget.value = ''
        updateCount()
    }
})

backBtn.addEventListener('click', () => {
    bookingContainer.classList.remove('hidden')
    bookedContainer.classList.remove('show')
    bookingContainer.classList.add('show')
})

const availableFunctions = {
    getCurrentWeather,
    getLocation
}

async function weatherAgent(bookingDetails) {
    try {
        const messages = [
            {
                role: 'system',
                content: `
        You are a helpful AI agent. Transform technical data into engaging, 
        conversational responses, but only include the normal information a 
        regular person might want unless they explicitly ask for more. Provide 
        highly specific answers based on the information you're given. Prefer 
        to gather information with the tools provided to you rather than 
        giving basic, generic answers.
        `
            }, {
                role: 'user',
                content: `agent: ${bookingDetails}`
            }
        ]
        const runner = openai.beta.chat.completions.runFunctions({
            model: 'gpt-3.5-turbo-1106',
            messages,
            functions
        })
        weatherEl.textContent = await runner.finalContent()
    } catch (error) {
        alert(error.message)
        throw error
    }
}

async function flightAgent(bookingDetails) {
    try {
        const chatMessages = [
            {
                role: 'system',
                content: `You are an enthusiastic travel agent who loves recommending flights to people. Your main job is to formulate a short answer recommending airlines according to the destination Location. Example provided between ### to base your tone and style of recommending`
            },
            {
                role: 'user',
                content: `
        ###
        The best option for you is with Delta Airlines with a layover in Oslo
        ###
        agent: ${bookingDetails} `
            }]
        const {choices} = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            messages: chatMessages,
            temperature: 0.65,
            frequency_penalty: 0.50
        })
        document.getElementById('flight-message').textContent = choices[0].message.content
    } catch (error) {
        alert(error.message)
        throw error
    }
}

async function hotelRecoAgent(destination) {
    let msg;
    try {
        const chatMessages = [
            {
                role: 'system',
                content: `You are an enthusiastic travel agent who loves recommending nearby hotels based on their destination location, recommend nearby hotels near tourist spots according to the destination location. Your main job is to formulate a short answer. Example provided between ### to base your tone and style of recommending`
            },
            {
                role: 'user',
                content: `
        ###
        We recommend you stay at the Premiere Inn hotel in central Paris
        ###
        agent: ${destination} `
            }]

        const {choices} = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            messages: chatMessages,
            temperature: 0.65,
            frequency_penalty: 0.50
        })
        document.getElementById('hotel-reco').textContent = choices[0].message.content
    } catch (error) {
        alert(error.message)
        throw error
    }
}

async function activityReco(count, bookingDetails) {
    try {
        const chatMessages = [
            {
                role: 'system',
                content: `You are an enthusiastic travel agent who loves recommending top activities based on travellers count, destination, budget and weather. Your main job is to formulate a short answer and recommend 3 top activities. `
            },
            {
                role: 'user',
                content: `agent: ${count} ${bookingDetails} `
            }]

        const {choices} = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            messages: chatMessages,
            temperature: 0.65,
            frequency_penalty: 0.50
        })
        document.getElementById('activity-reco').textContent = choices[0].message.content
    } catch (error) {
        alert(error.message)
        throw error
    }
}