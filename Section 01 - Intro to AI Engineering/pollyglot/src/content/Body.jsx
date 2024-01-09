import React, {useState} from 'react';
import {Form} from "./Form.jsx";
import OpenAI from 'openai';

export const Body = () => {
    const [showResults, setShowResults] = useState(false)
    const [formInput, setFormInput] = useState({fr: false, sp: false, jpn: false})
    const [textInput, setTextInput] = useState('')
    const [translationInput, setTranslationInput] = useState('')
    const [areFieldsEmpty, setAreFieldsEmpty] = useState(false)

    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });

    const responseText = async (message, lang) => {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages:[
                    {
                        role: 'system',
                        content: 'You are a translator, the user is going to write a phrase in English and select what language they want said phrase translated into, you are going to respond in the most precise way possible.'
                    },
                    {
                        role: 'user',
                        content: `${message}. translation language: ${lang}`
                    }
                ]
            });
            setTranslationInput(response.choices[0].message.content)
        } catch (err) {
            console.log(err)
        }
    }

    const isLangSelected = () => {
        let isTrue = false;
        for (const key in formInput) {
            if (formInput[key]) {
                isTrue = true;
                break;
            }
        }
        return isTrue;
    }

    const translationLang = () => {
        let lang = '';
        if (formInput.fr) {
            lang = 'french'
        } else if (formInput.sp) {
            lang = 'spanish'
        } else if (formInput.jpn) {
            lang = 'japanese'
        }
        return lang;
    }

    const submitHandler = (e) => {
        e.preventDefault()
        if (isLangSelected() && textInput.length !== 0) {
            const lang = translationLang()
            responseText(textInput, lang)
            setAreFieldsEmpty(false)
            setShowResults(true)
        } else {
            setAreFieldsEmpty(true)
        }
    }

    const changeHandler = (e) => {
        setTextInput(e.target.value)
    }

    const startOverHandler = () => {
        setShowResults(false)
        setTextInput('')
        setFormInput({fr: false, sp: false, jpn: false})
        setTranslationInput('')
    }

    const renderBody = () => {
        if (showResults) {
            return (<>
                <p className='blue-title'>Original text 👇</p>
                <textarea
                    className='text-area'
                    value={textInput}
                    onChange={(e) => {
                        changeHandler(e)
                    }}
                />
                <p className='blue-title'>Your translation 👇</p>
                <textarea
                    className='text-area'
                    value={translationInput}
                    onChange={(e) => {
                        changeHandler(e)
                    }}
                />
                <button
                    className='submit-btn'
                    onClick={(e) => {
                        startOverHandler(e)
                    }}
                >Start over
                </button>
            </>)
        } else {
            return (
                <>
                    <p className='blue-title'>Text to Translate 👇</p>
                    <textarea
                        className='text-area'
                        value={textInput}
                        onChange={(e) => {
                            changeHandler(e)
                        }}
                    />
                    <p className='blue-title'>Select language 👇</p>
                    <Form
                        formInput={formInput}
                        setFormInput={setFormInput}/>
                    <button
                        className='submit-btn'
                        onClick={(e) => {
                            submitHandler(e)
                        }}
                    >Translate
                    </button>
                </>
            )
        }
    }

    return (
        <section className='body-section'>
            {renderBody()}
        </section>
    )
}
