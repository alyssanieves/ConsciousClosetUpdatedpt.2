document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sustainability-form');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the form from refreshing the page

        const url = document.getElementById('website-url').value;

        try {
            const response = await fetch(`/api/check-sustainability?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            // Check if the response was successful
            if (response.ok) {
                // Display the results
                resultDiv.innerHTML = `
                    <h2>Results:</h2>
                    <p><strong>Rating:</strong> ${data.rating}</p>
                    <p><strong>Message:</strong> ${data.message}</p>
                    <p><strong>Details:</strong> ${data.details}</p>
                `;
            } else {
                resultDiv.innerHTML = `<p>${data.message}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p>Error fetching sustainability information. Please try again later.</p>';
        }
    });
});
