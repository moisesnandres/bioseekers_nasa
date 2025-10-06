// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
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
	
	// View toggle functionality
	const gridViewBtn = document.getElementById('gridViewBtn');
	const graphViewBtn = document.getElementById('graphViewBtn');
	const documentsGrid = document.getElementById('documentsGrid');
	const documentsGraph = document.getElementById('documentsGraph');
	
	if (gridViewBtn && graphViewBtn && documentsGrid && documentsGraph) {
		gridViewBtn.addEventListener('click', function() {
			documentsGrid.classList.remove('hidden');
			documentsGraph.classList.add('hidden');
			gridViewBtn.classList.remove('bg-[#333]', 'text-white', 'hover:bg-[#444]');
			gridViewBtn.classList.add('bg-[#FFE500]', 'text-black');
			graphViewBtn.classList.remove('bg-[#FFE500]', 'text-black');
			graphViewBtn.classList.add('bg-[#333]', 'text-white', 'hover:bg-[#444]');
		});
		
		graphViewBtn.addEventListener('click', function() {
			documentsGrid.classList.add('hidden');
			documentsGraph.classList.remove('hidden');
			graphViewBtn.classList.remove('bg-[#333]', 'text-white', 'hover:bg-[#444]');
			graphViewBtn.classList.add('bg-[#FFE500]', 'text-black');
			gridViewBtn.classList.remove('bg-[#FFE500]', 'text-black');
			gridViewBtn.classList.add('bg-[#333]', 'text-white', 'hover:bg-[#444]');
			
			// Initialize graph when switching to graph view
			initializeGraph();
		});
	}
});

// Global state for graph
let currentGraph = {
	nodes: [],
	connections: [],
	expandedNodes: new Set(),
	selectedNode: null,
	zoomLevel: 1,
	panX: 0,
	panY: 0
};

function initializeGraph() {
	const svg = document.getElementById('graphSvg');
	if (!svg) return;
	
	// Clear previous graph
	svg.innerHTML = '';
	
	// Enhanced document data with relationships - using documents_2.json structure
	const documents = [
		{
			id: "c35df26f-e53d-4126-9f8a-d3e11327151a",
			title: "Plant Adaptations to Extreme Environments and Their Astrobiological Implications",
			author: "Dr. Sarah Johnson",
			category: "Astrobiology",
			tags: ["plant adaptations", "extreme environments", "astrobiology"],
			relatedAuthors: ["Dr. Michael Chen", "Dr. Emily Rodriguez"],
			citations: 156,
			year: 2024,
			keywords: ["plant adaptations", "extreme environments", "astrobiology", "space agriculture"],
			relatedTopics: ["space agriculture", "plant physiology", "extreme environments"]
		},
		{
			id: "2", 
			title: "Radiation Shielding for Mars Missions",
			author: "Dr. Michael Chen",
			category: "Engineering",
			tags: ["radiation", "mars", "shielding", "engineering"],
			relatedAuthors: ["Dr. Amanda Davis", "Dr. Emily Rodriguez"],
			citations: 892,
			year: 2024,
			keywords: ["cosmic radiation", "shielding materials", "health protection"],
			relatedTopics: ["space medicine", "human health", "mission safety"]
		},
		{
			id: "3",
			title: "Human Physiology in Zero Gravity", 
			author: "Dr. Emily Rodriguez",
			category: "Physiology",
			tags: ["physiology", "zero-gravity", "health", "space"],
			relatedAuthors: ["Dr. Michael Chen", "Dr. Lisa Thompson"],
			citations: 1563,
			year: 2024,
			keywords: ["muscle atrophy", "bone density", "cardiovascular"],
			relatedTopics: ["space medicine", "exercise countermeasures", "crew health"]
		},
		{
			id: "4",
			title: "Space Food Production Systems",
			author: "Dr. James Wilson", 
			category: "Agriculture",
			tags: ["food", "agriculture", "sustainability", "space"],
			relatedAuthors: ["Dr. Sarah Johnson", "Dr. Carlos Martinez"],
			citations: 743,
			year: 2024,
			keywords: ["hydroponics", "controlled environment", "nutrition"],
			relatedTopics: ["space farming", "life support", "sustainable systems"]
		},
		{
			id: "5",
			title: "Psychological Effects of Space Isolation",
			author: "Dr. Lisa Thompson",
			category: "Psychology", 
			tags: ["psychology", "isolation", "mental-health", "astronauts"],
			relatedAuthors: ["Dr. Emily Rodriguez", "Dr. Amanda Davis"],
			citations: 1089,
			year: 2024,
			keywords: ["mental health", "social dynamics", "stress management"],
			relatedTopics: ["crew psychology", "mission planning", "wellbeing"]
		},
		{
			id: "6",
			title: "Water Recycling in Space Habitats",
			author: "Dr. Robert Kim",
			category: "Engineering",
			tags: ["water", "recycling", "habitats", "engineering"],
			relatedAuthors: ["Dr. James Wilson", "Dr. Michael Chen"],
			citations: 634,
			year: 2024,
			keywords: ["water purification", "closed-loop systems", "waste management"],
			relatedTopics: ["life support systems", "resource management", "habitat design"]
		},
		{
			id: "7",
			title: "Space Medicine Protocols",
			author: "Dr. Amanda Davis",
			category: "Medicine",
			tags: ["medicine", "emergency", "protocols", "healthcare"],
			relatedAuthors: ["Dr. Michael Chen", "Dr. Lisa Thompson"],
			citations: 1456,
			year: 2024,
			keywords: ["emergency procedures", "medical equipment", "diagnosis"],
			relatedTopics: ["crew health", "mission safety", "medical training"]
		},
		{
			id: "8",
			title: "Lunar Agriculture Feasibility Study", 
			author: "Dr. Carlos Martinez",
			category: "Agriculture",
			tags: ["lunar", "agriculture", "regolith", "crops"],
			relatedAuthors: ["Dr. Sarah Johnson", "Dr. James Wilson"],
			citations: 987,
			year: 2024,
			keywords: ["lunar soil", "crop cultivation", "regolith processing"],
			relatedTopics: ["lunar settlements", "food security", "sustainable agriculture"]
		}
	];
	
	// Store documents in global state
	currentGraph.documents = documents;
	
	// Calculate multiple types of connections
	const connections = [];
	
	// 1. Tag-based connections
	for (let i = 0; i < documents.length; i++) {
		for (let j = i + 1; j < documents.length; j++) {
			const doc1 = documents[i];
			const doc2 = documents[j];
			const sharedTags = doc1.tags.filter(tag => doc2.tags.includes(tag));
			if (sharedTags.length > 0) {
				connections.push({
					source: i,
					target: j,
					strength: sharedTags.length,
					sharedTags: sharedTags,
					type: 'tags',
					label: `Shared: ${sharedTags.join(', ')}`
				});
			}
		}
	}
	
	// 2. Author collaboration connections
	for (let i = 0; i < documents.length; i++) {
		for (let j = i + 1; j < documents.length; j++) {
			const doc1 = documents[i];
			const doc2 = documents[j];
			const sharedAuthors = doc1.relatedAuthors.filter(author => doc2.relatedAuthors.includes(author));
			if (sharedAuthors.length > 0) {
				connections.push({
					source: i,
					target: j,
					strength: sharedAuthors.length,
					sharedAuthors: sharedAuthors,
					type: 'collaboration',
					label: `Collaboration: ${sharedAuthors.join(', ')}`
				});
			}
		}
	}
	
	// 3. Topic-based connections
	for (let i = 0; i < documents.length; i++) {
		for (let j = i + 1; j < documents.length; j++) {
			const doc1 = documents[i];
			const doc2 = documents[j];
			const sharedTopics = doc1.relatedTopics.filter(topic => doc2.relatedTopics.includes(topic));
			if (sharedTopics.length > 0) {
				connections.push({
					source: i,
					target: j,
					strength: sharedTopics.length,
					sharedTopics: sharedTopics,
					type: 'topics',
					label: `Topics: ${sharedTopics.join(', ')}`
				});
			}
		}
	}
	
	// Set up SVG dimensions
	const container = document.getElementById('graphContainer');
	const width = container.clientWidth;
	const height = container.clientHeight;
	
	svg.setAttribute('width', width);
	svg.setAttribute('height', height);
	
	// Create enhanced nodes
	const nodes = documents.map((doc, index) => ({
		id: doc.id,
		title: doc.title,
		author: doc.author,
		category: doc.category,
		tags: doc.tags,
		relatedAuthors: doc.relatedAuthors,
		citations: doc.citations,
		year: doc.year,
		keywords: doc.keywords,
		relatedTopics: doc.relatedTopics,
		x: Math.random() * (width - 100) + 50,
		y: Math.random() * (height - 100) + 50,
		vx: 0,
		vy: 0,
		radius: Math.max(15, Math.min(30, 15 + (doc.citations / 100))), // Size based on citations
		expanded: false,
		connections: []
	}));
	
	// Store in global state
	currentGraph.nodes = nodes;
	currentGraph.connections = connections;
	
	// Simple force simulation
	const simulation = () => {
		// Repulsion between nodes
		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				const dx = nodes[i].x - nodes[j].x;
				const dy = nodes[i].y - nodes[j].y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const minDistance = 80;
				
				if (distance < minDistance) {
					const force = (minDistance - distance) / minDistance;
					const fx = (dx / distance) * force * 0.5;
					const fy = (dy / distance) * force * 0.5;
					
					nodes[i].vx += fx;
					nodes[i].vy += fy;
					nodes[j].vx -= fx;
					nodes[j].vy -= fy;
				}
			}
		}
		
		// Attraction for connected nodes
		connections.forEach(conn => {
			const source = nodes[conn.source];
			const target = nodes[conn.target];
			const dx = target.x - source.x;
			const dy = target.y - source.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const idealDistance = 120;
			
			if (distance > idealDistance) {
				const force = (distance - idealDistance) / idealDistance * 0.1;
				const fx = (dx / distance) * force;
				const fy = (dy / distance) * force;
				
				source.vx += fx;
				source.vy += fy;
				target.vx -= fx;
				target.vy -= fy;
			}
		});
		
		// Apply velocity and damping
		nodes.forEach(node => {
			node.x += node.vx;
			node.y += node.vy;
			node.vx *= 0.8;
			node.vy *= 0.8;
			
			// Keep nodes within bounds
			node.x = Math.max(30, Math.min(width - 30, node.x));
			node.y = Math.max(30, Math.min(height - 30, node.y));
		});
	};
	
	// Animation loop
	let animationId;
	const animate = () => {
		simulation();
		renderGraph();
		animationId = requestAnimationFrame(animate);
	};
	
	// Render the graph with Neo4j-like features
	const renderGraph = () => {
		svg.innerHTML = '';
		
		// Draw connections with different styles
		connections.forEach(conn => {
			const source = nodes[conn.source];
			const target = nodes[conn.target];
			
			const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
			line.setAttribute('x1', source.x);
			line.setAttribute('y1', source.y);
			line.setAttribute('x2', target.x);
			line.setAttribute('y2', target.y);
			
			// Different colors for different connection types
			const connectionColors = {
				'tags': '#FFE500',
				'collaboration': '#00d4ff',
				'topics': '#ff6b6b'
			};
			
			line.setAttribute('stroke', connectionColors[conn.type] || '#FFE500');
			line.setAttribute('stroke-width', conn.strength);
			line.setAttribute('opacity', '0.7');
			line.style.cursor = 'pointer';
			
			// Add connection label on hover
			line.addEventListener('mouseenter', (e) => {
				showConnectionTooltip(conn, e);
			});
			
			line.addEventListener('mouseleave', () => {
				hideTooltip();
			});
			
			svg.appendChild(line);
		});
		
		// Draw nodes with enhanced features
		nodes.forEach(node => {
			const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			
			// Node circle with size based on citations
			const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
			circle.setAttribute('cx', node.x);
			circle.setAttribute('cy', node.y);
			circle.setAttribute('r', node.radius);
			circle.setAttribute('fill', getCategoryColor(node.category));
			circle.setAttribute('stroke', currentGraph.selectedNode === node.id ? '#FFE500' : '#333');
			circle.setAttribute('stroke-width', currentGraph.selectedNode === node.id ? '3' : '2');
			circle.style.cursor = 'pointer';
			
			// Add expand/collapse indicator
			if (node.expanded) {
				const expandIcon = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
				expandIcon.setAttribute('cx', node.x + node.radius - 5);
				expandIcon.setAttribute('cy', node.y - node.radius + 5);
				expandIcon.setAttribute('r', '4');
				expandIcon.setAttribute('fill', '#FFE500');
				group.appendChild(expandIcon);
			}
			
			group.appendChild(circle);
			
			// Node text
			const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			text.setAttribute('x', node.x);
			text.setAttribute('y', node.y + 5);
			text.setAttribute('text-anchor', 'middle');
			text.setAttribute('fill', 'white');
			text.setAttribute('font-size', '10');
			text.setAttribute('font-weight', 'bold');
			text.textContent = node.id;
			group.appendChild(text);
			
			// Add click handler for deep exploration
			group.addEventListener('click', (e) => {
				e.stopPropagation();
				selectNode(node);
			});
			
			// Add drag functionality
			let isDragging = false;
			let dragStartX = 0;
			let dragStartY = 0;
			
			group.addEventListener('mousedown', (e) => {
				isDragging = true;
				dragStartX = e.clientX - node.x;
				dragStartY = e.clientY - node.y;
				group.style.cursor = 'grabbing';
				e.preventDefault();
			});
			
			document.addEventListener('mousemove', (e) => {
				if (isDragging) {
					node.x = e.clientX - dragStartX;
					node.y = e.clientY - dragStartY;
					
					// Keep nodes within bounds
					const container = document.getElementById('graphContainer');
					const width = container.clientWidth;
					const height = container.clientHeight;
					
					node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
					node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
					
					// Re-render the graph
					renderGraph();
				}
			});
			
			document.addEventListener('mouseup', () => {
				if (isDragging) {
					isDragging = false;
					group.style.cursor = 'pointer';
				}
			});
			
			// Add hover effect
			group.addEventListener('mouseenter', () => {
				if (!isDragging) {
					showEnhancedTooltip(node);
				}
			});
			
			group.addEventListener('mouseleave', () => {
				if (!isDragging) {
					hideTooltip();
				}
			});
			
			svg.appendChild(group);
		});
		
		// Add zoom and pan controls
		addGraphControls();
		
		// Add pan functionality to the graph
		addPanFunctionality();
	};
	
	// Start animation
	animate();
	
	// Stop animation after a few seconds
	setTimeout(() => {
		cancelAnimationFrame(animationId);
	}, 3000);
};

function getCategoryColor(category) {
	const colors = {
		'Botany': '#4ade80',
		'Engineering': '#3b82f6', 
		'Physiology': '#ef4444',
		'Agriculture': '#f59e0b',
		'Psychology': '#8b5cf6',
		'Medicine': '#06b6d4',
		'Agriculture': '#f59e0b'
	};
	return colors[category] || '#6b7280';
}

// Neo4j-like deep exploration functions
function selectNode(node) {
	currentGraph.selectedNode = node.id;
	
	// Show detailed node panel
	showNodeDetails(node);
	
	// Highlight connected nodes
	highlightConnectedNodes(node);
	
	// Re-render graph
	renderGraph();
}

function showNodeDetails(node) {
	// Remove existing details panel
	const existingPanel = document.getElementById('nodeDetailsPanel');
	if (existingPanel) {
		existingPanel.remove();
	}
	
	// Create detailed panel
	const panel = document.createElement('div');
	panel.id = 'nodeDetailsPanel';
	panel.className = 'absolute top-4 right-4 w-80 bg-[#1a1a2e] border border-[#FFE500] rounded-lg p-4 shadow-lg z-50 max-h-96 overflow-y-auto';
	panel.innerHTML = `
		<div class="flex justify-between items-start mb-3">
			<h3 class="text-lg font-semibold text-white">Document Details</h3>
			<button onclick="closeNodeDetails()" class="text-gray-400 hover:text-white">×</button>
		</div>
		
		<div class="space-y-3">
			<div>
				<h4 class="text-sm font-semibold text-[#FFE500] mb-1">Title</h4>
				<p class="text-sm text-white">${node.title}</p>
			</div>
			
			<div>
				<h4 class="text-sm font-semibold text-[#FFE500] mb-1">Author</h4>
				<p class="text-sm text-white">${node.author}</p>
			</div>
			
			<div>
				<h4 class="text-sm font-semibold text-[#FFE500] mb-1">Citations</h4>
				<p class="text-sm text-white">${node.citations.toLocaleString()}</p>
			</div>
			
			<div>
				<h4 class="text-sm font-semibold text-[#FFE500] mb-1">Keywords</h4>
				<div class="flex flex-wrap gap-1">
					${node.keywords.map(keyword => `<span class="text-xs bg-[#00d4ff]/10 text-[#00d4ff] px-2 py-1 rounded">${keyword}</span>`).join('')}
				</div>
			</div>
			
			<div>
				<h4 class="text-sm font-semibold text-[#FFE500] mb-1">Related Authors</h4>
				<div class="flex flex-wrap gap-1">
					${node.relatedAuthors.map(author => `<span class="text-xs bg-[#ff6b6b]/10 text-[#ff6b6b] px-2 py-1 rounded">${author}</span>`).join('')}
				</div>
			</div>
			
			<div>
				<h4 class="text-sm font-semibold text-[#FFE500] mb-1">Related Topics</h4>
				<div class="flex flex-wrap gap-1">
					${node.relatedTopics.map(topic => `<span class="text-xs bg-[#4ade80]/10 text-[#4ade80] px-2 py-1 rounded">${topic}</span>`).join('')}
				</div>
			</div>
			
			<div class="pt-2 border-t border-[#333]">
				<button onclick="expandNode('${node.id}')" class="w-full bg-[#FFE500] text-black py-2 px-3 rounded text-sm font-medium hover:bg-[#FFD700] transition-colors">
					Explore Connections
				</button>
			</div>
		</div>
	`;
	
	document.body.appendChild(panel);
}

function closeNodeDetails() {
	const panel = document.getElementById('nodeDetailsPanel');
	if (panel) {
		panel.remove();
	}
	currentGraph.selectedNode = null;
	renderGraph();
}

function expandNode(nodeId) {
	const node = currentGraph.nodes.find(n => n.id === nodeId);
	if (node) {
		node.expanded = !node.expanded;
		
		if (node.expanded) {
			// Show related nodes with more detail
			showRelatedNodes(node);
		} else {
			// Hide related nodes
			hideRelatedNodes(node);
		}
		
		renderGraph();
	}
}

function showRelatedNodes(node) {
	// Find connections for this node
	const relatedConnections = currentGraph.connections.filter(conn => 
		currentGraph.nodes[conn.source].id === node.id || 
		currentGraph.nodes[conn.target].id === node.id
	);
	
	// Highlight related nodes
	relatedConnections.forEach(conn => {
		const relatedNodeId = conn.source === currentGraph.nodes.findIndex(n => n.id === node.id) ? 
			currentGraph.nodes[conn.target].id : currentGraph.nodes[conn.source].id;
		
		const relatedNode = currentGraph.nodes.find(n => n.id === relatedNodeId);
		if (relatedNode) {
			relatedNode.highlighted = true;
		}
	});
}

function hideRelatedNodes(node) {
	// Remove highlighting from all nodes
	currentGraph.nodes.forEach(n => {
		n.highlighted = false;
	});
}

function highlightConnectedNodes(node) {
	// Find all nodes connected to the selected node
	const connectedNodeIds = new Set();
	
	currentGraph.connections.forEach(conn => {
		const sourceNode = currentGraph.nodes[conn.source];
		const targetNode = currentGraph.nodes[conn.target];
		
		if (sourceNode.id === node.id) {
			connectedNodeIds.add(targetNode.id);
		} else if (targetNode.id === node.id) {
			connectedNodeIds.add(sourceNode.id);
		}
	});
	
	// Mark connected nodes
	currentGraph.nodes.forEach(n => {
		n.connected = connectedNodeIds.has(n.id);
	});
}

function showEnhancedTooltip(node) {
	// Remove existing tooltip
	const existingTooltip = document.getElementById('graphTooltip');
	if (existingTooltip) {
		existingTooltip.remove();
	}
	
	// Create enhanced tooltip
	const tooltip = document.createElement('div');
	tooltip.id = 'graphTooltip';
	tooltip.className = 'absolute bg-[#1a1a2e] border border-[#FFE500] rounded-lg p-3 shadow-lg z-50 max-w-xs';
	tooltip.innerHTML = `
		<h4 class="text-sm font-semibold text-white mb-1">${node.title}</h4>
		<p class="text-xs text-gray-400 mb-2">by ${node.author}</p>
		<div class="text-xs text-gray-300 mb-2">
			<span class="text-[#FFE500]">${node.citations}</span> citations • <span class="text-[#00d4ff]">${node.year}</span>
		</div>
		<div class="flex flex-wrap gap-1 mb-2">
			${node.tags.slice(0, 3).map(tag => `<span class="text-xs bg-[#FFE500]/10 text-[#FFE500] px-1 py-0.5 rounded">${tag}</span>`).join('')}
		</div>
		<div class="text-xs text-gray-400">
			Click to explore connections
		</div>
	`;
	
	document.body.appendChild(tooltip);
	
	// Position tooltip
	const updatePosition = (e) => {
		tooltip.style.left = e.pageX + 10 + 'px';
		tooltip.style.top = e.pageY - 10 + 'px';
	};
	
	document.addEventListener('mousemove', updatePosition);
	
	// Store cleanup function
	tooltip._cleanup = () => {
		document.removeEventListener('mousemove', updatePosition);
	};
}

function showConnectionTooltip(conn, event) {
	// Remove existing tooltip
	const existingTooltip = document.getElementById('graphTooltip');
	if (existingTooltip) {
		existingTooltip.remove();
	}
	
	// Create connection tooltip
	const tooltip = document.createElement('div');
	tooltip.id = 'graphTooltip';
	tooltip.className = 'absolute bg-[#1a1a2e] border border-[#FFE500] rounded-lg p-3 shadow-lg z-50 max-w-xs';
	tooltip.innerHTML = `
		<h4 class="text-sm font-semibold text-[#FFE500] mb-1">Connection</h4>
		<p class="text-xs text-white mb-2">${conn.label}</p>
		<div class="text-xs text-gray-400">
			Strength: ${conn.strength} • Type: ${conn.type}
		</div>
	`;
	
	document.body.appendChild(tooltip);
	
	// Position tooltip
	tooltip.style.left = event.pageX + 10 + 'px';
	tooltip.style.top = event.pageY - 10 + 'px';
}

function addGraphControls() {
	// Add zoom and pan controls
	const controls = document.createElement('div');
	controls.className = 'absolute bottom-4 left-4 flex gap-2';
	controls.innerHTML = `
		<button onclick="zoomIn()" class="bg-[#333] text-white px-3 py-1 rounded text-sm hover:bg-[#444]">Zoom In</button>
		<button onclick="zoomOut()" class="bg-[#333] text-white px-3 py-1 rounded text-sm hover:bg-[#444]">Zoom Out</button>
		<button onclick="resetView()" class="bg-[#333] text-white px-3 py-1 rounded text-sm hover:bg-[#444]">Reset</button>
		<button onclick="toggleConnections()" class="bg-[#333] text-white px-3 py-1 rounded text-sm hover:bg-[#444]">Toggle Types</button>
	`;
	
	document.getElementById('graphContainer').appendChild(controls);
}

function zoomIn() {
	currentGraph.zoomLevel = Math.min(2, currentGraph.zoomLevel * 1.2);
	applyTransform();
}

function zoomOut() {
	currentGraph.zoomLevel = Math.max(0.5, currentGraph.zoomLevel * 0.8);
	applyTransform();
}

function resetView() {
	currentGraph.zoomLevel = 1;
	currentGraph.panX = 0;
	currentGraph.panY = 0;
	applyTransform();
}

function applyTransform() {
	const svg = document.getElementById('graphSvg');
	if (svg) {
		svg.style.transform = `scale(${currentGraph.zoomLevel}) translate(${currentGraph.panX}px, ${currentGraph.panY}px)`;
	}
}

function toggleConnections() {
	// Toggle visibility of different connection types
	// This would be implemented based on your specific needs
	console.log('Toggle connection types');
}

function addPanFunctionality() {
	const svg = document.getElementById('graphSvg');
	const container = document.getElementById('graphContainer');
	
	let isPanning = false;
	let panStartX = 0;
	let panStartY = 0;
	
	// Pan with mouse
	container.addEventListener('mousedown', (e) => {
		// Only pan if not clicking on a node
		if (e.target.tagName === 'svg' || e.target.tagName === 'line') {
			isPanning = true;
			panStartX = e.clientX - currentGraph.panX;
			panStartY = e.clientY - currentGraph.panY;
			container.style.cursor = 'grabbing';
		}
	});
	
	document.addEventListener('mousemove', (e) => {
		if (isPanning) {
			currentGraph.panX = e.clientX - panStartX;
			currentGraph.panY = e.clientY - panStartY;
			applyTransform();
		}
	});
	
	document.addEventListener('mouseup', () => {
		if (isPanning) {
			isPanning = false;
			container.style.cursor = 'default';
		}
	});
	
	// Pan with touch (mobile)
	container.addEventListener('touchstart', (e) => {
		if (e.touches.length === 1) {
			const touch = e.touches[0];
			isPanning = true;
			panStartX = touch.clientX - currentGraph.panX;
			panStartY = touch.clientY - currentGraph.panY;
		}
	});
	
	container.addEventListener('touchmove', (e) => {
		if (isPanning && e.touches.length === 1) {
			const touch = e.touches[0];
			currentGraph.panX = touch.clientX - panStartX;
			currentGraph.panY = touch.clientY - panStartY;
			applyTransform();
		}
	});
	
	container.addEventListener('touchend', () => {
		isPanning = false;
	});
	
	// Zoom with mouse wheel
	container.addEventListener('wheel', (e) => {
		e.preventDefault();
		const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
		currentGraph.zoomLevel = Math.max(0.1, Math.min(5, currentGraph.zoomLevel * zoomFactor));
		applyTransform();
	});
}

function hideTooltip() {
	const tooltip = document.getElementById('graphTooltip');
	if (tooltip) {
		if (tooltip._cleanup) {
			tooltip._cleanup();
		}
		tooltip.remove();
	}
}
