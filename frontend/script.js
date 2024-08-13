async function callApi(endpoint, method, data) {
    const response = await fetch(`/api/${endpoint}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'username': 'admin', // This should use real user authentication
            'password': 'password'
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}

async function transferFile() {
    const direction = document.getElementById('transferDirection').value;
    const sourceFile = document.getElementById('sourceFile').value;
    const destFile = document.getElementById('destFile').value;
    try {
        const result = await callApi('transfer', 'POST', { direction, sourceFile, destFile });
        alert(result.message);
    } catch (error) {
        alert('Error during file transfer: ' + error.message);
    }
}

async function manageUser() {
    const username = document.getElementById('username').value;
    const groupname = document.getElementById('groupname').value;
    const action = document.getElementById('userAction').value;
    try {
        const result = await callApi('user', 'POST', { action, username, groupname });
        alert(result.message);
    } catch (error) {
        alert('User management operation error: ' + error.message);
    }
}

async function manageACL() {
    const path = document.getElementById('aclPath').value;
    const user = document.getElementById('aclUser').value;
    const permissions = document.getElementById('aclPermissions').value;
    const action = document.getElementById('aclAction').value;
    try {
        const result = await callApi('acl', 'POST', { action, path, user, permissions });
        if (action === 'get') {
            alert('ACL information: ' + result.output);
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('ACL management operation error: ' + error.message);
    }
}

async function systemTask(task) {
    try {
        const result = await callApi('system', 'POST', { task });
        alert(result.message);
    } catch (error) {
        alert('Error during system task: ' + error.message);
    }
}