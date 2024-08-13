const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const auth = (req, res, next) => {
    const { username, password } = req.headers;

    // This should use a more secure method of storing and comparing passwords
    if (username === 'admin' && password === 'password') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Authentication failed' });
    }
};

app.use('/api/user', auth);
app.use('/api/system', auth);
app.use('/api/acl', auth);

app.post('/api/transfer', (req, res) => {
    const { direction, sourceFile, destFile } = req.body;
    let command;

    switch (direction) {
        case 'aws-to-windows':
            command = `smbclient '//${process.env.WINDOWS_IP}/share' -U ${process.env.WINDOWS_USER}%${process.env.WINDOWS_PASS} -c 'put "${sourceFile}" "${destFile}"'`;
            break;
        case 'windows-to-aws':
            command = `smbclient '//${process.env.WINDOWS_IP}/share' -U ${process.env.WINDOWS_USER}%${process.env.WINDOWS_PASS} -c 'get "${sourceFile}" "${destFile}"'`;
            break;
        case 'aws-to-linux':
            command = `scp -i ${process.env.SSH_KEY_PATH} "${sourceFile}" "${process.env.LINUX_USER}@${process.env.LINUX_IP}:${destFile}"`;
            break;
        case 'linux-to-aws':
            command = `scp -i ${process.env.SSH_KEY_PATH} "${process.env.LINUX_USER}@${process.env.LINUX_IP}:${sourceFile}" "${destFile}"`;
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
    const { action, username, groupname } = req.body;
    let command;

    switch (action) {
        case 'add':
            command = `sudo useradd ${username}`;
            break;
        case 'remove':
            command = `sudo userdel ${username}`;
            break;
        case 'addToGroup':
            command = `sudo usermod -aG ${groupname} ${username}`;
            break;
        case 'removeFromGroup':
            command = `sudo gpasswd -d ${username} ${groupname}`;
            break;
        case 'createGroup':
            command = `sudo groupadd ${groupname}`;
            break;
        case 'deleteGroup':
            command = `sudo groupdel ${groupname}`;
            break;
        default:
            res.json({ success: false, message: 'Invalid action' });
            return;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.json({ success: false, message: `User/group operation failed: ${stderr}` });
        } else {
            res.json({ success: true, message: `User/group operation completed successfully` });
        }
    });
});

app.post('/api/acl', (req, res) => {
    const { action, path, user, permissions } = req.body;
    let command;

    switch (action) {
        case 'set':
            command = `sudo setfacl -m u:${user}:${permissions} ${path}`;
            break;
        case 'get':
            command = `sudo getfacl ${path}`;
            break;
        default:
            res.json({ success: false, message: 'Invalid action' });
            return;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.json({ success: false, message: `ACL operation failed: ${stderr}` });
        } else {
            res.json({ success: true, message: `ACL operation completed successfully`, output: stdout });
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
            command = 'sudo sed -i "/^127.0.0.1/c\\127.0.0.1 localhost $(hostname)" /etc/hosts && sudo systemctl restart systemd-resolved';
            break;
        case 'printer':
            command = 'sudo apt-get update && sudo DEBIAN_FRONTEND=noninteractive apt-get install -y cups && sudo systemctl start cups && sudo systemctl enable cups && sudo cupsctl --share-printers --remote-any && sudo systemctl restart cups';
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