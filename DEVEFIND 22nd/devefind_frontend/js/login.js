document.addEventListener('DOMContentLoaded', () => {
    const jobSeekerLoginForm = document.getElementById('job-seeker-login-form');
    const recruiterLoginForm = document.getElementById('recruiter-login-form');
  
    const jobSeekerLoginBtn = document.getElementById('job-seeker-login-btn');
    const recruiterLoginBtn = document.getElementById('recruiter-login-btn');
  
    jobSeekerLoginBtn.addEventListener('click', () => {
      jobSeekerLoginForm.style.display = 'block';
      recruiterLoginForm.style.display = 'none';
      jobSeekerLoginBtn.classList.add('active');
      recruiterLoginBtn.classList.remove('active');
    });
  
    recruiterLoginBtn.addEventListener('click', () => {
      recruiterLoginForm.style.display = 'block';
      jobSeekerLoginForm.style.display = 'none';
      recruiterLoginBtn.classList.add('active');
      jobSeekerLoginBtn.classList.remove('active');
    });
  
    jobSeekerLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('job-seeker-email').value;
      const password = document.getElementById('job-seeker-password').value;
  
      const data = {
        email,
        password,
      };
  
      try {
        const response = await fetch('/developer/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          alert('Login successful! Redirecting to your dashboard.');
          window.location.href = '/dashboard';
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    });
  
    recruiterLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('recruiter-email').value;
      const password = document.getElementById('recruiter-password').value;
  
      const data = {
        email,
        password,
      };
  
      try {
        const response = await fetch('/recruiter/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          alert('Login successful! Redirecting to your dashboard.');
          const data = await response.json();
          sessionStorage.setItem('token', data.token);
          window.location.href = '/recruitersDash.html';
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    });
  });
