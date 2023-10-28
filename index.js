document.addEventListener("DOMContentLoaded", function () {
    const jobList = document.getElementById("job-list");
    const myJobList = document.getElementById("my-job-list");
    const keywordFilter = document.getElementById("keyword-filter");
    const locationFilter = document.getElementById("location-filter");
    const jobPostForm = document.getElementById("job-post-form");
    
    // Create an array to store posted jobs
    const postedJobs = [];

    // Adzuna App ID and App Key 
    const appId = "e5acc4cf";
    const appKey = "e6ee53034bfc93e2be62c2b03207424f";

    // Function to fetch job listings from the Adzuna API
    function fetchJobListings(keyword, location) {
        const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&what=${keyword}&where=${location}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                let jobListings = data.results;

                // Update the displayed job listings
                jobList.innerHTML = '';

                jobListings.forEach((job) => {
                    const listItem = document.createElement("li");
                    listItem.innerHTML = `
                        <h3>${job.title}</h3>
                        <p><strong>Company:</strong> ${job.company.display_name}</p>
                        <p><strong>Location:</strong> ${job.location.display_name}</p>
                        <p><strong>Description:</strong> ${job.description}</p>
                        <p><strong>Requirements:</strong> ${job.description}</p>
                        <p><strong>Salary:</strong> ${job.salary_min} - ${job.salary_max} ${job.salary_is_predicted ? "(predicted)" : ""}</p>
                        <a class="apply-button" href="${job.redirect_url}" target="_blank">Apply</a>
                    `;
                    jobList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error("Error fetching job listings from Adzuna API: " + error);
            });
    }

    // Function to update the displayed job listings
    function updateJobListings() {
        const keyword = keywordFilter.value.toLowerCase();
        const location = locationFilter.value.toLowerCase();

        fetchJobListings(keyword, location);
    }

    // Event listener for keyword filter input
    keywordFilter.addEventListener("input", updateJobListings);

    // Event listener for location filter input
    locationFilter.addEventListener("input", updateJobListings);

    // Event listener for job posting form submission
    jobPostForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        const formData = new FormData(jobPostForm);

        // Create a new job listing
        const newJob = {
            title: formData.get("job-title"),
            company: formData.get("company-name"),
            location: formData.get("job-location"),
            description: formData.get("job-description"),
            requirements: formData.get("job-requirements"),
            salary: formData.get("job-salary"),
            applyLink: formData.get("job-apply-link"),
        };

        // Add the new job to the list of posted jobs
        postedJobs.push(newJob);

        // Clear the form
        jobPostForm.reset();

        // Update the displayed job listings
        updateJobListings();

        // Clear and re-populate the "My Posted Jobs" section
        myJobList.innerHTML = '';
        postedJobs.forEach((job) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Description:</strong> ${job.description}</p>
                <p><strong>Requirements:</strong> ${job.requirements}</p>
                <p><strong>Salary:</strong> ${job.salary}</p>
                <a class="apply-button" href="${job.applyLink}" target="_blank">Apply</a>
            `;
            myJobList.appendChild(listItem);
        });
    });

    // Initial load of job listings
    updateJobListings();
    
});
