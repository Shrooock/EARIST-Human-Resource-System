async function checkBackend() {
    try {
        const response = await fetch('http://localhost:5000/api/settings');
        if (response.ok) {
            console.log('Backend connection successful!');
            const data = await response.json();
            console.log('Data:', data);
        } else {
            console.log('Backend returned status:', response.status);
        }
    } catch (error) {
        console.error('Backend connection failed:', error.message);
    }
}

checkBackend();
