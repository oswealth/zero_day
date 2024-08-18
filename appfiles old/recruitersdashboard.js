document.addEventListener('DOMContentLoaded', () => {
    const userRole = 'recruiter';

    // Toggle filter dropdown
    const filterToggle = document.getElementById('filter-toggle');
    const filterDropdown = document.getElementById('filter-dropdown');
    
    filterToggle.addEventListener('click', () => {
        filterDropdown.classList.toggle('show');
    });

    // Handle search form submission
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchQuery = document.getElementById('search-query').value;

        try {
            const response = await fetch(`/api/candidates/search?q=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const candidates = await response.json();
            console.log('Search results:', candidates);
            // Code to display candidates goes here
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    });

    // Handle pagination
    const profileCards = document.querySelectorAll(".profile-card");
    const nextButton = document.querySelector(".next-button");
    let currentIndex = 0;
    const cardsToShow = 2; // Number of cards to show at a time

    // Hide all cards initially
    profileCards.forEach((card, index) => {
        if (index >= cardsToShow) {
            card.style.display = "none";
        }
    });

    nextButton.addEventListener("click", function() {
        const lastVisibleIndex = currentIndex + cardsToShow;
        
        // Hide current cards
        profileCards.forEach((card, index) => {
            if (index >= currentIndex && index < lastVisibleIndex) {
                card.style.display = "none";
            }
        });

        // Show next set of cards
        currentIndex += cardsToShow;

        profileCards.forEach((card, index) => {
            if (index >= currentIndex && index < currentIndex + cardsToShow) {
                card.style.display = "flex";
            }
        });

        // Loop back to the start if we reach the end
        if (currentIndex >= profileCards.length) {
            currentIndex = 0;
            profileCards.forEach((card, index) => {
                if (index < cardsToShow) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        }
    });
});
