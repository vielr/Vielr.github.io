document.addEventListener('DOMContentLoaded', function() {
    const addLocationBtn = document.getElementById('addLocationBtn');
    const saveLocationBtn = document.getElementById('saveLocationBtn');
    const cancelLocationBtn = document.getElementById('cancelLocationBtn');
    const backToDashboardBtn = document.getElementById('backToDashboardBtn');
    const imageInput = document.getElementById('imageInput');
    const locationForm = document.getElementById('locationForm');
    const fullReview = document.getElementById('fullReview');
    const locationsContainer = document.getElementById('locations');
    const starRating = document.getElementById('starRating');
    let locations = JSON.parse(localStorage.getItem('locations')) || [];
    let selectedRating = 0;

    function renderLocations() {
        locationsContainer.innerHTML = '';
        if (locations.length === 0) {
            locationsContainer.innerHTML = '<p>The dashboard is empty.</p>';
        } else {
            locations.forEach((location, index) => {
                const locationDiv = document.createElement('div');
                locationDiv.classList.add('location');
                locationDiv.innerHTML = `
                    <img src="${location.image}" alt="${location.name}">
                    <p>${location.name}</p>
                    <p>Rating: ${location.rating}</p>
                    <p>${location.review.substring(0, 100)}...</p>
                `;
                locationDiv.addEventListener('click', () => {
                    showFullReview(index);
                });
                locationsContainer.appendChild(locationDiv);
            });
        }
    }

    function showFullReview(index) {
        const location = locations[index];
        document.getElementById('fullReviewName').innerText = location.name;
        document.getElementById('fullReviewImage').src = location.image;
        document.getElementById('fullReviewRating').innerText = `Rating: ${location.rating}`;
        document.getElementById('fullReviewText').innerText = location.review;
        locationForm.classList.add('hidden');
        fullReview.classList.remove('hidden');
    }

    function addNewLocation() {
        imageInput.click();
    }

    function saveLocation() {
        const name = document.getElementById('locationName').value;
        const review = document.getElementById('locationReview').value;
        const image = localStorage.getItem('currentImage');
        
        if (name && selectedRating && review && image) {
            locations.push({ name, rating: selectedRating, review, image });
            localStorage.setItem('locations', JSON.stringify(locations));
            localStorage.removeItem('currentImage');
            locationForm.classList.add('hidden');
            renderLocations();
        } else {
            alert('Please fill in all fields and upload an image.');
        }
    }

    imageInput.addEventListener('change', function() {
        const reader = new FileReader();
        reader.onload = function(event) {
            localStorage.setItem('currentImage', event.target.result);
            locationForm.classList.remove('hidden');
        };
        reader.readAsDataURL(this.files[0]);
    });

    addLocationBtn.addEventListener('click', addNewLocation);
    saveLocationBtn.addEventListener('click', saveLocation);
    cancelLocationBtn.addEventListener('click', () => {
        localStorage.removeItem('currentImage');
        locationForm.classList.add('hidden');
    });
    backToDashboardBtn.addEventListener('click', () => {
        fullReview.classList.add('hidden');
        renderLocations();
    });

    starRating.addEventListener('mouseover', function(event) {
        if (event.target.tagName === 'SPAN') {
            const rating = event.target.getAttribute('data-rating');
            highlightStars(rating);
        }
    });

    starRating.addEventListener('mouseout', function() {
        highlightStars(selectedRating);
    });

    starRating.addEventListener('click', function(event) {
        if (event.target.tagName === 'SPAN') {
            selectedRating = event.target.getAttribute('data-rating');
            highlightStars(selectedRating);
        }
    });

    function highlightStars(rating) {
        const stars = starRating.querySelectorAll('span');
        stars.forEach(star => {
            star.classList.remove('highlighted', 'selected');
            if (star.getAttribute('data-rating') <= rating) {
                star.classList.add('highlighted');
            }
            if (star.getAttribute('data-rating') == selectedRating) {
                star.classList.add('selected');
            }
        });
    }

    renderLocations();
});
