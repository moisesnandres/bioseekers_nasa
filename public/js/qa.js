// Chat state
let chatHistory = [];

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
	// Add event listener to send button
	const sendButton = document.getElementById('sendButton');
	const chatInput = document.getElementById('chatInput');
	
	if (sendButton && chatInput) {
		sendButton.addEventListener('click', handleChatMessage);
		chatInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') {
				handleChatMessage();
			}
		});
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

function handleChatMessage() {
	const chatInput = document.getElementById('chatInput');
	const message = chatInput.value.trim();
	
	if (!message) {
		return;
	}
	
	// Add user message to chat
	addMessageToChat('user', message);
	
	// Clear input
	chatInput.value = '';
	
	// Show typing indicator
	showTypingIndicator();
	
	// Simulate AI response
	setTimeout(() => {
		hideTypingIndicator();
		const response = generateChatResponse(message);
		addMessageToChat('assistant', response);
	}, 1500 + Math.random() * 1000); // Random delay for realism
}

function addMessageToChat(role, content) {
	const chatContainer = document.getElementById('chatContainer');
	
	// Create message element
	const messageDiv = document.createElement('div');
	messageDiv.className = `flex items-start gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`;
	
	if (role === 'user') {
		messageDiv.innerHTML = `
			<div class="w-8 h-8 bg-[#333] rounded-full flex items-center justify-center flex-shrink-0">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
					<path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
			<div class="flex-1 max-w-xs">
				<div class="bg-[#333] border border-[#555] text-white rounded-lg p-3">
					<p class="text-sm">${content}</p>
				</div>
			</div>
		`;
	} else {
		// Check if content includes related projects
		const hasRelatedProjects = content.includes('Related Projects:');
		const mainContent = hasRelatedProjects ? content.split('Related Projects:')[0] : content;
		const relatedProjects = hasRelatedProjects ? content.split('Related Projects:')[1] : '';
		
		messageDiv.innerHTML = `
			<div class="w-8 h-8 bg-[#00d4ff] rounded-full flex items-center justify-center flex-shrink-0">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
					<path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
			<div class="flex-1">
				<div class="bg-[#0a0a1a] border border-[#333] rounded-lg p-3">
					<div class="text-white text-sm whitespace-pre-wrap">${mainContent}</div>
					${relatedProjects ? `
						<div class="mt-4 pt-3 border-t border-[#333]">
							<h4 class="text-sm font-semibold text-[#FFE500] mb-2">Related Research Papers</h4>
							<div class="space-y-2">
								${relatedProjects}
							</div>
						</div>
					` : ''}
				</div>
			</div>
		`;
	}
	
	chatContainer.appendChild(messageDiv);
	
	// Store in chat history
	chatHistory.push({ role, content, timestamp: new Date() });
	
	// Scroll to bottom
	chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showTypingIndicator() {
	const chatContainer = document.getElementById('chatContainer');
	
	const typingDiv = document.createElement('div');
	typingDiv.id = 'typingIndicator';
	typingDiv.className = 'flex items-start gap-3';
	typingDiv.innerHTML = `
		<div class="w-8 h-8 bg-[#00d4ff] rounded-full flex items-center justify-center flex-shrink-0">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
				<path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</div>
		<div class="flex-1">
			<div class="bg-[#0a0a1a] border border-[#333] rounded-lg p-3">
				<div class="flex items-center gap-1">
					<div class="w-2 h-2 bg-[#FFE500] rounded-full animate-bounce"></div>
					<div class="w-2 h-2 bg-[#FFE500] rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
					<div class="w-2 h-2 bg-[#FFE500] rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
					<span class="text-gray-400 text-sm ml-2">AI is thinking...</span>
				</div>
			</div>
		</div>
	`;
	
	chatContainer.appendChild(typingDiv);
	chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
	const typingIndicator = document.getElementById('typingIndicator');
	if (typingIndicator) {
		typingIndicator.remove();
	}
}

function generateChatResponse(message) {
	const lowerMessage = message.toLowerCase();
	
	// Greeting responses
	if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
		return "Hello! I'm your NASA Bioscience AI assistant. I can help you explore research papers, understand scientific concepts, and find connections between different studies. What specific aspect of NASA's bioscience research interests you?";
	}
	
	// Plant/agriculture questions
	if (lowerMessage.includes('plant') || lowerMessage.includes('grow') || lowerMessage.includes('agriculture') || lowerMessage.includes('crop')) {
		return `Great question about space agriculture! 🌱

Plants in space face fascinating challenges due to microgravity. Here's what NASA research has discovered:

• **Root Development**: Without gravity, roots grow in all directions, requiring specialized growing systems
• **Successful Crops**: NASA has successfully grown lettuce, radishes, and other vegetables on the ISS
• **Controlled Environment**: Hydroponic systems with LED lighting are proving effective
• **Future Applications**: This research is crucial for Mars missions and lunar colonies

Would you like me to dive deeper into any specific aspect of space agriculture?

Related Projects:
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Plant Adaptations to Extreme Environments and Their Astrobiological Implications</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">92% relevant</span>
</div>
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Sustainable Space Exploration Through Microbial Power Harnessing Strategies</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">87% relevant</span>
</div>`;
	}
	
	// Radiation/health questions
	if (lowerMessage.includes('radiation') || lowerMessage.includes('health') || lowerMessage.includes('human') || lowerMessage.includes('astronaut')) {
		return `Excellent question about space health! 🚀

Space radiation is indeed one of the biggest challenges for human spaceflight:

• **Cosmic Radiation**: Astronauts face 10x more radiation than on Earth
• **Health Effects**: Can affect DNA, increase cancer risk, and impact cognitive function
• **Protection Methods**: NASA uses shielding materials and monitors exposure levels
• **Countermeasures**: Exercise, nutrition, and medical protocols help mitigate effects

The research is ongoing to develop better protection for long-duration missions to Mars. What specific health aspect would you like to explore?

Related Projects:
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Permafrost-Mimicked Conditions Foster Carnobacterium Growth Implications for Martian Microbiology</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">94% relevant</span>
</div>
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Microbial Existence in Controlled Habitats Under Space Conditions</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">89% relevant</span>
</div>
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Microbial Existence in Controlled Habitats Under Space Conditions</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">85% relevant</span>
</div>`;
	}
	
	// Food/nutrition questions
	if (lowerMessage.includes('food') || lowerMessage.includes('nutrition') || lowerMessage.includes('eat') || lowerMessage.includes('meal')) {
		return `Space nutrition is a fascinating field! 🍽️

NASA's food systems have evolved dramatically:

• **Current Systems**: Pre-packaged meals with 3-year shelf life
• **Future Vision**: Fresh food production using hydroponics and controlled environments
• **Nutritional Challenges**: Maintaining proper nutrition in microgravity
• **Closed-Loop Systems**: Goal is 95%+ food production on long missions

The research shows that fresh food not only provides nutrition but also psychological benefits for astronauts. Are you curious about any specific aspect of space nutrition?

Related Projects:
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Sustainable Space Exploration Through Microbial Power Harnessing Strategies</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">96% relevant</span>
</div>
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">In Situ Resource Utilization in Space Biomining Potential</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">91% relevant</span>
</div>
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Plant Adaptations to Extreme Environments and Their Astrobiological Implications</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">88% relevant</span>
</div>`;
	}
	
	// Water/life support questions
	if (lowerMessage.includes('water') || lowerMessage.includes('recycle') || lowerMessage.includes('waste') || lowerMessage.includes('life support')) {
		return `Water recycling is absolutely critical for space missions! 💧

NASA's water systems are incredibly advanced:

• **Recycling Rate**: Up to 95% water recovery from all sources
• **Sources**: Urine, sweat, condensation, and even breath moisture
• **Purification**: Multi-stage filtration and chemical treatment
• **Future Goals**: 98%+ recycling for Mars missions

The research shows that these systems are essential for sustainable long-duration missions. Every drop counts in space! What would you like to know about life support systems?

Related Projects:
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Phylogenomic Analysis of Novel Earth-Derived Bacteria from the International Space Station</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">98% relevant</span>
</div>
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Sustainable Space Exploration Through Microbial Power Harnessing Strategies</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">82% relevant</span>
</div>`;
	}
	
	// Psychology/mental health questions
	if (lowerMessage.includes('psychology') || lowerMessage.includes('mental') || lowerMessage.includes('isolation') || lowerMessage.includes('stress')) {
		return `Mental health in space is a crucial research area! 🧠

NASA studies show that psychological factors are just as important as physical ones:

• **Isolation Effects**: Long-duration missions can impact mental health
• **Social Dynamics**: Small crew interactions and communication with Earth
• **Stress Management**: Exercise, hobbies, and regular communication help
• **Mission Planning**: Psychological support is built into mission protocols

The research is helping design better habitats and mission protocols for future Mars missions. What aspect of space psychology interests you?

Related Projects:
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Microbial Existence in Controlled Habitats Under Space Conditions</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">95% relevant</span>
</div>
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Microbial Existence in Controlled Habitats Under Space Conditions</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">78% relevant</span>
</div>
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Microbial Existence in Controlled Habitats Under Space Conditions</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">73% relevant</span>
</div>`;
	}
	
	// General/fallback response
	return `That's a great question about NASA's bioscience research! 🔬

Based on the extensive research database, this topic involves multiple interconnected factors:

• **Complex Systems**: Space biology involves many interconnected systems
• **Innovation Required**: Unique challenges need creative solutions
• **Future Applications**: Research benefits both space exploration and Earth applications
• **Ongoing Studies**: NASA continuously conducts new research

I'd be happy to help you explore specific aspects of this topic. What particular area would you like to dive deeper into? You can ask about plants, human health, food systems, water recycling, or any other bioscience topic!

Related Projects:
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Plant Adaptations to Extreme Environments and Their Astrobiological Implications</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">85% relevant</span>
</div>
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Microbial Existence in Controlled Habitats Under Space Conditions</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">82% relevant</span>
</div>
<div class="flex justify-between items-center p-2 bg-[#1a1a2e] rounded border border-[#333]">
	<div>
		<h5 class="text-sm font-medium text-white">Sustainable Space Exploration Through Microbial Power Harnessing Strategies</h5>
		<p class="text-xs text-gray-400">Research Paper</p>
	</div>
	<span class="text-xs text-[#FFE500] bg-[#FFE500]/10 px-2 py-1 rounded">79% relevant</span>
</div>`;
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
