// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
	// Add event listener to search button
	const searchButton = document.getElementById('searchButton');
	if (searchButton) {
		searchButton.addEventListener('click', handleSearch);
	}
});

function handleSearch() {
	const searchInput = document.querySelector('input[type="text"]');
	const query = searchInput.value.trim();
	
	if (!query) {
		alert('Please enter a search query');
		return;
	}
	
	// Show loading state
	const searchButton = document.querySelector('button');
	const originalText = searchButton.textContent;
	searchButton.textContent = 'Searching...';
	searchButton.disabled = true;
	
	// Simulate API request delay
	setTimeout(() => {
		// Simulate the API response
		const mockResponse = {
			"count": 8,
			"results": [
				{
					"document_uuid": "11",
					"title": "Document 11",
					"chunk_content": "Simulated chunk matching the query",
					"chunk_s3_path": null,
					"chunk_type": "text_chunk",
					"score": 0.916
				},
				{
					"document_uuid": "10",
					"title": "Document 10",
					"chunk_content": "Simulated chunk matching the query",
					"chunk_s3_path": null,
					"chunk_type": "text_chunk",
					"score": 0.832
				},
				{
					"document_uuid": "4",
					"title": "Document 4",
					"chunk_content": "Simulated chunk matching the query",
					"chunk_s3_path": null,
					"chunk_type": "text_chunk",
					"score": 0.831
				},
				{
					"document_uuid": "2",
					"title": "Document 2",
					"chunk_content": "Simulated chunk matching the query",
					"chunk_s3_path": null,
					"chunk_type": "text_chunk",
					"score": 0.802
				},
				{
					"document_uuid": "5",
					"title": "Document 5",
					"chunk_content": "Simulated chunk matching the query",
					"chunk_s3_path": null,
					"chunk_type": "text_chunk",
					"score": 0.788
				},
				{
					"document_uuid": "6",
					"title": "Document 6",
					"chunk_content": "Simulated chunk matching the query",
					"chunk_s3_path": null,
					"chunk_type": "text_chunk",
					"score": 0.767
				},
				{
					"document_uuid": "0",
					"title": "Document 0",
					"chunk_content": "Simulated chunk matching the query",
					"chunk_s3_path": null,
					"chunk_type": "text_chunk",
					"score": 0.754
				},
				{
					"document_uuid": "1",
					"title": "Document 1",
					"chunk_content": "Simulated chunk matching the query",
					"chunk_s3_path": null,
					"chunk_type": "text_chunk",
					"score": 0.753
				}
			]
		};
		
		// Display results
		displaySearchResults(mockResponse);
		
		// Reset button
		searchButton.textContent = originalText;
		searchButton.disabled = false;
	}, 1000); // 1 second delay to simulate network request
}

function displaySearchResults(data) {
	const resultsContainer = document.getElementById('resultsContainer');
	const searchResults = document.getElementById('searchResults');
	
	// Clear previous results
	resultsContainer.innerHTML = '';
	
	// Create results HTML
	data.results.forEach((result, index) => {
		const resultElement = document.createElement('div');
		resultElement.className = 'bg-[#1a1a2e] border border-[#333] rounded-lg p-4 hover:border-[#FFE500] transition-colors';
		resultElement.innerHTML = `
			<div class="flex justify-between items-start mb-2">
				<h3 class="text-lg font-semibold text-white">${result.title}</h3>
				<span class="text-sm text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">
					${(result.score * 100).toFixed(1)}% match
				</span>
			</div>
			<p class="text-gray-300 text-sm mb-2">${result.chunk_content}</p>
		`;
		resultsContainer.appendChild(resultElement);
	});
	
	// Show results section
	searchResults.classList.remove('hidden');
	
	// Scroll to results
	searchResults.scrollIntoView({ behavior: 'smooth' });
}
