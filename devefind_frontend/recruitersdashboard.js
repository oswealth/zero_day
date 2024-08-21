document.addEventListener('DOMContentLoaded', () => {
    // Fetch and populate filters from filter.json
    fetch('/controller/filter.json')
        .then(response => response.json())
        .then(data => {
            populateDropdown('country-filter', data.country);
            populateDropdown('gender-filter', data.gender);
            populateDropdown('language-filter', data.languages);
            populateDropdown('proficiency-filter', data.proficiency);
            populateDropdown('level-filter', data.level);
            populateDropdown('profession-filter', data.profession);
        })
        .catch(error => console.error('Error fetching filters:', error));

    // Toggle filter dropdown
    const filterToggle = document.getElementById('filter-toggle');
    const filterDropdown = document.getElementById('filter-dropdown');

    filterToggle.addEventListener('click', () => {
        filterDropdown.classList.toggle('show');
    });

    // Show edit profile popup
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfilePopup = document.getElementById('edit-profile-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');

    editProfileBtn.addEventListener('click', () => {
        editProfilePopup.style.display = 'block';
    });

    closePopupBtn.addEventListener('click', () => {
        editProfilePopup.style.display = 'none';
    });

    // Handle profile edit form submission
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(editProfileForm);
            try {
                const response = await fetch('/api/recruiter', {
                    method: 'PUT',
                    headers: {
                        'X-Token': localStorage.getItem('authToken'),
                    },
                    body: formData,
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Profile updated successfully!');
                    editProfilePopup.style.display = 'none'; // Close the popup after saving
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        });
    }

    // Handle image upload
    const editProfilePicture = document.getElementById('edit-profile-picture');
    if (editProfilePicture) {
        editProfilePicture.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await fetch('/api/recruiter/image/update', {
                        method: 'PUT',
                        headers: {
                            'X-Token': localStorage.getItem('authToken'),
                        },
                        body: formData,
                    });
                    const result = await response.json();
                    if (response.ok) {
                        alert('Profile picture updated successfully!');
                        // Optionally update the UI with the new profile picture
                    } else {
                        alert(`Error: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Error uploading profile picture:', error);
                }
            }
        });
    }

    // Handle search form submission
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchQuery = document.getElementById('search-query').value;

            try {
                const response = await fetch(`/api/candidates/search?q=${encodeURIComponent(searchQuery)}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const candidates = await response.json();
                console.log('Search results:', candidates);
                // Code to display candidates goes here
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        });
    }

    // Handle pagination
    const profileCards = document.querySelectorAll(".profile-card");
    const nextButton = document.querySelector(".next-button");
    let currentIndex = 0;
    const cardsToShow = 2; // Number of cards to show at a time

    // Hide all cards initially
    profileCards.forEach((card, index) => {
        if (index >= cardsToShow) card.style.display = 'none';
    });

    nextButton.addEventListener('click', () => {
        profileCards.forEach((card) => {
            card.style.display = 'none';
        });
        currentIndex += cardsToShow;
        profileCards.forEach((card, index) => {
            if (index >= currentIndex && index < currentIndex + cardsToShow) {
                card.style.display = 'block';
            }
        });
    });

    // Display logged-in recruiter's info
    const fetchRecruiterData = async () => {
        try {
            const response = await fetch('/api/recruiter', {
                headers: {
                    'X-Token': localStorage.getItem('authToken'),
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch recruiter data');
            }
            const recruiter = await response.json();
            document.getElementById('recruiter-name').textContent = `${recruiter.firstname} ${recruiter.lastname}`;
            document.getElementById('recruiter-title').textContent = recruiter.title || 'Title not provided';
            document.getElementById('recruiter-org').textContent = recruiter.organization || 'Organization not provided';
            document.querySelector('.card-avatar').src = recruiter.image || '../static/user.png';
        } catch (error) {
            console.error('Error fetching recruiter data:', error);
        }
    };

    fetchRecruiterData();
});

// Function to populate dropdowns
function populateDropdown(elementId, options) {
    const selectElement = document.getElementById(elementId);
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.text = option;
        selectElement.appendChild(opt);
    });
}

// Function to update candidate list
function updateCandidateList(candidates) {
    const candidateList = document.getElementById('candidate-list');
    candidateList.innerHTML = ''; // Clear existing candidates
    candidates.forEach(candidate => {
        const candidateCard = document.createElement('div');
        candidateCard.className = 'candidate-card';
        candidateCard.innerHTML = `
            <h3>${candidate.name}</h3>
            <p>${candidate.profession}</p>
            <!-- Add more candidate details as needed -->
        `;
        candidateList.appendChild(candidateCard);
    });
}
