// Utility function for making API calls
async function callApi(endpoint, method, data) {
    const response = await fetch(`/api/${endpoint}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}

async function transferFile(direction) {
    const sourceFile = document.getElementById('sourceFile').value;
    const destFile = document.getElementById('destFile').value;
    try {
        const result = await callApi('transfer', 'POST', { direction, sourceFile, destFile });
        alert(`File transfer ${result.success ? 'successful' : 'failed'}: ${result.message}`);
    } catch (error) {
        alert('Error during file transfer: ' + error.message);
    }
}

async function manageUser(action) {
    const username = document.getElementById('username').value;
    try {
        const result = await callApi('user', 'POST', { action, username });
        alert(`User ${action} ${result.success ? 'successful' : 'failed'}: ${result.message}`);
    } catch (error) {
        alert('Error during user management: ' + error.message);
    }
}

async function systemTask(task) {
    try {
        const result = await callApi('system', 'POST', { task });
        alert(`${task} task ${result.success ? 'successful' : 'failed'}: ${result.message}`);
    } catch (error) {
        alert('Error during system task: ' + error.message);
    }
}