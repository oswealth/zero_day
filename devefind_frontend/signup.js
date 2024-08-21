document.addEventListener('DOMContentLoaded', () => {
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
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPwd: formData.get('confirmPwd'),
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
          window.location.href = '/job-seeker-profile';
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
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPwd: formData.get('confirmPwd'),
        backupEmail: formData.get('backupEmail'),
        phone: formData.get('phone')
      };
  
      try {
        const response = await fetch('/recruiter/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          // Redirect to recruiter profile page
          window.location.href = '/recruitersdashboard';
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
  