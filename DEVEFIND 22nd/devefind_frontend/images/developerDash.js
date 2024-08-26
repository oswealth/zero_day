document.addEventListener('DOMContentLoaded', function() {
  // Fetch developer data and populate the dashboard
  fetchDeveloperData();

  // Form submissions and modal interactions
  document.getElementById('profileForm').addEventListener('submit', updateProfile);
  document.getElementById('educationForm').addEventListener('submit', updateEducation);
  document.getElementById('experienceForm').addEventListener('submit', updateExperience);
  document.getElementById('portfolioForm').addEventListener('submit', updatePortfolio);

  // Populate the form fields when the "Edit Profile" button is clicked
  document.querySelector('[data-target="#editProfileModal"]').addEventListener('click', function() {
    populateProfileForm();
  });
});

function fetchDeveloperData() {
  const token = localStorage.getItem('authToken');
  fetch('/api/developer', {
    method: 'GET',
    headers: {
      'X-Token': token,
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data.Developer) {
      populateProfile(data.Developer);
      populateEducation(data.Developer.education);
      populateExperience(data.Developer.experience);
      populatePortfolio(data.Developer.portfolio);
    } else {
      alert('Error fetching developer data');
    }
  })
  .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function populateProfile(developer) {
  document.getElementById('dev-name').textContent = `${developer.firstName} ${developer.lastName}`;
  document.getElementById('dev-age').textContent = `Age: ${developer.age}`;
  document.getElementById('dev-gender').textContent = `Gender: ${developer.gender}`;
  document.getElementById('dev-country').textContent = `Country: ${developer.country}`;
  document.getElementById('dev-profession').textContent = `Profession: ${developer.profession}`;
  document.getElementById('dev-email').textContent = `Email: ${developer.email}`;
  document.getElementById('dev-phone').textContent = `Phone: ${developer.phone}`;
  document.getElementById('dev-languages').textContent = `Languages: ${developer.languages.map(lang => `${lang.name} (${lang.level})`).join(', ')}`;
  document.getElementById('dev-summary').textContent = `Summary: ${developer.summary.headline} - ${developer.summary.description}`;
  document.getElementById('profile-image').src = developer.image || './images/png/user.png';
}

function populateProfileForm() {
  const token = localStorage.getItem('authToken');
  fetch('/api/developer', {
    method: 'GET',
    headers: {
      'X-Token': token,
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
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
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
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
