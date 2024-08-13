const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('frontend'));

app.post('/api/transfer', (req, res) => {
    const { direction, sourceFile, destFile } = req.body;
    // Here you would implement the actual file transfer logic
    // For example, using scp or rsync
    res.json({ success: true, message: `File transfer initiated: ${sourceFile} to ${destFile}` });
});

app.post('/api/user', (req, res) => {
    const { action, username } = req.body;
    if (action === 'add') {
        exec(`sudo useradd ${username}`, (error, stdout, stderr) => {
            if (error) {
                res.json({ success: false, message: `Error adding user: ${stderr}` });
            } else {
                res.json({ success: true, message: `User ${username} added successfully` });
            }
        });
    } else if (action === 'remove') {
        exec(`sudo userdel ${username}`, (error, stdout, stderr) => {
            if (error) {
                res.json({ success: false, message: `Error removing user: ${stderr}` });
            } else {
                res.json({ success: true, message: `User ${username} removed successfully` });
            }
        });
    }
});

app.post('/api/system', (req, res) => {
    const { task } = req.body;
    // Implement system tasks here
    res.json({ success: true, message: `System task ${task} initiated` });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});