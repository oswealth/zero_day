document.addEventListener('DOMContentLoaded', function() {
  // Fetch developer data and populate the dashboard
  fetchDeveloperData();

  // Form submissions and modal interactions
  document.getElementById('profileForm').addEventListener('submit', updateProfile);
  document.getElementById('educationForm').addEventListener('submit', updateEducation);
  document.getElementById('portfolioForm').addEventListener('submit', updatePortfolio);

  // Populate the form fields when the "Edit Profile" button is clicked
  document.querySelector('[data-target="#editProfileModal"]').addEventListener('click', populateProfileForm);
});

function fetchDeveloperData() {
  const token = localStorage.getItem('authToken');
  fetch('/api/developer', {
    method: 'GET',
    headers: {
      'X-Token': token,
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.Developer) {
      populateProfile(data.Developer);
      populateEducation(data.Developer.education);
      populatePortfolio(data.Developer.portfolio);
      populateSkills(data.Developer.skills);
      populateCertificates(data.Developer.certificates);
    } else {
      alert('Error fetching developer data');
    }
  })
  .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function populateProfile(developer) {
  // Profile Section
  document.getElementById('profile-image').src = developer.image || './images/png/user.png';
  document.getElementById('dev-name').textContent = `${developer.firstName} ${developer.lastName}`;
  document.getElementById('dev-country').textContent = developer.country;
  document.getElementById('dev-profession').textContent = developer.profession;

  // Contact Info
  document.getElementById('dev-age').textContent = developer.age;
  document.getElementById('dev-gender').textContent = developer.gender;
  document.getElementById('dev-email').textContent = developer.email;
  document.getElementById('dev-phone').textContent = developer.phone;

  // Language Info
  const languageList = document.getElementById('language-list');
  languageList.innerHTML = '';
  developer.languages.forEach(lang => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${lang.name} (${lang.level})`;
    languageList.appendChild(li);
  });

  // Summary Section
  document.getElementById('dev-headline').textContent = developer.summary.headline;
  document.getElementById('dev-description').textContent = developer.summary.description;
}

function populateProfileForm() {
  const token = localStorage.getItem('authToken');
  fetch('/api/developer', {
    method: 'GET',
    headers: {
      'X-Token': token,
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.Developer) {
      document.getElementById('firstName').value = data.Developer.firstName;
      document.getElementById('lastName').value = data.Developer.lastName;
      document.getElementById('age').value = data.Developer.age;
      document.getElementById('gender').value = data.Developer.gender;
      document.getElementById('country').value = data.Developer.country;
      document.getElementById('profession').value = data.Developer.profession;
      document.getElementById('email').value = data.Developer.email;
      document.getElementById('phone').value = data.Developer.phone;
      document.getElementById('languages').value = data.Developer.languages.map(lang => `${lang.name}-${lang.level}`).join(', ');
      document.getElementById('headline').value = data.Developer.summary.headline;
      document.getElementById('description').value = data.Developer.summary.description;
    } else {
      alert('Error fetching developer data for form population');
    }
  })
  .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function updateProfile(event) {
  event.preventDefault();
  const token = localStorage.getItem('authToken');

  const profileData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    country: document.getElementById('country').value,
    profession: document.getElementById('profession').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    languages: document.getElementById('languages').value.split(',').map(lang => {
      const [name, level] = lang.split('-');
      return { name: name.trim(), level: level.trim() };
    }),
    summary: {
      headline: document.getElementById('headline').value,
      description: document.getElementById('description').value
    }
  };

  fetch('/api/developer', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token,
    },
    body: JSON.stringify(profileData),
  })
  .then(response => response.json())
  .then(data => {
    if (data.Developer) {
      populateProfile(data.Developer);
      $('#editProfileModal').modal('hide');
    } else {
      alert('Error updating profile');
    }
  })
  .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function populateEducation(educationList) {
  const educationContainer = document.getElementById('education-list');
  educationContainer.innerHTML = ''; // Clear existing items
  educationList.forEach(edu => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution}`;
    educationContainer.appendChild(li);
  });
}

function updateEducation(event) {
  event.preventDefault();
  const token = localStorage.getItem('authToken');

  const educationData = {
    degree: document.getElementById('degree').value,
    fieldOfStudy: document.getElementById('fieldOfStudy').value,
    institution: document.getElementById('institution').value
  };

  fetch('/api/developer/education', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token,
    },
    body: JSON.stringify(educationData),
  })
  .then(response => response.json())
  .then(data => {
    if (data.Developer) {
      populateEducation(data.Developer.education);
      $('#editEducationModal').modal('hide');
    } else {
      alert('Error updating education');
    }
  })
  .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function populatePortfolio(portfolioList) {
  const portfolioContainer = document.getElementById('portfolio-list');
  portfolioContainer.innerHTML = ''; // Clear existing items
  if (portfolioList.length === 0) {
    portfolioContainer.innerHTML = '<p>No portfolio items added.</p>';
  } else {
    portfolioList.forEach(port => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${port.projectTitle} - ${port.description}`;
      portfolioContainer.appendChild(li);
    });
  }
}

function updatePortfolio(event) {
  event.preventDefault();
  const token = localStorage.getItem('authToken');

  const portfolioData = {
    projectTitle: document.getElementById('projectTitle').value,
    description: document.getElementById('description').value
  };

  fetch('/api/developer/portfolio', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token,
    },
    body: JSON.stringify(portfolioData),
  })
  .then(response => response.json())
  .then(data => {
    if (data.Developer) {
      populatePortfolio(data.Developer.portfolio);
      $('#editPortfolioModal').modal('hide');
    } else {
      alert('Error updating portfolio');
    }
  })
  .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function populateSkills(skillsList) {
  const skillsContainer = document.getElementById('skills-section');
  skillsContainer.innerHTML = ''; // Clear existing items
  skillsList.forEach(skill => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = skill;
    skillsContainer.appendChild(li);
  });
}

function populateCertificates(certificatesList) {
  const certificatesContainer = document.getElementById('certificates-section');
  certificatesContainer.innerHTML = ''; // Clear existing items
  certificatesList.forEach(cert => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = cert;
    certificatesContainer.appendChild(li);
  });
}
