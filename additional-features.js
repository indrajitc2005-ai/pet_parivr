// Additional Features JavaScript

// Pet Age Calculators
function calculateDogAge() {
  const age = document.getElementById('dogAge').value;
  const size = document.getElementById('dogSize').value;
  const resultDiv = document.getElementById('dogAgeResult');
  
  if (!age || age <= 0) {
    resultDiv.innerHTML = 'Please enter a valid age';
    return;
  }
  
  let humanAge;
  const dogAge = parseInt(age);
  
  // Different calculations based on size
  if (size === 'small') {
    humanAge = dogAge <= 2 ? dogAge * 12.5 : 24 + (dogAge - 2) * 4.5;
  } else if (size === 'medium') {
    humanAge = dogAge <= 2 ? dogAge * 10.5 : 21 + (dogAge - 2) * 5.5;
  } else { // large
    humanAge = dogAge <= 2 ? dogAge * 9 : 18 + (dogAge - 2) * 7;
  }
  
  resultDiv.innerHTML = `🐕 Your dog is approximately <strong>${Math.round(humanAge)} human years</strong> old!`;
}

function calculateCatAge() {
  const age = document.getElementById('catAge').value;
  const resultDiv = document.getElementById('catAgeResult');
  
  if (!age || age <= 0) {
    resultDiv.innerHTML = 'Please enter a valid age';
    return;
  }
  
  const catAge = parseInt(age);
  let humanAge;
  
  if (catAge === 1) {
    humanAge = 15;
  } else if (catAge === 2) {
    humanAge = 24;
  } else {
    humanAge = 24 + (catAge - 2) * 4;
  }
  
  resultDiv.innerHTML = `🐱 Your cat is approximately <strong>${humanAge} human years</strong> old!`;
}

function calculateFood() {
  const weight = document.getElementById('petWeight').value;
  const activity = document.getElementById('activityLevel').value;
  const resultDiv = document.getElementById('foodResult');
  
  if (!weight || weight <= 0) {
    resultDiv.innerHTML = 'Please enter a valid weight';
    return;
  }
  
  const petWeight = parseInt(weight);
  let baseCalories = petWeight * 30 + 70; // RER formula
  
  // Adjust for activity level
  let multiplier;
  switch (activity) {
    case 'low': multiplier = 1.2; break;
    case 'moderate': multiplier = 1.6; break;
    case 'high': multiplier = 2.0; break;
    default: multiplier = 1.6;
  }
  
  const dailyCalories = Math.round(baseCalories * multiplier);
  const cupsOfFood = Math.round((dailyCalories / 400) * 10) / 10; // Assuming 400 cal/cup
  
  resultDiv.innerHTML = `🍽️ Daily needs: <strong>${dailyCalories} calories</strong><br>Approximately <strong>${cupsOfFood} cups</strong> of dry food`;
}

// Reminder System
let reminders = JSON.parse(localStorage.getItem('petReminders')) || [];

function addReminder() {
  const task = document.getElementById('reminderTask').value;
  const date = document.getElementById('reminderDate').value;
  const pet = document.getElementById('reminderPet').value;
  
  if (!task || !date || !pet) {
    alert('Please fill in all fields');
    return;
  }
  
  const reminder = {
    id: Date.now(),
    task,
    date,
    pet,
    completed: false
  };
  
  reminders.push(reminder);
  localStorage.setItem('petReminders', JSON.stringify(reminders));
  
  // Clear form
  document.getElementById('reminderTask').value = '';
  document.getElementById('reminderDate').value = '';
  document.getElementById('reminderPet').value = '';
  
  displayReminders();
  showNotification('Reminder added successfully! 📅');
}

function displayReminders() {
  const remindersList = document.getElementById('remindersList');
  const today = new Date();
  
  // Sort reminders by date
  const sortedReminders = reminders
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  remindersList.innerHTML = sortedReminders.map(reminder => {
    const reminderDate = new Date(reminder.date);
    const daysUntil = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
    
    let dueDateText;
    if (daysUntil < 0) {
      dueDateText = `Overdue by ${Math.abs(daysUntil)} days`;
    } else if (daysUntil === 0) {
      dueDateText = 'Due today';
    } else if (daysUntil === 1) {
      dueDateText = 'Due tomorrow';
    } else {
      dueDateText = `Due in ${daysUntil} days`;
    }
    
    const petEmoji = {
      'dog': '🐕',
      'cat': '🐱',
      'bird': '🦜',
      'rabbit': '🐰'
    }[reminder.pet] || '🐾';
    
    return `
      <div class="reminder-item">
        <div class="reminder-icon">${getTaskIcon(reminder.task)}</div>
        <div class="reminder-details">
          <h4>${reminder.task}</h4>
          <p>${petEmoji} ${reminder.pet} - ${dueDateText}</p>
        </div>
        <button class="reminder-done" onclick="completeReminder(${reminder.id})">✓</button>
      </div>
    `;
  }).join('');
}

function getTaskIcon(task) {
  const taskLower = task.toLowerCase();
  if (taskLower.includes('vet') || taskLower.includes('checkup')) return '🩺';
  if (taskLower.includes('groom') || taskLower.includes('nail')) return '✂️';
  if (taskLower.includes('flea') || taskLower.includes('medicine')) return '💊';
  if (taskLower.includes('food') || taskLower.includes('feed')) return '🍽️';
  return '📅';
}

function completeReminder(id) {
  reminders = reminders.map(r => 
    r.id === id ? { ...r, completed: true } : r
  );
  localStorage.setItem('petReminders', JSON.stringify(reminders));
  displayReminders();
  showNotification('Reminder completed! ✅');
}

// Breed Search and Filter
function searchBreeds() {
  const searchTerm = document.getElementById('breedSearch').value.toLowerCase();
  const breedCards = document.querySelectorAll('.breed-card');
  
  breedCards.forEach(card => {
    const breedName = card.querySelector('h3').textContent.toLowerCase();
    const breedDescription = card.querySelector('p').textContent.toLowerCase();
    
    if (breedName.includes(searchTerm) || breedDescription.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterBreeds(type) {
  const breedCards = document.querySelectorAll('.breed-card');
  const categoryBtns = document.querySelectorAll('.breed-categories .category-btn');
  
  // Update active button
  categoryBtns.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  breedCards.forEach(card => {
    if (type === 'all' || card.dataset.type === type) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Lost & Found System
function switchLostFoundTab(tabName) {
  const tabs = document.querySelectorAll('.lost-found-tabs .tab-btn');
  const panels = document.querySelectorAll('.lost-found-content .tab-panel');
  
  // Update active tab
  tabs.forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
  
  // Show corresponding panel
  panels.forEach(panel => panel.classList.remove('active'));
  document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Training Video Filter
function filterTraining(category) {
  const videoCards = document.querySelectorAll('.video-card');
  const categoryBtns = document.querySelectorAll('.training-categories .category-btn');
  
  // Update active button
  categoryBtns.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  videoCards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Notification System
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'feature-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #051019;
    padding: 15px 20px;
    border-radius: 12px;
    font-weight: 600;
    z-index: 10000;
    animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Insurance Plan Selection
function selectInsurancePlan(planName) {
  showNotification(`${planName} plan selected! Redirecting to enrollment... 🛡️`);
  // Here you would typically redirect to an enrollment page
}

// Video Play Functionality
function playVideo(videoTitle) {
  showNotification(`Playing: ${videoTitle} 🎥`);
  // Here you would typically open a video player or redirect to video page
}

// Initialize Additional Features
document.addEventListener('DOMContentLoaded', () => {
  // Display existing reminders
  if (document.getElementById('remindersList')) {
    displayReminders();
  }
  
  // Add click handlers for insurance plans
  document.querySelectorAll('.insurance-plan .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = e.target.closest('.insurance-plan').querySelector('h3').textContent;
      selectInsurancePlan(planName);
    });
  });
  
  // Add click handlers for video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoTitle = card.querySelector('h3').textContent;
      playVideo(videoTitle);
    });
  });
  
  // Add click handlers for breed cards
  document.querySelectorAll('.breed-card .btn-small').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const breedName = e.target.closest('.breed-card').querySelector('h3').textContent;
      showNotification(`Loading ${breedName} information... 📚`);
    });
  });
  
  // Add form submission handlers
  document.querySelectorAll('.report-form .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const formType = e.target.closest('.tab-panel').id.includes('lost') ? 'lost pet' : 'found pet';
      showNotification(`${formType.charAt(0).toUpperCase() + formType.slice(1)} report submitted! 📝`);
    });
  });
});

// Export functions for global use
window.calculateDogAge = calculateDogAge;
window.calculateCatAge = calculateCatAge;
window.calculateFood = calculateFood;
window.addReminder = addReminder;
window.completeReminder = completeReminder;
window.searchBreeds = searchBreeds;
window.filterBreeds = filterBreeds;
window.switchLostFoundTab = switchLostFoundTab;
window.filterTraining = filterTraining;