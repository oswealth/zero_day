document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');

    /* if (!token) {
        window.location.href = '/login.html';
        return;
    } */
    // Fetch and populate filters from filter.json
    fetch('/api/filters')
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
    const removeProfilePictureBtn = document.getElementById('remove-profile-picture');
    const deleteProfileBtn = document.getElementById('delete-profile');

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
                        'X-Token': token, // Include the token in the headers
                    },
                    body: formData,
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Profile updated successfully!');
                    editProfilePopup.style.display = 'none';
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        });
    }

    // Handle profile picture removal
    if (removeProfilePictureBtn) {
        removeProfilePictureBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/recruiter/image/remove', {
                    method: 'PUT',
                    headers: {
                        'X-Token': token, // Include the token in the headers
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
    }

    // Handle profile deletion
    if (deleteProfileBtn) {
        deleteProfileBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete your profile?')) {
                try {
                    const response = await fetch('/api/recruiter', {
                        method: 'DELETE',
                        headers: {
                            'X-Token': token, // Include the token in the headers
                        },
                    });

                    const result = await response.json();
                    if (response.ok) {
                        alert('Profile deleted successfully!');
                        // Redirect or update UI after deletion
                    } else {
                        alert(`Error: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Error deleting profile:', error);
                }
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
                            'X-Token': token,
                        },
                        body: formData,
                    });
                    const result = await response.json();
                    if (response.ok) {
                        alert('Profile picture updated successfully!');
                        // Optionally update the UI with the new profile picture
                        location.reload();
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
                displayProfiles(candidates);
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        });
    }

    // Handle pagination
  const profileContainer = document.getElementById('profile-container');
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  let currentIndex = 0;
  const cardsToShow = 6; // Number of cards to show at a time

  const fetchProfiles = async () => {
      try {
          const response = await fetch('/api/developer/all', {
              headers: {
                  'X-Token': token,
              },
          });
          if (!response.ok) {
              throw new Error('Failed to fetch profiles');
          }
          const profiles = await response.json();
          displayProfiles(profiles);
      } catch (error) {
          console.error('Error fetching profiles:', error);
      }
  };

  const displayProfiles = (profiles) => {
    profileContainer.innerHTML = ''; // Clear existing profiles
  
    const profilesToDisplay = profiles.slice(currentIndex, currentIndex + cardsToShow);
  
    profilesToDisplay.forEach(profile => {
        const profileCard = document.createElement('div');
        profileCard.className = 'profile-card';
        profileCard.innerHTML = `
            <img
                src="${profile.image || './images/png/user.png'}"
                alt="${profile.firstName} ${profile.lastName} avatar"
                width="100"
                height="100"
                class="card-avatar"
            />
            <div class="profile-info">
                <h3>${profile.firstName} ${profile.lastName}</h3>
                <p>Profession: ${profile.profession}</p>
                <p>Experience: ${profile.experience || 'N/A'} Years</p>
                <p>Country: ${profile.country || 'N/A'}</p>
                <p>Skills: ${profile.skills ? profile.skills.join(', ') : 'N/A'}</p>
                <p>Status: ${profile.status || 'N/A'}</p>
                <p>Summary: ${profile.summary.headline || 'N/A'}</p>
            </div>
        `;
        profileContainer.appendChild(profileCard);
    });
  
    // Update button states
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex + cardsToShow >= profiles.length;
  };
  
  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex -= cardsToShow;
        fetchProfiles();
    }
  });
  
  nextButton.addEventListener('click', () => {
    currentIndex += cardsToShow;
    fetchProfiles();
  });
  
  

    // Display logged-in recruiter's info
    const fetchRecruiterData = async () => {
        try {
            const response = await fetch('/api/recruiter', {
                headers: {
                    'X-Token': token,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch recruiter data');
            }
            const recruiter = await response.json();
            document.getElementById('recruiter-name').textContent = `${recruiter.recruiter.firstName} ${recruiter.recruiter.lastName}`;
            document.getElementById('recruiter-title').textContent = recruiter.recruiter.title || 'Title not provided';
            document.getElementById('recruiter-org').textContent = recruiter.recruiter.organization || 'Organization not provided';
            document.querySelector('.card-avatar').src = recruiter.recruiter.image || '../static/user.png';
        } catch (error) {
            console.error('Error fetching recruiter data:', error);
        }
    };

    fetchRecruiterData();

    // Log Out
    const logOutBtn = document.querySelector('#logOutBtn');
    logOutBtn.addEventListener('click', async () => {
        
        try {
          const response = await fetch('/recruiter/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-token': token,
            },
          });
    
          if (response.ok) {
            const result = await response.json();
            alert(result.message);
            sessionStorage.removeItem('token');
            window.location.href = '/login.html';
          } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      });
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
/* function updateCandidateList(candidates) {
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
} */
