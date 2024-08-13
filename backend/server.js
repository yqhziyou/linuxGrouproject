const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('frontend'));

app.post('/api/transfer', (req, res) => {
    const { direction, sourceFile, destFile } = req.body;
    let command;

    switch (direction) {
        case 'windows-to-linux':
            command = `smbclient '//WINDOWS_IP/share' -c 'get "${sourceFile}" "${destFile}"'`;
            break;
        case 'linux-to-windows':
            command = `smbclient '//WINDOWS_IP/share' -c 'put "${sourceFile}" "${destFile}"'`;
            break;
        case 'linux-to-linux':
            command = `scp ${sourceFile} user@SERVER_IP:${destFile}`;
            break;
        default:
            res.json({ success: false, message: 'Invalid transfer direction' });
            return;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.json({ success: false, message: `File transfer failed: ${stderr}` });
        } else {
            res.json({ success: true, message: `File transfer initiated: ${sourceFile} to ${destFile}` });
        }
    });
});

app.post('/api/user', (req, res) => {
    const { action, username } = req.body;
    let command;

    if (action === 'add') {
        command = `sudo useradd ${username}`;
    } else if (action === 'remove') {
        command = `sudo userdel ${username}`;
    } else {
        res.json({ success: false, message: 'Invalid action' });
        return;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.json({ success: false, message: `Error ${action}ing user: ${stderr}` });
        } else {
            res.json({ success: true, message: `User ${username} ${action}ed successfully` });
        }
    });
});

app.post('/api/system', (req, res) => {
    const { task } = req.body;
    let command;

    switch (task) {
        case 'backup':
            command = 'tar -czf ~/backup/data_backup.tar.gz ~/data && rsync -avz ~/backup/data_backup.tar.gz ~/backup_destination';
            break;
        case 'dns':
            command = 'sudo nano /etc/hosts && sudo systemctl restart systemd-resolved';
            break;
        case 'printer':
            command = 'sudo apt-get update && sudo apt-get install -y cups && sudo systemctl start cups && sudo systemctl enable cups && sudo cupsctl --share-printers && sudo systemctl restart cups';
            break;
        default:
            res.json({ success: false, message: `Unknown system task: ${task}` });
            return;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.json({ success: false, message: `${task} task failed: ${stderr}` });
        } else {
            res.json({ success: true, message: `${task} task completed successfully` });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});