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
          firstName: formData.get('first-name'),
          lastName: formData.get('last-name'),
          email: formData.get('email'),
          password: formData.get('password'),
          confirmPassword: formData.get('confirm-password'),
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
              window.location.href = '/candidateProfile-profile';
          } else {
              const error = await response.json();
              alert(`Error: ${error.message}`);
          }
      } catch (error) {
          console.error('Signup failed:', error);
      }
  });

  recruiterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect recruiter form data
      const formData = new FormData(recruiterForm);
      const data = {
          firstName: formData.get('first-name-recruiter'),
          lastName: formData.get('last-name-recruiter'),
          organization: formData.get('organization'),
          jobPosition: formData.get('job-position'),
          website: formData.get('website'),
          phone: formData.get('phone'),
          country: formData.get('country'),
          address: formData.get('address'),
          email: formData.get('email-recruiter'),
          password: formData.get('password-recruiter'),
          confirmPassword: formData.get('confirm-password-recruiter'),
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
              // Redirect to recruiter filter/search page
              window.location.href = '/recruiter-filter-search';
          } else {
              const error = await response.json();
              alert(`Error: ${error.message}`);
          }
      } catch (error) {
          console.error('Signup failed:', error);
      }
  });
});
