document.addEventListener('DOMContentLoaded', () => {
    const personalInfoForm = document.getElementById('personal-info-form');
    const educationForm = document.getElementById('education-form');
    const skillsForm = document.getElementById('skills-form');
    const workExpForm = document.getElementById('work-exp-form');
  
    const personalInfoBtn = document.getElementById('personal-info-btn');
    const educationBtn = document.getElementById('education-btn');
    const skillsBtn = document.getElementById('skills-btn');
    const workExpBtn = document.getElementById('work-exp-btn');
  
    const saveContinue1 = document.getElementById('save-continue-1');
    const saveContinue2 = document.getElementById('save-continue-2');
    const saveContinue3 = document.getElementById('save-continue-3');
    const saveContinue4 = document.getElementById('save-continue-4');
  
    function showForm(form) {
      personalInfoForm.style.display = 'none';
      educationForm.style.display = 'none';
      skillsForm.style.display = 'none';
      workExpForm.style.display = 'none';
      form.style.display = 'block';
    }
  
    personalInfoBtn.addEventListener('click', () => showForm(personalInfoForm));
    educationBtn.addEventListener('click', () => showForm(educationForm));
    skillsBtn.addEventListener('click', () => showForm(skillsForm));
    workExpBtn.addEventListener('click', () => showForm(workExpForm));
  
    saveContinue1.addEventListener('click', () => showForm(educationForm));
    saveContinue2.addEventListener('click', () => showForm(skillsForm));
    saveContinue3.addEventListener('click', () => showForm(workExpForm));
    saveContinue4.addEventListener('click', () => {
      // Save final data and finish
      console.log('Profile complete');
      // Redirect to a different page or show a completion message
    });
  
    // Pre-fill personal info from URL parameters (if available)
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('first-name').value = urlParams.get('firstName') || '';
    document.getElementById('last-name').value = urlParams.get('lastName') || '';
    document.getElementById('email').value = urlParams.get('email') || '';
    document.getElementById('country').value = urlParams.get('country') || '';
  });
  