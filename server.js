const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const questions = require('./questions');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get the QR code URL
app.get('/qrcode', (req, res) => {
    const url = `http://192.168.10.153:3000/game`; // Use your local IP address
    QRCode.toDataURL(url, (err, code) => {
        if (err) res.status(500).send(err);
        res.send(code);
    });
});

// Serve game page
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// Endpoint to get questions
app.get('/questions', (req, res) => {
    res.json(questions);
});

// Endpoint to submit answer
app.post('/answer', (req, res) => {
    const { answer } = req.body;
    const correctAnswer = questions[req.body.questionIndex].correct;

    if (answer === correctAnswer) {
        res.json({ message: 'Congratulations', correct: true });
    } else {
        res.json({ message: 'Wrong answer', correct: false });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
