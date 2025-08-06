const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  const email = completion.choices[0].message.content;
  res.json({ email });
});

/*app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  const email = `
  Subject: Follow-up Regarding Your Request
  
  Dear Team,

  I hope this message finds you well. Based on your input: "${prompt}", here's a draft email you could send.

  Please let me know if you'd like any modifications.

  Best regards,  
  Harsha
  `;

  res.json({ email });
});*/

app.post('/send', async (req, res) => {
  const { to, body } = req.body;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'AI Generated Email',
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ status: 'Email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
