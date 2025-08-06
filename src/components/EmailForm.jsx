import { useState } from 'react';
import axios from 'axios';

export default function EmailForm() {
    const [recipients, setRecipients] = useState('');
    const [prompt, setPrompt] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [loading, setLoading] = useState(false);

    const generateEmail = async () => {
        setLoading(true);
        const res = await axios.post('http://localhost:5000/generate', { prompt });
        setEmailBody(res.data.email);
        setLoading(false);
    };

    const sendEmail = async () => {
        await axios.post('http://localhost:5000/send', {
            to: recipients,
            body: emailBody,
        });
        alert("Email sent!");
    };

    return (
        <div className="p-4 max-w-xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">AI Email Sender</h1>

            <input
                className="w-full p-2 border rounded"
                type="text"
                placeholder="Enter recipient email(s)"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
            />

            <textarea
                className="w-full p-2 border rounded"
                placeholder="Enter prompt to generate email"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />

            <button
                onClick={generateEmail}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {loading ? 'Generating...' : 'Generate Email'}
            </button>

            <textarea
                className="w-full p-2 border rounded h-40"
                placeholder="Generated email will appear here"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
            />

            <button
                onClick={sendEmail}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Send Email
            </button>
        </div>
    );
}
