document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    /* if (!token) {
        window.location.href = '/login.html';
        return;
    } */

    // Handle form submission
    document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const password = formData.get('edit-password');
        const confirmPassword = formData.get('edit-confirm-password');

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/recruiter', {
                method: 'PUT',
                headers: {
                    'X-Token': token,
                },
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                alert('Profile updated successfully!');
                window.location.href = 'recruitersDash.html';
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    });

    // Handle close button
    document.getElementById('close-form-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to discard changes?')) {
            window.location.href = 'recruitersDash.html';
        }
    });

    // Handle profile picture removal
    document.getElementById('remove-profile-picture').addEventListener('click', async () => {
        try {
            const response = await fetch('/api/recruiter/image/remove', {
                method: 'PUT',
                headers: {
                    'X-Token': token,
                },
            });

            const result = await response.json();
            if (response.ok) {
                alert('Profile picture removed successfully!');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error removing profile picture:', error);
        }
    });
});
