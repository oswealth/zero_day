document.addEventListener('DOMContentLoaded', function() {
    fetchDeveloperData();
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
            populateProfileView(data.Developer);
        } else {
            alert('Error fetching developer data');
        }
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function populateProfileView(developer) {
    document.getElementById('profile-image').src = developer.image || './images/png/user.png';
    document.getElementById('dev-name').textContent = `${developer.firstName} ${developer.lastName}`;
    document.getElementById('dev-profession').textContent = developer.profession;
    document.getElementById('dev-country').textContent = developer.country;

    document.getElementById('github-link').href = developer.socials.github || '#';
    document.getElementById('linkedin-link').href = developer.socials.linkedIn || '#';
    document.getElementById('facebook-link').href = developer.socials.facebook || '#';
    document.getElementById('blogs-link').href = developer.socials.blogs || '#';
    document.getElementById('website-link').href = developer.socials.website || '#';

    document.getElementById('dev-age').textContent = developer.age;
    document.getElementById('dev-gender').textContent = developer.gender;
    document.getElementById('dev-email').textContent = developer.email;
    document.getElementById('dev-phone').textContent = developer.phone;

    document.getElementById('dev-summary').textContent = `${developer.summary.headline} - ${developer.summary.description}`;

    populateList('language-list', developer.languages.map(lang => `${lang.name} (${lang.level})`));
    populateList('education-list', developer.education.map(edu => `${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution}`));
    populateList('portfolio-list', developer.portfolio.map(port => `${port.projectTitle} - ${port.description}`));
    populateList('skills-list', developer.skills);
    populateList('certificates-list', developer.certificates);
}

function populateList(elementId, items) {
    const list = document.getElementById(elementId);
    list.innerHTML = ''; // Clear existing items
    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = item;
        list.appendChild(li);
    });
}
