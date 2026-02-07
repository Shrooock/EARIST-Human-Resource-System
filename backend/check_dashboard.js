async function checkDashboardEndpoints() {
    const endpoints = [
        'http://localhost:5000/department',
        'http://localhost:5000/department-assignment',
        'http://localhost:5000/items',
        'http://localhost:5000/vocational',
        'http://localhost:5000/voluntary-work',
        'http://localhost:5000/work-experience'
    ];

    console.log('Checking Dashboard Endpoints...');

    for (const url of endpoints) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                console.log(`[passed] ${url} - Status: ${response.status}`);
            } else {
                console.log(`[FAILED] ${url} - Status: ${response.status}`);
            }
        } catch (error) {
            console.error(`[ERROR] ${url} - ${error.message}`);
        }
    }
}

checkDashboardEndpoints();
