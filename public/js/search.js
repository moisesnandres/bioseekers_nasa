// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
	// Add event listener to search button
	const searchButton = document.getElementById('searchButton');
	if (searchButton) {
		searchButton.addEventListener('click', handleSearch);
	}
	
	// Add mobile menu toggle functionality
	const mobileMenuToggle = document.getElementById('mobileMenuToggle');
	const closeSidebar = document.getElementById('closeSidebar');
	const sidebar = document.getElementById('sidebar');
	
	if (mobileMenuToggle && sidebar) {
		mobileMenuToggle.addEventListener('click', function() {
			sidebar.classList.remove('hidden');
			sidebar.classList.add('flex');
		});
	}
	
	if (closeSidebar && sidebar) {
		closeSidebar.addEventListener('click', function() {
			sidebar.classList.add('hidden');
			sidebar.classList.remove('flex');
		});
	}
	
	// Close sidebar when clicking outside on mobile
	document.addEventListener('click', function(event) {
		if (window.innerWidth < 1024) { // Only on mobile/tablet
			const isClickInsideSidebar = sidebar.contains(event.target);
			const isClickOnToggle = mobileMenuToggle && mobileMenuToggle.contains(event.target);
			
			if (!isClickInsideSidebar && !isClickOnToggle && !sidebar.classList.contains('hidden')) {
				sidebar.classList.add('hidden');
				sidebar.classList.remove('flex');
			}
		}
	});
});

function handleSearch() {
	const searchInput = document.querySelector('input[type="text"]');
	const query = searchInput.value.trim();
	if (!query) {
		alert('Please enter a search query');
		return;
	}
	// Show loading state
	const searchButton = document.getElementById('searchButton');
	const originalText = searchButton.textContent;
	searchButton.textContent = 'Searching...';
	searchButton.disabled = true;
	// Simulate API request delay
	setTimeout(() => {
		// Simulate the API response using documents_2.json structure
		const mockResponse = {
			"count": 6,
			"results": [
				{
					"chunk_uuid": "c35df26f-e53d-4126-9f8a-d3e11327151a",
					"title": "Plant Adaptations to Extreme Environments and Their Astrobiological Implications",
					"chunk_content": "Title: Plant Adaptations to Extreme Environments and Their Astrobiological Implications...",
					"chunk_s3_path": "https://bioseekersbucket.s3.us-east-2.amazonaws.com/chunks/Plant Adaptations to Extreme Environments and Their Astrobiological Implications/Plant Adaptations to Extreme Environments and Their Astrobiological Implications_3.txt",
					"chunk_type": "text",
					"score": 0.6452687138030203
				},
				{
					"document_uuid": "2",
					"title": "Radiation Shielding for Mars Missions",
					"author": "Dr. Michael Chen",
					"date": "2024-01-10",
					"type": "Technical Report",
					"category": "Engineering",
					"summary": "Analysis of radiation protection strategies for long-duration Mars missions and their biological implications for human health.",
					"tags": ["radiation", "mars", "shielding", "engineering"],
					"downloads": 892,
					"pages": 18,
					"chunk_content": "Advanced shielding materials show promising results in protecting biological systems from cosmic radiation during extended space missions.",
					"chunk_type": "text_chunk",
					"score": 0.832
				},
				{
					"document_uuid": "3",
					"title": "Human Physiology in Zero Gravity",
					"author": "Dr. Emily Rodriguez",
					"date": "2024-01-08",
					"type": "Research Paper",
					"category": "Physiology",
					"summary": "Long-term effects of zero gravity on human muscle mass, bone density, and cardiovascular health in space environments.",
					"tags": ["physiology", "zero-gravity", "health", "space"],
					"downloads": 1563,
					"pages": 31,
					"chunk_content": "Extended exposure to microgravity leads to significant muscle atrophy and bone density loss, requiring countermeasures for long-duration missions.",
					"chunk_type": "text_chunk",
					"score": 0.831
				},
				{
					"document_uuid": "4",
					"title": "Space Food Production Systems",
					"author": "Dr. James Wilson",
					"date": "2024-01-05",
					"type": "Technical Report",
					"category": "Agriculture",
					"summary": "Sustainable food production methods for extended space missions and lunar colonies using controlled environment agriculture.",
					"tags": ["food", "agriculture", "sustainability", "space"],
					"downloads": 743,
					"pages": 27,
					"chunk_content": "Closed-loop agricultural systems demonstrate viability for producing fresh food in space environments with minimal resource input.",
					"chunk_type": "text_chunk",
					"score": 0.802
				},
				{
					"document_uuid": "5",
					"title": "Psychological Effects of Space Isolation",
					"author": "Dr. Lisa Thompson",
					"date": "2024-01-03",
					"type": "Research Paper",
					"category": "Psychology",
					"summary": "Mental health considerations and coping strategies for astronauts during long-duration missions in isolated environments.",
					"tags": ["psychology", "isolation", "mental-health", "astronauts"],
					"downloads": 1089,
					"pages": 19,
					"chunk_content": "Psychological support systems and regular communication protocols are essential for maintaining crew mental health during extended missions.",
					"chunk_type": "text_chunk",
					"score": 0.788
				},
				{
					"document_uuid": "6",
					"title": "Water Recycling in Space Habitats",
					"author": "Dr. Robert Kim",
					"date": "2024-01-01",
					"type": "Technical Report",
					"category": "Engineering",
					"summary": "Advanced water purification and recycling systems for closed-loop space environments and habitat sustainability.",
					"tags": ["water", "recycling", "habitats", "engineering"],
					"downloads": 634,
					"pages": 22,
					"chunk_content": "Efficient water recycling systems achieve 95% water recovery rates, making long-duration space missions more sustainable and feasible.",
					"chunk_type": "text_chunk",
					"score": 0.767
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
	
		// Create results HTML with simplified card style
		data.results.forEach((result, index) => {
			const resultElement = document.createElement('div');
			resultElement.className = 'bg-[#1a1a2e] border border-[#333] rounded-lg p-6 hover:border-[#FFE500] transition-all duration-300 hover:scale-105';
			resultElement.innerHTML = `
				<!-- Document Header -->
				<div class="flex justify-between items-start mb-4">
					<div class="flex-1">
						<h3 class="text-lg font-semibold text-white mb-2 line-clamp-2">${result.title}</h3>
						<p class="text-sm text-gray-400 mb-2">Score: ${(result.score * 100).toFixed(1)}%</p>
					</div>
					<div class="ml-4 flex-shrink-0">
						<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">
							${result.chunk_type}
						</span>
					</div>
				</div>
				
				<!-- Document Content -->
				<p class="text-gray-300 text-sm mb-4 line-clamp-3">${result.chunk_content.substring(0, 200)}...</p>
				
				<!-- Document Meta -->
				<div class="flex flex-wrap gap-2">
					<span class="text-xs bg-[#333] text-gray-300 px-2 py-1 rounded">Research</span>
					<span class="text-xs bg-[#FFE500]/10 text-[#FFE500] px-2 py-1 rounded">
						${Math.round(result.score * 100)}% match
					</span>
				</div>
			`;
			resultsContainer.appendChild(resultElement);
		});
	
	// Show results section
	searchResults.classList.remove('hidden');
	
	// Scroll to results
	searchResults.scrollIntoView({ behavior: 'smooth' });
}
