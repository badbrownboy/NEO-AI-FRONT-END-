// Neo Super AI Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Get DOM elements
    const loader = document.querySelector('.loader');
    const dashboard = document.getElementById('dashboard');
    const connectionLoader = document.getElementById('connection-loader');
    const sidebar = document.querySelector('.sidebar');
    
    console.log('Elements found:', {
        loader: !!loader,
        dashboard: !!dashboard,
        connectionLoader: !!connectionLoader,
        sidebar: !!sidebar
    });
    
    // Sidebar state management
    let sidebarOpen = false;
    
    // Internet connectivity functions
    function checkConnection() {
        return navigator.onLine;
    }
    
    function updateConnectionStatus() {
        if (!checkConnection()) {
            if (connectionLoader) connectionLoader.style.display = 'flex';
            if (dashboard) dashboard.style.display = 'none';
            if (loader) loader.style.display = 'none';
        } else {
            if (connectionLoader) connectionLoader.style.display = 'none';
            // Don't automatically show dashboard here, let the main loading sequence handle it
        }
    }
    
    // Sidebar toggle functionality
    function toggleSidebar() {
        console.log('Toggle sidebar called, current state:', sidebarOpen);
        if (sidebarOpen) {
            // Collapse sidebar (show icons only)
            sidebar.classList.remove('sidebar-open');
            sidebar.classList.add('sidebar-closed');
            dashboard.classList.add('sidebar-closed');
            sidebarOpen = false;
            console.log('Sidebar collapsed');
        } else {
            // Expand sidebar (show icons and text)
            sidebar.classList.remove('sidebar-closed');
            sidebar.classList.add('sidebar-open');
            dashboard.classList.remove('sidebar-closed');
            sidebarOpen = true;
            console.log('Sidebar expanded');
        }
        
        // Adjust layout after sidebar toggle
        setTimeout(() => {
            if (typeof adjustLayoutForWindowSize === 'function') {
                adjustLayoutForWindowSize();
            }
        }, 100);
    }
    
    // Initialize sidebar state (start expanded)
    if (sidebar) {
        console.log('Initializing sidebar');
        sidebar.classList.add('sidebar-open');
        sidebar.classList.remove('sidebar-closed');
        if (dashboard) dashboard.classList.remove('sidebar-closed');
        sidebarOpen = true;
        console.log('Sidebar initialized as expanded');
    }
    
    // Event listeners
    // Add click event to sidebar logo for toggling
    function setupSidebarLogoToggle() {
        const sidebarLogoToggle = document.getElementById('sidebar-logo-toggle');
        console.log('Setting up sidebar logo toggle, element found:', !!sidebarLogoToggle);
        
        if (sidebarLogoToggle) {
            sidebarLogoToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Sidebar logo clicked');
                toggleSidebar();
            });
            
            // Add hover effect to change icon
            sidebarLogoToggle.addEventListener('mouseenter', function() {
                console.log('Mouse entered logo, changing to menu');
                this.textContent = 'menu';
            });
            
            sidebarLogoToggle.addEventListener('mouseleave', function() {
                console.log('Mouse left logo, changing back to smart_toy');
                this.textContent = 'smart_toy';
            });
            
            console.log('Sidebar logo event listeners added successfully');
        } else {
            console.error('Sidebar logo element not found!');
        }
    }
    
    // Close sidebar when clicking outside (only collapse it, don't hide completely)
    document.addEventListener('click', function(event) {
        const sidebarLogoToggle = document.getElementById('sidebar-logo-toggle');
        const plusMenu = document.getElementById('plus-menu');
        const plusMenuContainer = document.querySelector('.plus-menu-container');
        const toolMenu = document.getElementById('tool-menu');
        const toolMenuContainer = document.querySelector('.tool-menu-container');
        
        // Handle sidebar click-outside
        if (sidebar && sidebarOpen && 
            !sidebar.contains(event.target) && 
            (!sidebarLogoToggle || !sidebarLogoToggle.contains(event.target))) {
            // On mobile, close sidebar completely, on desktop just collapse
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('sidebar-open');
                sidebar.classList.add('sidebar-closed');
                dashboard.classList.add('sidebar-closed');
                sidebarOpen = false;
            } else {
                toggleSidebar();
            }
        }
        
        // Handle plus menu click-outside
        if (plusMenu && plusMenuContainer && 
            !plusMenuContainer.contains(event.target) && 
            plusMenu.classList.contains('show')) {
            plusMenu.classList.remove('show');
            console.log('Plus menu closed by outside click');
        }
        
        // Handle tool menu click-outside
        if (toolMenu && toolMenuContainer && 
            !toolMenuContainer.contains(event.target) && 
            toolMenu.classList.contains('show')) {
            toolMenu.classList.remove('show');
            console.log('Tool menu closed by outside click');
        }
    });
    
    // Internet connectivity monitoring
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    updateConnectionStatus();
    
    // Window resize event listener for responsive behavior
    window.addEventListener('resize', function() {
        console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight);
        // Only adjust layout if dashboard is visible
        if (dashboard && dashboard.style.display !== 'none') {
            adjustLayoutForWindowSize();
        }
    });
    
    // Initial loading sequence
    setTimeout(function() {
        console.log('Loading timeout triggered');
        if (loader) {
            loader.style.display = 'none';
            console.log('Loader hidden');
        }
        if (checkConnection()) {
            console.log('Connection is good');
            if (dashboard) {
                dashboard.style.display = 'flex';
                console.log('Dashboard displayed');
                
                // Set up sidebar logo toggle after dashboard is visible
                setupSidebarLogoToggle();
                
                // Set up plus menu functionality after dashboard is visible
                setupPlusMenu();
                
                // Set up tool menu functionality after dashboard is visible
                setupToolMenu();
                
                // Now that dashboard is visible, adjust layout
                setTimeout(() => {
                    adjustLayoutForWindowSize();
                }, 100);
            }
        } else {
            console.log('No internet connection');
            updateConnectionStatus();
        }
    }, 2000); // Back to 2 seconds for proper loading experience
    
    // Bubble input interactions
    const inputField = document.querySelector('.bubble-input');
    const micBtn = document.getElementById('mic-btn');
    const plusBtn = document.getElementById('plus-btn');
    const toolBtn = document.getElementById('tool-btn');
    
    // Auto-resize textarea function
    function autoResizeTextarea(textarea) {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        
        // Calculate the new height based on content
        const scrollHeight = textarea.scrollHeight;
        const minHeight = 48; // Minimum height in pixels (smaller for more compact look)
        const maxHeight = Math.min(320, window.innerHeight * 0.4); // Max 320px or 40% of screen height
        
        // Set the height within the min/max bounds
        const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
        textarea.style.height = newHeight + 'px';
        
        // Enable/disable scrolling based on content
        if (scrollHeight > maxHeight) {
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.overflowY = 'hidden';
        }
    }
    
    // Responsive layout adjustment function
    function adjustLayoutForWindowSize() {
        // Only run if dashboard is visible to avoid errors during loading
        if (!dashboard || dashboard.style.display === 'none') {
            console.log('Dashboard not ready, skipping layout adjustment');
            return;
        }
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        console.log('Adjusting layout for window size:', windowWidth, 'x', windowHeight);
        
        // Handle small screens (mobile/tablet) - keep same format as desktop, just scaled
        if (windowWidth <= 768) {
            // DON'T auto-close sidebar on small screens - let user control it
            // Just ensure sidebar has proper z-index for overlay
            if (sidebar) {
                sidebar.style.zIndex = '1000';
            }
            
            // Keep text bubble in same position and format as desktop
            // Just scale down the sizes proportionally
            const bubbleContainer = document.querySelector('.center-bubble-container');
            if (bubbleContainer) {
                bubbleContainer.style.left = '0';
                bubbleContainer.style.right = '0';
                bubbleContainer.style.top = '55%'; // Same as desktop
            }
            
            const centerBubble = document.querySelector('.center-bubble');
            if (centerBubble) {
                // Scale down but keep same proportions as desktop
                centerBubble.style.minWidth = Math.max(350, windowWidth * 0.6) + 'px';
                centerBubble.style.maxWidth = Math.max(500, windowWidth * 0.85) + 'px';
                centerBubble.style.padding = '1.2rem 2rem 1rem 2rem'; // Slightly smaller but same format
            }
            
            // Scale down input field but keep same format
            const inputLarge = document.querySelector('.bubble-input-large');
            if (inputLarge) {
                inputLarge.style.minWidth = Math.max(300, windowWidth * 0.5) + 'px';
                inputLarge.style.maxWidth = Math.max(450, windowWidth * 0.8) + 'px';
                inputLarge.style.padding = '0.9rem 120px 0.9rem 1.3rem'; // Scaled down
            }
        } else {
            // On larger screens, restore normal layout
            const bubbleContainer = document.querySelector('.center-bubble-container');
            if (bubbleContainer) {
                bubbleContainer.style.left = '0';
                bubbleContainer.style.right = '0';
                bubbleContainer.style.top = '55%';
            }
            
            const centerBubble = document.querySelector('.center-bubble');
            if (centerBubble) {
                centerBubble.style.minWidth = '650px';
                centerBubble.style.maxWidth = '90vw';
                centerBubble.style.padding = '1.5rem 2.5rem 1.2rem 2.5rem';
            }
            
            const inputLarge = document.querySelector('.bubble-input-large');
            if (inputLarge) {
                inputLarge.style.minWidth = '500px';
                inputLarge.style.maxWidth = '800px';
                inputLarge.style.padding = '1rem 140px 1rem 1.5rem';
            }
        }
        
        // Adjust textarea max height based on window height
        if (inputField) {
            autoResizeTextarea(inputField);
        }
    }
    
    if (inputField) {
        // Auto-resize on input
        inputField.addEventListener('input', function() {
            console.log('Input changed:', this.value);
            autoResizeTextarea(this);
        });
        
        // Auto-resize on paste
        inputField.addEventListener('paste', function() {
            setTimeout(() => {
                autoResizeTextarea(this);
            }, 10);
        });
        
        // Handle Enter key behavior
        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                // Handle form submission here
                console.log('Form submitted with content:', this.value);
                // You can add your form submission logic here
            }
        });
        
        // Initial resize
        autoResizeTextarea(inputField);
    }
    
    if (micBtn) {
        micBtn.addEventListener('click', function() {
            console.log('Microphone clicked');
        });
    }
    
    // Plus menu setup function
    function setupPlusMenu() {
        const plusBtn = document.getElementById('plus-btn');
        const plusMenu = document.getElementById('plus-menu');
        
        console.log('Setting up plus menu, elements found:', {
            plusBtn: !!plusBtn,
            plusMenu: !!plusMenu
        });
        
        if (plusBtn && plusMenu) {
            plusBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Plus icon clicked');
                togglePlusMenu();
            });
            
            // Plus menu item event listeners
            const imagesBtn = document.getElementById('images-btn');
            const filesBtn = document.getElementById('files-btn');
            const cameraBtn = document.getElementById('camera-btn');
            const controlBtn = document.getElementById('control-btn');
            
            if (imagesBtn) {
                imagesBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('Images button clicked');
                    togglePlusMenu(); // Close menu after selection
                    // Add image upload functionality here
                });
            }
            
            if (filesBtn) {
                filesBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('Files button clicked');
                    togglePlusMenu(); // Close menu after selection
                    // Add file upload functionality here
                });
            }
            
            if (cameraBtn) {
                cameraBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('Camera button clicked');
                    togglePlusMenu(); // Close menu after selection
                    // Add camera functionality here
                });
            }
            
            if (controlBtn) {
                controlBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('Control button clicked');
                    togglePlusMenu(); // Close menu after selection
                    // Add control functionality here
                });
            }
            
            console.log('Plus menu setup complete');
        }
    }
    
    // Tool menu setup function
    function setupToolMenu() {
        const toolBtn = document.getElementById('tool-btn');
        const toolMenu = document.getElementById('tool-menu');
        
        console.log('Setting up tool menu, elements found:', {
            toolBtn: !!toolBtn,
            toolMenu: !!toolMenu
        });
        
        if (toolBtn && toolMenu) {
            toolBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Tool icon clicked');
                toggleToolMenu();
            });
            
            // Tool menu item event listeners
            const screenShareBtn = document.getElementById('screen-share-btn');
            const voiceAssistantBtn = document.getElementById('voice-assistant-btn');
            const toolControlBtn = document.getElementById('tool-control-btn');
            const allToolsBtn = document.getElementById('all-tools-btn');
            
            if (screenShareBtn) {
                screenShareBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('Screen Share button clicked');
                    toggleToolMenu(); // Close menu after selection
                    // Add screen share functionality here
                });
            }
            
            if (voiceAssistantBtn) {
                voiceAssistantBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('Voice Assistant button clicked');
                    toggleToolMenu(); // Close menu after selection
                    // Add voice assistant functionality here
                });
            }
            
            if (toolControlBtn) {
                toolControlBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('Tool Control button clicked');
                    toggleToolMenu(); // Close menu after selection
                    // Add tool control functionality here
                });
            }
            
            if (allToolsBtn) {
                allToolsBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('All Tools button clicked');
                    toggleToolMenu(); // Close menu after selection
                    // Add all tools functionality here
                });
            }
            
            console.log('Tool menu setup complete');
        }
    }
    
    // Plus menu toggle function
    function togglePlusMenu() {
        const plusMenu = document.getElementById('plus-menu');
        if (plusMenu) {
            const isVisible = plusMenu.classList.contains('show');
            if (isVisible) {
                plusMenu.classList.remove('show');
                console.log('Plus menu hidden');
            } else {
                plusMenu.classList.add('show');
                console.log('Plus menu shown');
            }
        }
    }
    
    // Tool menu toggle function
    function toggleToolMenu() {
        const toolMenu = document.getElementById('tool-menu');
        if (toolMenu) {
            const isVisible = toolMenu.classList.contains('show');
            if (isVisible) {
                toolMenu.classList.remove('show');
                console.log('Tool menu hidden');
            } else {
                toolMenu.classList.add('show');
                console.log('Tool menu shown');
            }
        }
    }
    
    if (toolBtn) {
        toolBtn.addEventListener('click', function() {
            console.log('Tool icon clicked');
        });
    }
    
    // Navigation menu clicks with enhanced functionality
    document.querySelectorAll('.nav-link, .footer-link').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to clicked link (only for nav-link, not footer-link)
            if (this.classList.contains('nav-link')) {
                this.classList.add('active');
            }
            
            const text = this.querySelector('.nav-text, .footer-text');
            if (text) {
                console.log('Navigation item clicked:', text.textContent.trim());
                
                // Special handling for New Chat
                if (text.textContent.trim() === 'New Chat') {
                    console.log('🌟 New Chat started!');
                    // Add any new chat functionality here
                }
            }
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            console.log('🎵 Hover effect for', this.querySelector('.nav-text, .footer-text')?.textContent);
        });
    });
});
