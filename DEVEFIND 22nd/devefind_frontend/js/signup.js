function populateDropdown(elementId, options) {
  const selectElement = document.getElementById(elementId);
  options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.text = option;
      selectElement.appendChild(opt);
  });
}

document.addEventListener('DOMContentLoaded', () => {

  fetch('/api/filters')
  .then(response => response.json())
  .then(data => {
      populateDropdown('country-filter', data.country);
      populateDropdown('gender-filter', data.gender);
      populateDropdown('profession-filter', data.profession);
  })

  .catch(error => console.error('Error fetching filters:', error));
    const jobSeekerForm = document.getElementById('job-seeker-form');
    const recruiterForm = document.getElementById('recruiter-form');
  
    const jobSeekerBtn = document.getElementById('job-seeker-btn');
    const recruiterBtn = document.getElementById('recruiter-btn');
  
    jobSeekerBtn.addEventListener('click', () => {
      jobSeekerForm.style.display = 'block';
      recruiterForm.style.display = 'none';
      jobSeekerBtn.classList.add('active');
      recruiterBtn.classList.remove('active');
    });
  
    recruiterBtn.addEventListener('click', () => {
      recruiterForm.style.display = 'block';
      jobSeekerForm.style.display = 'none';
      recruiterBtn.classList.add('active');
      jobSeekerBtn.classList.remove('active');
    });
  
    jobSeekerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Collect job seeker form data
      const formData = new FormData(jobSeekerForm);
      const data = {
        firstName: formData.get('firstname'),
        lastName: formData.get('lastname'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPwd'),
        age: formData.get('age'),
        gender: formData.get('gender'),
        country: formData.get('country'),
        profession: formData.get('profession')
      };
  
      try {
        const response = await fetch('/developer/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          // Redirect to job seeker profile page
          const res = await fetch('/developer/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email:data.email, password: data.password}),
          });
          if (res.ok) {
            const info = await res.json();
            sessionStorage.setItem("token", info.token);
            window.location.href = '/candidateProfile.html';
          }
          else {
            const info = await response.json();
            alert(info.error || 'Sign in failed');
          }
        } else {
          const result = await response.json();
          alert(result.error || 'Sign up failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Sign up failed');
      }
    });
  
    recruiterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Collect recruiter form data
      const formData = new FormData(recruiterForm);
      const data = {
        firstName: formData.get('firstname'),
        lastName: formData.get('lastname'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPwd'),
      };

      try {
        const response = await fetch('recruiter/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          // Redirect to recruiter profile page
          const result = await response.json();
          alert(result.message || 'Sign up Succeed');
          window.location.href = './login.html';
        } else {
          const result = await response.json();
          alert(result.error || 'Sign up failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Sign up failed');
      }
    });
  });
