
require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

async function testOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    console.log('Testing OpenAI Key:', apiKey ? 'Present (Length: ' + apiKey.length + ')' : 'Missing');

    if (!apiKey) {
        console.error('❌ OPENAI_API_KEY is missing');
        return;
    }

    const openai = new OpenAI({ apiKey });

    try {
        console.log('Sending request to OpenAI...');
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Say "OpenAI is working" if you can hear me.' }],
            model: 'gpt-4o-mini',
        });

        console.log('✅ Response:', completion.choices[0].message.content);
    } catch (error) {
        console.error('❌ OpenAI Error:', error);
    }
}

testOpenAI();
