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
	
	// Initialize charts
	initializeCharts();
});

function initializeCharts() {
	// Sample data for charts
	const documents = [
		{ title: "Plant Adaptations to Extreme Environments", score: 0.645, type: "text", area: "Astrobiology" },
		{ title: "Permafrost-Mimicked Conditions", score: 0.630, type: "text", area: "Microbiology" },
		{ title: "Microbial Existence in Space", score: 0.629, type: "text", area: "Microbiology" },
		{ title: "Sustainable Space Exploration", score: 0.627, type: "text", area: "Engineering" },
		{ title: "In Situ Resource Utilization", score: 0.627, type: "text", area: "Engineering" },
		{ title: "Microbial Existence in Controlled Habitats", score: 0.624, type: "text", area: "Microbiology" },
		{ title: "Microbial Existence in Space Conditions", score: 0.623, type: "text", area: "Microbiology" },
		{ title: "Microbial Existence in Controlled Habitats", score: 0.622, type: "text", area: "Microbiology" },
		{ title: "Microbial Existence in Space Conditions", score: 0.621, type: "text", area: "Microbiology" },
		{ title: "Phylogenomic Analysis", score: 0.620, type: "text", area: "Genetics" },
		{ title: "Microbial Existence in Controlled Habitats", score: 0.620, type: "text", area: "Microbiology" }
	];
	
	// Chart.js configuration
	const chartConfig = {
		responsive: true,
		maintainAspectRatio: false,
		aspectRatio: 1.5,
		plugins: {
			legend: {
				labels: {
					color: '#ffffff',
					font: {
						size: 12
					}
				}
			}
		},
		scales: {
			x: {
				ticks: {
					color: '#9ca3af'
				},
				grid: {
					color: '#374151'
				}
			},
			y: {
				ticks: {
					color: '#9ca3af'
				},
				grid: {
					color: '#374151'
				}
			}
		}
	};
	
	// 1. Score Distribution Chart (Bar Chart)
	const scoreCtx = document.getElementById('scoreChart').getContext('2d');
	const scoreRanges = [
		{ range: '0.6-0.65', count: documents.filter(d => d.score >= 0.6 && d.score < 0.65).length },
		{ range: '0.65-0.7', count: documents.filter(d => d.score >= 0.65 && d.score < 0.7).length },
		{ range: '0.7-0.75', count: documents.filter(d => d.score >= 0.7 && d.score < 0.75).length },
		{ range: '0.75+', count: documents.filter(d => d.score >= 0.75).length }
	];
	
	new Chart(scoreCtx, {
		type: 'bar',
		data: {
			labels: scoreRanges.map(r => r.range),
			datasets: [{
				label: 'Documents',
				data: scoreRanges.map(r => r.count),
				backgroundColor: [
					'rgba(255, 229, 0, 0.8)',
					'rgba(0, 212, 255, 0.8)',
					'rgba(74, 222, 128, 0.8)',
					'rgba(245, 158, 11, 0.8)'
				],
				borderColor: [
					'#FFE500',
					'#00d4ff',
					'#4ade80',
					'#f59e0b'
				],
				borderWidth: 2
			}]
		},
		options: {
			...chartConfig,
			plugins: {
				...chartConfig.plugins,
				title: {
					display: true,
					text: 'Score Distribution',
					color: '#ffffff',
					font: {
						size: 16,
						weight: 'bold'
					}
				}
			}
		}
	});
	
	// 2. Research Areas Pie Chart
	const areasCtx = document.getElementById('areasChart').getContext('2d');
	const areaCounts = {};
	documents.forEach(doc => {
		areaCounts[doc.area] = (areaCounts[doc.area] || 0) + 1;
	});
	
	new Chart(areasCtx, {
		type: 'doughnut',
		data: {
			labels: Object.keys(areaCounts),
			datasets: [{
				data: Object.values(areaCounts),
				backgroundColor: [
					'rgba(255, 229, 0, 0.8)',
					'rgba(0, 212, 255, 0.8)',
					'rgba(74, 222, 128, 0.8)',
					'rgba(245, 158, 11, 0.8)',
					'rgba(168, 85, 247, 0.8)',
					'rgba(239, 68, 68, 0.8)'
				],
				borderColor: [
					'#FFE500',
					'#00d4ff',
					'#4ade80',
					'#f59e0b',
					'#a855f7',
					'#ef4444'
				],
				borderWidth: 2
			}]
		},
		options: {
			...chartConfig,
			plugins: {
				...chartConfig.plugins,
				title: {
					display: true,
					text: 'Research Areas Distribution',
					color: '#ffffff',
					font: {
						size: 16,
						weight: 'bold'
					}
				}
			}
		}
	});
	
	// 3. Score Trend Chart (Line Chart)
	const trendCtx = document.getElementById('trendChart').getContext('2d');
	const sortedDocs = [...documents].sort((a, b) => a.score - b.score);
	
	new Chart(trendCtx, {
		type: 'line',
		data: {
			labels: sortedDocs.map((_, index) => `Doc ${index + 1}`),
			datasets: [{
				label: 'Score',
				data: sortedDocs.map(doc => doc.score),
				borderColor: '#FFE500',
				backgroundColor: 'rgba(255, 229, 0, 0.1)',
				borderWidth: 3,
				fill: true,
				tension: 0.4,
				pointBackgroundColor: '#FFE500',
				pointBorderColor: '#ffffff',
				pointBorderWidth: 2,
				pointRadius: 4
			}]
		},
		options: {
			...chartConfig,
			plugins: {
				...chartConfig.plugins,
				title: {
					display: true,
					text: 'Score Trends Across Documents',
					color: '#ffffff',
					font: {
						size: 16,
						weight: 'bold'
					}
				}
			}
		}
	});
	
	// 4. Document Types Chart (Polar Area Chart)
	const typesCtx = document.getElementById('typesChart').getContext('2d');
	const typeCounts = {};
	documents.forEach(doc => {
		typeCounts[doc.type] = (typeCounts[doc.type] || 0) + 1;
	});
	
	new Chart(typesCtx, {
		type: 'polarArea',
		data: {
			labels: Object.keys(typeCounts),
			datasets: [{
				data: Object.values(typeCounts),
				backgroundColor: [
					'rgba(255, 229, 0, 0.8)',
					'rgba(0, 212, 255, 0.8)',
					'rgba(74, 222, 128, 0.8)',
					'rgba(245, 158, 11, 0.8)'
				],
				borderColor: [
					'#FFE500',
					'#00d4ff',
					'#4ade80',
					'#f59e0b'
				],
				borderWidth: 2
			}]
		},
		options: {
			...chartConfig,
			plugins: {
				...chartConfig.plugins,
				title: {
					display: true,
					text: 'Document Types Distribution',
					color: '#ffffff',
					font: {
						size: 16,
						weight: 'bold'
					}
				}
			}
		}
	});
}
