
(function() {
  // Configuration options passed via URL parameters or global variable
  const getConfig = () => {
    const scriptTag = document.currentScript;
    const apiKey = scriptTag.getAttribute('data-api-key') || 'demo-key';
    const position = scriptTag.getAttribute('data-position') || 'bottom-right';
    const darkMode = scriptTag.getAttribute('data-dark-mode') === 'true';
    const productName = scriptTag.getAttribute('data-product-name') || document.title;
    
    return { apiKey, position, darkMode, productName };
  };

  const config = getConfig();
  
  // Create widget container
  const createWidgetContainer = () => {
    const container = document.createElement('div');
    container.id = 'feedback-widget-container';
    container.style.position = 'fixed';
    container.style.zIndex = '9999';
    
    // Position the widget based on configuration
    switch(config.position) {
      case 'bottom-right':
        container.style.bottom = '20px';
        container.style.right = '20px';
        break;
      case 'bottom-left':
        container.style.bottom = '20px';
        container.style.left = '20px';
        break;
      case 'top-right':
        container.style.top = '20px';
        container.style.right = '20px';
        break;
      case 'top-left':
        container.style.top = '20px';
        container.style.left = '20px';
        break;
    }
    
    document.body.appendChild(container);
    return container;
  };
  
  // Load required styles
  const loadStyles = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://saasy-spark.lovable.app/widget-styles.css';
    document.head.appendChild(link);
    
    // Add basic styles as a fallback
    const style = document.createElement('style');
    style.textContent = `
      #feedback-widget-container button {
        border: none;
        cursor: pointer;
        transition: transform 0.2s;
      }
      #feedback-widget-container button:hover {
        transform: scale(1.05);
      }
      #feedback-widget-container .widget-button {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      #feedback-widget-container .widget-panel {
        width: 320px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: all 0.3s ease;
      }
      #feedback-widget-container .dark-mode {
        background: #1f2937;
        color: white;
      }
    `;
    document.head.appendChild(style);
  };
  
  // Initialize widget
  const initWidget = () => {
    const container = createWidgetContainer();
    loadStyles();
    
    // Create widget button
    const button = document.createElement('button');
    button.className = 'widget-button';
    button.style.backgroundColor = config.darkMode ? '#1f2937' : '#3b82f6';
    button.style.color = 'white';
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path></svg>';
    
    const widgetState = { isOpen: false };
    
    button.addEventListener('click', () => {
      if (!widgetState.isOpen) {
        container.removeChild(button);
        
        // Create and show feedback panel
        const panel = createFeedbackPanel();
        container.appendChild(panel);
        widgetState.isOpen = true;
      }
    });
    
    container.appendChild(button);
    
    // Create feedback panel with form
    const createFeedbackPanel = () => {
      const panel = document.createElement('div');
      panel.className = 'widget-panel';
      if (config.darkMode) panel.classList.add('dark-mode');
      
      let currentRating = null;
      let submitted = false;
      let firstName = '';
      let lastName = '';
      let email = '';
      let feedbackText = '';
      
      const renderPanel = () => {
        if (submitted) {
          panel.innerHTML = `
            <div style="padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="font-weight: 600; margin: 0;">Thank you!</h3>
                <button class="close-btn" style="background: none; padding: 5px; border-radius: 50%;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div style="display: flex; flex-direction: column; align-items: center; padding: 15px 0;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p style="text-align: center; margin-top: 10px;">Your feedback has been submitted. We appreciate your input!</p>
              </div>
            </div>
          `;
          
          panel.querySelector('.close-btn').addEventListener('click', () => {
            container.removeChild(panel);
            container.appendChild(button);
            widgetState.isOpen = false;
            submitted = false;
            currentRating = null;
          });
          
          setTimeout(() => {
            if (document.contains(panel)) {
              container.removeChild(panel);
              container.appendChild(button);
              widgetState.isOpen = false;
              submitted = false;
              currentRating = null;
            }
          }, 3000);
          
        } else {
          panel.innerHTML = `
            <div style="padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="font-weight: 600; margin: 0;">How's ${config.productName}?</h3>
                <button class="close-btn" style="background: none; padding: 5px; border-radius: 50%;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <div class="stars" style="display: flex; justify-content: center; gap: 8px; margin-bottom: 15px;">
                ${[1, 2, 3, 4, 5].map(star => `
                  <button class="star" data-value="${star}" style="background: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${currentRating !== null && star <= currentRating ? '#facc15' : 'none'}" stroke="${currentRating !== null && star <= currentRating ? '#facc15' : '#d1d5db'}" stroke-width="1.5">
                      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"></path>
                    </svg>
                  </button>
                `).join('')}
              </div>
              
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: ${config.darkMode ? '#e5e7eb' : '#374151'};">First Name*</label>
                <input class="first-name-input" type="text" placeholder="Your first name" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid ${config.darkMode ? '#4b5563' : '#e5e7eb'}; background: ${config.darkMode ? '#374151' : 'white'}; color: ${config.darkMode ? 'white' : 'black'};">
              </div>
              
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: ${config.darkMode ? '#e5e7eb' : '#374151'};">Last Name*</label>
                <input class="last-name-input" type="text" placeholder="Your last name" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid ${config.darkMode ? '#4b5563' : '#e5e7eb'}; background: ${config.darkMode ? '#374151' : 'white'}; color: ${config.darkMode ? 'white' : 'black'};">
              </div>
              
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: ${config.darkMode ? '#e5e7eb' : '#374151'};">Email*</label>
                <input class="email-input" type="email" placeholder="Your email address" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid ${config.darkMode ? '#4b5563' : '#e5e7eb'}; background: ${config.darkMode ? '#374151' : 'white'}; color: ${config.darkMode ? 'white' : 'black'};">
              </div>
              
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: 500; color: ${config.darkMode ? '#e5e7eb' : '#374151'};">Feedback*</label>
                <textarea class="feedback-text" placeholder="Share your thoughts about our product..." style="width: 100%; min-height: 100px; padding: 10px; border-radius: 6px; resize: none; border: 1px solid ${config.darkMode ? '#4b5563' : '#e5e7eb'}; background: ${config.darkMode ? '#374151' : 'white'}; color: ${config.darkMode ? 'white' : 'black'};"></textarea>
              </div>
              
              <button class="submit-btn" style="width: 100%; padding: 10px; border-radius: 6px; background-color: ${config.darkMode ? '#374151' : '#3b82f6'}; color: white; font-weight: 500;">Submit Feedback</button>
              
              <div style="margin-top: 12px; text-align: center; font-size: 12px; color: ${config.darkMode ? '#9ca3af' : '#6b7280'};">
                Powered by FeedbackSaaS
              </div>
            </div>
          `;
          
          // Add event listeners
          panel.querySelector('.close-btn').addEventListener('click', () => {
            container.removeChild(panel);
            container.appendChild(button);
            widgetState.isOpen = false;
          });
          
          panel.querySelectorAll('.star').forEach(starBtn => {
            starBtn.addEventListener('click', () => {
              currentRating = parseInt(starBtn.getAttribute('data-value'));
              renderPanel(); // Re-render to update stars
            });
          });
          
          // Get input elements
          const firstNameInput = panel.querySelector('.first-name-input');
          const lastNameInput = panel.querySelector('.last-name-input');
          const emailInput = panel.querySelector('.email-input');
          const feedbackTextarea = panel.querySelector('.feedback-text');
          
          // Set values if they exist
          if (firstName) firstNameInput.value = firstName;
          if (lastName) lastNameInput.value = lastName;
          if (email) emailInput.value = email;
          if (feedbackText) feedbackTextarea.value = feedbackText;
          
          // Add input event listeners to save values
          firstNameInput.addEventListener('input', (e) => { firstName = e.target.value; });
          lastNameInput.addEventListener('input', (e) => { lastName = e.target.value; });
          emailInput.addEventListener('input', (e) => { email = e.target.value; });
          feedbackTextarea.addEventListener('input', (e) => { feedbackText = e.target.value; });
          
          panel.querySelector('.submit-btn').addEventListener('click', () => {
            // Get values
            firstName = panel.querySelector('.first-name-input').value;
            lastName = panel.querySelector('.last-name-input').value;
            email = panel.querySelector('.email-input').value;
            feedbackText = panel.querySelector('.feedback-text').value;
            
            // Validate inputs
            if (!firstName || !lastName || !email || !feedbackText || currentRating === null) {
              alert('Please fill in all required fields and provide a rating');
              return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              alert('Please enter a valid email address');
              return;
            }
            
            // Simulate API call
            panel.querySelector('.submit-btn').innerHTML = 'Submitting...';
            panel.querySelector('.submit-btn').disabled = true;
            
            // Create feedback data object
            const feedbackData = {
              first_name: firstName,
              last_name: lastName,
              email: email,
              rating: currentRating,
              feedback: feedbackText,
              product_name: config.productName,
              url: window.location.href,
              user_agent: navigator.userAgent
            };
            
            // Submit feedback to Supabase
            fetch('https://jguptbivgcofgbxnbfjy.supabase.co/rest/v1/feedback', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndXB0Yml2Z2NvZmdieG5iZmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2OTE0MDksImV4cCI6MjA1ODI2NzQwOX0.llRWPou_9dKSUWK3I3TSJ0WOwyvituYDCuFPLE2xZ7U',
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify(feedbackData)
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to submit feedback');
              }
              
              console.log('Feedback submitted successfully');
              
              // Show success state
              submitted = true;
              renderPanel();
            })
            .catch(error => {
              console.error('Error submitting feedback:', error);
              alert('There was an error submitting your feedback. Please try again.');
              panel.querySelector('.submit-btn').innerHTML = 'Submit Feedback';
              panel.querySelector('.submit-btn').disabled = false;
            });
          });
        }
      };
      
      renderPanel();
      return panel;
    };
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
