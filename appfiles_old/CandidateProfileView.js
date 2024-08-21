document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const candidateId = urlParams.get('id'); // Assume ID is passed as a query parameter
  
    if (candidateId) {
      try {
        const response = await fetch(`http://localhost:5000/api/developer/${candidateId}`); // Adjust API endpoint as needed
        const candidate = await response.json();
  
        document.getElementById('welcome-message').textContent = `Welcome, ${candidate.firstName} ${candidate.lastName}`;
        document.getElementById('email').textContent = candidate.email || '';
        document.getElementById('country').textContent = candidate.country || '';
        document.getElementById('phone-number').textContent = candidate.phoneNumber || '';
        document.getElementById('professional-background').textContent = candidate.professionalBackground || '';
        document.getElementById('years-of-experience').textContent = candidate.yearsOfExperience || '';
        document.getElementById('employment-status').textContent = candidate.employmentStatus || '';
        document.getElementById('summary').textContent = candidate.summary || '';
  
        const languagesList = document.getElementById('languages-list');
        if (candidate.languages && Array.isArray(candidate.languages)) {
          languagesList.innerHTML = candidate.languages.map(lang => `<li>${lang.language} (${lang.proficiency})</li>`).join('');
        }
  
        const skillsList = document.getElementById('skills-list');
        if (candidate.skills && Array.isArray(candidate.skills)) {
          skillsList.innerHTML = candidate.skills.map(skill => `<li>${skill}</li>`).join('');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        window.location.href = '/error.html';
      }
    } else {
      window.location.href = '/error.html';
    }
  });
  