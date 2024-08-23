document.addEventListener('DOMContentLoaded', function() {
  // Fetch developer data and populate the dashboard
  fetchDeveloperData();

  // Form submissions and modal interactions
  document.getElementById('profileForm').addEventListener('submit', updateProfile);
  document.getElementById('educationForm').addEventListener('submit', updateEducation);
  document.getElementById('experienceForm').addEventListener('submit', updateExperience);
  document.getElementById('portfolioForm').addEventListener('submit', updatePortfolio);
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
      populateExperience(data.Developer.experience);
      populatePortfolio(data.Developer.portfolio);
    } else {
      alert('Error fetching developer data');
    }
  });
}

function populateProfile(developer) {
  document.getElementById('dev-name').textContent = `${developer.firstName} ${developer.lastName}`;
  document.getElementById('dev-summary').textContent = developer.summary?.headline || 'No summary available';
  document.getElementById('profile-image').src = developer.image || 'profile_image_placeholder.jpg';
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

function populateExperience(experienceList) {
  const experienceContainer = document.getElementById('experience-list');
  experienceContainer.innerHTML = ''; // Clear existing items
  experienceList.forEach(exp => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${exp.position} at ${exp.company}`;
    experienceContainer.appendChild(li);
  });
}

function populatePortfolio(portfolioList) {
  const portfolioContainer = document.getElementById('portfolio-list');
  portfolioContainer.innerHTML = ''; // Clear existing items
  portfolioList.forEach(port => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${port.projectTitle} - ${port.description}`;
    portfolioContainer.appendChild(li);
  });
}

function updateProfile(event) {
  event.preventDefault();
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const token = localStorage.getItem('authToken');

  fetch('/api/developer', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token,
    },
    body: JSON.stringify({ firstName, lastName }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.Developer) {
      populateProfile(data.Developer);
      $('#editProfileModal').modal('hide');
    } else {
      alert('Error updating profile');
    }
  });
}

function updateEducation(event) {
  event.preventDefault();
  const educationList = []; // Populate this with the form data
  const token = localStorage.getItem('authToken');

  // Collect data from the form
  const degree = document.getElementById('degree').value;
  const fieldOfStudy = document.getElementById('fieldOfStudy').value;
  const institution = document.getElementById('institution').value;

  educationList.push({ degree, fieldOfStudy, institution });

  fetch('/api/developer/education', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token,
    },
    body: JSON.stringify({ education: educationList }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.Developer) {
      populateEducation(data.Developer.education);
      $('#editEducationModal').modal('hide');
    } else {
      alert('Error updating education');
    }
  });
}

function updateExperience(event) {
  event.preventDefault();
  const experienceList = []; // Populate this with the form data
  const token = localStorage.getItem('authToken');

  // Collect data from the form
  const position = document.getElementById('position').value;
  const company = document.getElementById('company').value;

  experienceList.push({ position, company });

  fetch('/api/developer/experience', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token,
    },
    body: JSON.stringify({ experience: experienceList }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.Developer) {
      populateExperience(data.Developer.experience);
      $('#editExperienceModal').modal('hide');
    } else {
      alert('Error updating experience');
    }
  });
}

function updatePortfolio(event) {
  event.preventDefault();
  const portfolioList = []; // Populate this with the form data
  const token = localStorage.getItem('authToken');

  // Collect data from the form
  const projectTitle = document.getElementById('projectTitle').value;
  const description = document.getElementById('description').value;

  portfolioList.push({ projectTitle, description });

  fetch('/api/developer/portfolio', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Token': token,
    },
    body: JSON.stringify({ portfolio: portfolioList }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.Developer) {
      populatePortfolio(data.Developer.portfolio);
      $('#editPortfolioModal').modal('hide');
    } else {
      alert('Error updating portfolio');
    }
  });
}
