document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
        email,
        password,
    };

    try {
        const response = await fetch('/developer/login', { // or '/recruiter/login' for recruiter login
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Redirect to dashboard after login
            window.location.href = 'candidateProfile.html'; // Update to your actual dashboard URL
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
});

document.getElementById('auth0-login').addEventListener('click', function() {
    // Implement Auth0 login redirect
    // For example: auth0.loginWithRedirect();
    window.location.href = '/auth0-login'; // Placeholder for actual Auth0 login
});
