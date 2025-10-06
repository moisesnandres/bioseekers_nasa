// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
	// Add event listener to ask button
	const askButton = document.getElementById('askButton');
	if (askButton) {
		askButton.addEventListener('click', handleQuestion);
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

function handleQuestion() {
	const questionInput = document.querySelector('input[type="text"]');
	const question = questionInput.value.trim();
	
	if (!question) {
		alert('Please enter a question');
		return;
	}
	
	// Show loading state
	const askButton = document.getElementById('askButton');
	const originalText = askButton.textContent;
	askButton.textContent = 'Thinking...';
	askButton.disabled = true;
	
	// Simulate API request delay
	setTimeout(() => {
		// Simulate the Q&A response
		const mockResponse = {
			"question": question,
			"answer": generateAnswer(question),
			"related_documents": [
				{
					"title": "Microgravity Effects on Plant Growth",
					"author": "Dr. Sarah Johnson",
					"relevance": 0.92
				},
				{
					"title": "Space Food Production Systems",
					"author": "Dr. James Wilson", 
					"relevance": 0.87
				}
			]
		};
		
		// Display results
		displayQAResults(mockResponse);
		
		// Reset button
		askButton.textContent = originalText;
		askButton.disabled = false;
	}, 1500); // 1.5 second delay to simulate thinking
}

function generateAnswer(question) {
	const lowerQuestion = question.toLowerCase();
	
	if (lowerQuestion.includes('plant') || lowerQuestion.includes('grow') || lowerQuestion.includes('agriculture')) {
		return "Plants in space face unique challenges due to microgravity. Research shows that root systems develop differently, and plants may require specialized growing systems. NASA has successfully grown lettuce and other vegetables on the International Space Station using controlled environment agriculture techniques.";
	} else if (lowerQuestion.includes('radiation') || lowerQuestion.includes('health') || lowerQuestion.includes('human')) {
		return "Space radiation is a significant concern for long-duration missions. Astronauts are exposed to cosmic radiation that can affect cellular function and increase cancer risk. NASA uses shielding materials and monitors radiation exposure to protect crew health during space missions.";
	} else if (lowerQuestion.includes('food') || lowerQuestion.includes('nutrition') || lowerQuestion.includes('eat')) {
		return "Space food systems have evolved significantly. Current research focuses on sustainable food production using hydroponics and controlled environment agriculture. The goal is to create closed-loop systems that can support long-duration missions to Mars and beyond.";
	} else if (lowerQuestion.includes('water') || lowerQuestion.includes('recycle') || lowerQuestion.includes('waste')) {
		return "Water recycling systems are crucial for space missions. NASA has developed advanced water purification systems that can recover up to 95% of water from various sources including urine, sweat, and condensation. These systems are essential for long-duration space missions.";
	} else {
		return "Based on NASA's bioscience research, this is a complex topic that involves multiple factors. The research shows that space environments present unique challenges for biological systems, requiring innovative solutions for sustainable space exploration. I'd recommend exploring the related documents below for more detailed information.";
	}
}

function displayQAResults(data) {
	const qaContainer = document.getElementById('qaContainer');
	const qaResults = document.getElementById('qaResults');
	
	// Clear previous results
	qaContainer.innerHTML = '';
	
	// Create Q&A result HTML
	const resultElement = document.createElement('div');
	resultElement.className = 'bg-[#1a1a2e] border border-[#333] rounded-lg p-6 hover:border-[#FFE500] transition-all duration-300';
	resultElement.innerHTML = `
		<!-- Question -->
		<div class="mb-4">
			<div class="flex items-start gap-3 mb-3">
				<div class="w-8 h-8 bg-[#FFE500] rounded-full flex items-center justify-center flex-shrink-0">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
						<path d="M9.09 9C9.325 8.331 9.789 7.812 10.4 7.4C11.011 6.988 11.73 6.8 12.5 6.8C13.27 6.8 13.989 6.988 14.6 7.4C15.211 7.812 15.675 8.331 15.91 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-white mb-2">Your Question</h3>
					<p class="text-gray-300">${data.question}</p>
				</div>
			</div>
		</div>
		
		<!-- Answer -->
		<div class="mb-6">
			<div class="flex items-start gap-3">
				<div class="w-8 h-8 bg-[#00d4ff] rounded-full flex items-center justify-center flex-shrink-0">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
						<path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-white mb-2">AI Answer</h3>
					<p class="text-gray-300 leading-relaxed">${data.answer}</p>
				</div>
			</div>
		</div>
		
		<!-- Related Documents -->
		<div class="border-t border-[#333] pt-4">
			<h4 class="text-sm font-semibold text-[#FFE500] mb-3">Related Documents</h4>
			<div class="space-y-2">
				${data.related_documents.map(doc => `
					<div class="flex justify-between items-center p-3 bg-[#0a0a1a] rounded border border-[#333]">
						<div>
							<h5 class="text-sm font-medium text-white">${doc.title}</h5>
							<p class="text-xs text-gray-400">by ${doc.author}</p>
						</div>
						<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">
							${(doc.relevance * 100).toFixed(0)}% relevant
						</span>
					</div>
				`).join('')}
			</div>
		</div>
	`;
	qaContainer.appendChild(resultElement);
	
	// Show results section
	qaResults.classList.remove('hidden');
	
	// Scroll to results
	qaResults.scrollIntoView({ behavior: 'smooth' });
}
