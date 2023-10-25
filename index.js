document.addEventListener("DOMContentLoaded", function () {
    const jobList = document.getElementById("job-list");
    const keywordFilter = document.getElementById("keyword-filter");
    const locationFilter = document.getElementById("location-filter");
    const jobPostForm = document.getElementById("job-post-form");

    // Fetch the JSON data from the separate file
    fetch("jobListings.json")
        .then((response) => response.json())
        .then((data) => {
            let filteredJobs = data.jobListings;

            // Function to update the displayed job listings
            function updateJobListings() {
                jobList.innerHTML = ''; // Clear the existing listings

                filteredJobs.forEach((job) => {
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
                    jobList.appendChild(listItem);
                });
            }

            // Event listener for keyword filter input
            keywordFilter.addEventListener("input", function () {
                const keyword = keywordFilter.value.toLowerCase();

                // Filter job listings by keyword
                filteredJobs = data.jobListings.filter((job) => {
                    return job.title.toLowerCase().includes(keyword) ||
                        job.description.toLowerCase().includes(keyword);
                });

                updateJobListings();
            });

            // Event listener for location filter input
            locationFilter.addEventListener("input", function () {
                const location = locationFilter.value.toLowerCase();

                // Filter job listings by location
                filteredJobs = data.jobListings.filter((job) => {
                    return job.location.toLowerCase().includes(location);
                });

                updateJobListings();
            });

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

                // Add the new job to the list of job listings
                data.jobListings.push(newJob);

                // Clear the form
                jobPostForm.reset();

                // Update the displayed job listings
                updateJobListings();
            });

            // Initial load of all job listings
            updateJobListings();
            
        })
        .catch((error) => {
            console.error("Error fetching JSON data: " + error);
        });
});