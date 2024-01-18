import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const sbUrl = import.meta.env.VITE_SUPABASE_URL;
const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY

try {
    const result = await fetch('scrimba-info.txt')
    const text = await result.text()
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
        separators: ['\n\n', '\n', ' ', ''] // default setting
    })

    const output = await splitter.createDocuments([text])

    const client = createClient(sbUrl, sbApiKey)

    await SupabaseVectorStore.fromDocuments(
        output,
        new OpenAIEmbeddings({ openAIApiKey }),
        {
            client,
            tableName: 'documents',
        }
    )
    console.log('done');
} catch (err) {
    console.log(err)
}