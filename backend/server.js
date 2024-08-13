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
    switch (task) {
        case 'backup':
            exec('mkdir -p ~/backup && tar -czf ~/backup/data_backup.tar.gz ~/data && rsync -avz ~/backup/data_backup.tar.gz ~/backup_destination', (error, stdout, stderr) => {
                if (error) {
                    res.json({ success: false, message: `Backup failed: ${stderr}` });
                } else {
                    res.json({ success: true, message: 'Backup completed successfully' });
                }
            });
            break;

        case 'dns':
            exec('sudo nano /etc/hosts && sudo systemctl restart systemd-resolved', (error, stdout, stderr) => {
                if (error) {
                    res.json({ success: false, message: `DNS configuration failed: ${stderr}` });
                } else {
                    res.json({ success: true, message: 'DNS configuration completed successfully' });
                }
            });
            break;

        case 'printer':
            exec('sudo apt-get update && sudo apt-get install -y cups && sudo systemctl start cups && sudo systemctl enable cups', (error, stdout, stderr) => {
                if (error) {
                    res.json({ success: false, message: `Printer sharing setup failed: ${stderr}` });
                } else {
                    exec('sudo cupsctl --share-printers && sudo systemctl restart cups', (error, stdout, stderr) => {
                        if (error) {
                            res.json({ success: false, message: `Printer sharing configuration failed: ${stderr}` });
                        } else {
                            res.json({ success: true, message: 'Printer sharing setup completed successfully' });
                        }
                    });
                }
            });
            break;
        
        default:
            res.json({ success: false, message: `Unknown system task: ${task}` });
            break;
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});