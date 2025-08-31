/**
 * Advanced AI-Powered Pet Health Monitoring System
 * Features: Symptom analysis, health predictions, medication reminders, vaccination tracking
 */

class AdvancedPetHealthAI {
  constructor() {
    this.healthData = new Map();
    this.symptoms = new Map();
    this.medications = new Map();
    this.vaccinations = new Map();
    this.healthPredictions = new Map();
    this.init();
  }

  init() {
    this.setupHealthMonitoring();
    this.setupSymptomAnalyzer();
    this.setupMedicationReminders();
    this.setupVaccinationTracker();
    this.setupHealthPredictions();
    this.setupWearableIntegration();
  }

  // AI Symptom Analyzer
  setupSymptomAnalyzer() {
    const symptomAnalyzer = document.createElement('div');
    symptomAnalyzer.className = 'ai-symptom-analyzer';
    symptomAnalyzer.innerHTML = `
      <div class="analyzer-header">
        <h3>🤖 AI Symptom Analyzer</h3>
        <p>Describe your pet's symptoms for instant AI analysis</p>
      </div>
      <div class="symptom-input">
        <textarea id="symptomDescription" placeholder="Describe symptoms: e.g., 'My dog is lethargic, not eating, and has been vomiting'"></textarea>
        <div class="symptom-tags">
          <span class="symptom-tag" data-symptom="lethargy">Lethargy</span>
          <span class="symptom-tag" data-symptom="vomiting">Vomiting</span>
          <span class="symptom-tag" data-symptom="diarrhea">Diarrhea</span>
          <span class="symptom-tag" data-symptom="loss-appetite">Loss of Appetite</span>
          <span class="symptom-tag" data-symptom="coughing">Coughing</span>
          <span class="symptom-tag" data-symptom="limping">Limping</span>
          <span class="symptom-tag" data-symptom="excessive-drinking">Excessive Drinking</span>
          <span class="symptom-tag" data-symptom="difficulty-breathing">Difficulty Breathing</span>
        </div>
        <button class="btn analyze-btn" id="analyzeSymptoms">🔍 Analyze Symptoms</button>
      </div>
      <div class="analysis-results" id="analysisResults"></div>
    `;

    // Add to health monitoring section
    const healthSection = document.querySelector('.health-monitoring') || this.createHealthSection();
    healthSection.appendChild(symptomAnalyzer);

    this.bindSymptomAnalyzer();
  }

  bindSymptomAnalyzer() {
    const analyzeBtn = document.getElementById('analyzeSymptoms');
    const symptomTags = document.querySelectorAll('.symptom-tag');
    const symptomInput = document.getElementById('symptomDescription');

    // Symptom tag selection
    symptomTags.forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
        this.updateSymptomInput();
      });
    });

    // AI Analysis
    analyzeBtn.addEventListener('click', () => {
      this.performSymptomAnalysis();
    });

    // Real-time suggestions
    symptomInput.addEventListener('input', (e) => {
      this.provideSuggestions(e.target.value);
    });
  }

  async performSymptomAnalysis() {
    const symptoms = document.getElementById('symptomDescription').value;
    const selectedTags = Array.from(document.querySelectorAll('.symptom-tag.selected'))
      .map(tag => tag.dataset.symptom);

    if (!symptoms && selectedTags.length === 0) {
      this.showNotification('Please describe symptoms or select tags', 'warning');
      return;
    }

    const analysisResults = document.getElementById('analysisResults');
    analysisResults.innerHTML = `
      <div class="analyzing">
        <div class="ai-thinking">
          <div class="thinking-dots"></div>
          <p>AI is analyzing symptoms...</p>
        </div>
      </div>
    `;

    // Simulate AI analysis (in real app, this would call actual AI service)
    setTimeout(() => {
      const analysis = this.generateHealthAnalysis(symptoms, selectedTags);
      this.displayAnalysisResults(analysis);
    }, 2000);
  }

  generateHealthAnalysis(symptoms, tags) {
    // Advanced AI analysis simulation
    const conditions = this.matchConditions(symptoms, tags);
    const urgency = this.assessUrgency(conditions);
    const recommendations = this.generateRecommendations(conditions, urgency);

    return {
      conditions,
      urgency,
      recommendations,
      confidence: this.calculateConfidence(conditions),
      nextSteps: this.suggestNextSteps(urgency)
    };
  }

  matchConditions(symptoms, tags) {
    const conditionDatabase = {
      'gastroenteritis': {
        keywords: ['vomiting', 'diarrhea', 'loss of appetite', 'lethargy'],
        severity: 'moderate',
        description: 'Inflammation of stomach and intestines'
      },
      'respiratory_infection': {
        keywords: ['coughing', 'difficulty breathing', 'lethargy'],
        severity: 'high',
        description: 'Upper or lower respiratory tract infection'
      },
      'arthritis': {
        keywords: ['limping', 'difficulty moving', 'stiffness'],
        severity: 'moderate',
        description: 'Joint inflammation causing pain and stiffness'
      },
      'diabetes': {
        keywords: ['excessive drinking', 'frequent urination', 'weight loss'],
        severity: 'high',
        description: 'Blood sugar regulation disorder'
      }
    };

    const matches = [];
    const allSymptoms = [...tags, ...symptoms.toLowerCase().split(' ')];

    Object.entries(conditionDatabase).forEach(([condition, data]) => {
      const matchCount = data.keywords.filter(keyword => 
        allSymptoms.some(symptom => symptom.includes(keyword.replace('_', ' ')))
      ).length;

      if (matchCount > 0) {
        matches.push({
          condition,
          ...data,
          matchScore: (matchCount / data.keywords.length) * 100
        });
      }
    });

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  displayAnalysisResults(analysis) {
    const resultsContainer = document.getElementById('analysisResults');
    
    resultsContainer.innerHTML = `
      <div class="analysis-complete">
        <div class="analysis-header">
          <h4>🎯 AI Analysis Complete</h4>
          <div class="confidence-meter">
            <span>Confidence: ${analysis.confidence}%</span>
            <div class="confidence-bar">
              <div class="confidence-fill" style="width: ${analysis.confidence}%"></div>
            </div>
          </div>
        </div>

        <div class="possible-conditions">
          <h5>🔍 Possible Conditions:</h5>
          ${analysis.conditions.map(condition => `
            <div class="condition-card ${condition.severity}">
              <div class="condition-header">
                <span class="condition-name">${condition.condition.replace('_', ' ').toUpperCase()}</span>
                <span class="match-score">${Math.round(condition.matchScore)}% match</span>
              </div>
              <p class="condition-description">${condition.description}</p>
              <div class="severity-indicator ${condition.severity}">
                Severity: ${condition.severity.toUpperCase()}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="urgency-assessment ${analysis.urgency.level}">
          <h5>⚡ Urgency Assessment:</h5>
          <div class="urgency-card">
            <span class="urgency-level">${analysis.urgency.level.toUpperCase()}</span>
            <p>${analysis.urgency.message}</p>
          </div>
        </div>

        <div class="recommendations">
          <h5>💡 AI Recommendations:</h5>
          <ul class="recommendation-list">
            ${analysis.recommendations.map(rec => `
              <li class="recommendation-item">
                <span class="rec-icon">${rec.icon}</span>
                <span class="rec-text">${rec.text}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="next-steps">
          <h5>🎯 Suggested Next Steps:</h5>
          <div class="steps-timeline">
            ${analysis.nextSteps.map((step, index) => `
              <div class="step-item">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                  <h6>${step.title}</h6>
                  <p>${step.description}</p>
                  <span class="step-timeframe">${step.timeframe}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn emergency-btn" onclick="this.bookEmergencyConsult()">🚨 Emergency Consult</button>
          <button class="btn" onclick="this.bookRegularConsult()">📅 Schedule Appointment</button>
          <button class="btn ghost" onclick="this.saveAnalysis()">💾 Save Analysis</button>
        </div>
      </div>
    `;
  }

  // Smart Medication Reminder System
  setupMedicationReminders() {
    const medicationSystem = document.createElement('div');
    medicationSystem.className = 'medication-reminder-system';
    medicationSystem.innerHTML = `
      <div class="medication-header">
        <h3>💊 Smart Medication Manager</h3>
        <button class="btn add-medication-btn" id="addMedication">+ Add Medication</button>
      </div>
      <div class="medication-list" id="medicationList"></div>
      <div class="medication-calendar" id="medicationCalendar"></div>
    `;

    const healthSection = document.querySelector('.health-monitoring') || this.createHealthSection();
    healthSection.appendChild(medicationSystem);

    this.bindMedicationSystem();
  }

  bindMedicationSystem() {
    document.getElementById('addMedication').addEventListener('click', () => {
      this.showMedicationModal();
    });

    this.loadMedications();
    this.setupMedicationNotifications();
  }

  showMedicationModal() {
    const modal = document.createElement('div');
    modal.className = 'medication-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h4>Add New Medication</h4>
          <button class="close-modal">&times;</button>
        </div>
        <form class="medication-form" id="medicationForm">
          <div class="form-group">
            <label>Pet Name</label>
            <select id="petSelect" required>
              <option value="">Select Pet</option>
              <option value="buddy">Buddy (Dog)</option>
              <option value="whiskers">Whiskers (Cat)</option>
              <option value="max">Max (Dog)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Medication Name</label>
            <input type="text" id="medicationName" required placeholder="e.g., Antibiotics, Pain Relief">
          </div>
          <div class="form-group">
            <label>Dosage</label>
            <input type="text" id="dosage" required placeholder="e.g., 1 tablet, 5ml">
          </div>
          <div class="form-group">
            <label>Frequency</label>
            <select id="frequency" required>
              <option value="">Select Frequency</option>
              <option value="once-daily">Once Daily</option>
              <option value="twice-daily">Twice Daily</option>
              <option value="three-times-daily">Three Times Daily</option>
              <option value="every-8-hours">Every 8 Hours</option>
              <option value="as-needed">As Needed</option>
            </select>
          </div>
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" id="startDate" required>
          </div>
          <div class="form-group">
            <label>Duration (days)</label>
            <input type="number" id="duration" required min="1" placeholder="e.g., 7, 14">
          </div>
          <div class="form-group">
            <label>Special Instructions</label>
            <textarea id="instructions" placeholder="e.g., Give with food, Avoid dairy"></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn">Add Medication</button>
            <button type="button" class="btn ghost cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    this.bindMedicationModal(modal);
  }

  // IoT Pet Wearable Integration
  setupWearableIntegration() {
    const wearableSection = document.createElement('div');
    wearableSection.className = 'iot-wearable-dashboard';
    wearableSection.innerHTML = `
      <div class="wearable-header">
        <h3>📱 Smart Pet Wearables</h3>
        <div class="connection-status">
          <span class="status-indicator connected"></span>
          <span>2 devices connected</span>
        </div>
      </div>
      <div class="wearable-devices">
        <div class="device-card">
          <div class="device-info">
            <h4>🐕 Buddy's Smart Collar</h4>
            <span class="device-status online">Online</span>
          </div>
          <div class="device-metrics">
            <div class="metric">
              <span class="metric-label">Steps Today</span>
              <span class="metric-value">8,247</span>
            </div>
            <div class="metric">
              <span class="metric-label">Heart Rate</span>
              <span class="metric-value">85 BPM</span>
            </div>
            <div class="metric">
              <span class="metric-label">Temperature</span>
              <span class="metric-value">101.2°F</span>
            </div>
            <div class="metric">
              <span class="metric-label">Activity Level</span>
              <span class="metric-value">High</span>
            </div>
          </div>
          <div class="device-alerts">
            <div class="alert normal">✅ All vitals normal</div>
          </div>
        </div>

        <div class="device-card">
          <div class="device-info">
            <h4>🐱 Whiskers' Health Monitor</h4>
            <span class="device-status online">Online</span>
          </div>
          <div class="device-metrics">
            <div class="metric">
              <span class="metric-label">Activity</span>
              <span class="metric-value">Moderate</span>
            </div>
            <div class="metric">
              <span class="metric-label">Sleep Quality</span>
              <span class="metric-value">Good</span>
            </div>
            <div class="metric">
              <span class="metric-label">Eating Pattern</span>
              <span class="metric-value">Normal</span>
            </div>
            <div class="metric">
              <span class="metric-label">Location</span>
              <span class="metric-value">Home</span>
            </div>
          </div>
          <div class="device-alerts">
            <div class="alert warning">⚠️ Slightly elevated temperature</div>
          </div>
        </div>
      </div>
      <div class="wearable-analytics">
        <h4>📊 Health Analytics</h4>
        <div class="analytics-charts">
          <canvas id="healthChart" width="400" height="200"></canvas>
        </div>
      </div>
    `;

    const healthSection = document.querySelector('.health-monitoring') || this.createHealthSection();
    healthSection.appendChild(wearableSection);

    this.initializeHealthCharts();
    this.startRealTimeMonitoring();
  }

  initializeHealthCharts() {
    // Simulate health data visualization
    const canvas = document.getElementById('healthChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    this.drawHealthChart(ctx, canvas.width, canvas.height);
  }

  drawHealthChart(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw heart rate trend
    ctx.strokeStyle = '#ff77c6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const heartRateData = [75, 78, 82, 85, 83, 80, 85, 88, 85, 82];
    const stepSize = width / (heartRateData.length - 1);

    heartRateData.forEach((rate, index) => {
      const x = index * stepSize;
      const y = height - ((rate - 60) / 40) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Add labels
    ctx.fillStyle = '#78dbff';
    ctx.font = '12px Arial';
    ctx.fillText('Heart Rate (BPM)', 10, 20);
  }

  startRealTimeMonitoring() {
    // Simulate real-time data updates
    setInterval(() => {
      this.updateWearableData();
    }, 30000); // Update every 30 seconds
  }

  updateWearableData() {
    // Simulate receiving new data from wearables
    const devices = document.querySelectorAll('.device-card');
    devices.forEach(device => {
      const metrics = device.querySelectorAll('.metric-value');
      metrics.forEach(metric => {
        // Add subtle animations to show data updates
        metric.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
          metric.style.animation = '';
        }, 500);
      });
    });
  }

  // Health Prediction System
  setupHealthPredictions() {
    const predictionSystem = document.createElement('div');
    predictionSystem.className = 'health-prediction-system';
    predictionSystem.innerHTML = `
      <div class="prediction-header">
        <h3>🔮 AI Health Predictions</h3>
        <p>Based on historical data and current trends</p>
      </div>
      <div class="prediction-cards">
        <div class="prediction-card low-risk">
          <div class="prediction-icon">🟢</div>
          <div class="prediction-content">
            <h4>Overall Health Risk</h4>
            <span class="risk-level">Low Risk</span>
            <p>Based on current vitals and activity levels, your pets are in excellent health.</p>
            <div class="prediction-confidence">Confidence: 94%</div>
          </div>
        </div>

        <div class="prediction-card medium-risk">
          <div class="prediction-icon">🟡</div>
          <div class="prediction-content">
            <h4>Seasonal Allergies</h4>
            <span class="risk-level">Medium Risk</span>
            <p>Spring allergy season approaching. Consider preventive measures for Buddy.</p>
            <div class="prediction-confidence">Confidence: 78%</div>
          </div>
        </div>

        <div class="prediction-card info">
          <div class="prediction-icon">🔵</div>
          <div class="prediction-content">
            <h4>Vaccination Due</h4>
            <span class="risk-level">Reminder</span>
            <p>Whiskers' annual vaccination is due in 2 weeks.</p>
            <div class="prediction-confidence">Scheduled: March 15</div>
          </div>
        </div>
      </div>
      <div class="prediction-trends">
        <h4>📈 Health Trends</h4>
        <div class="trend-items">
          <div class="trend-item positive">
            <span class="trend-icon">📈</span>
            <span class="trend-text">Activity levels increased 15% this month</span>
          </div>
          <div class="trend-item neutral">
            <span class="trend-icon">➡️</span>
            <span class="trend-text">Weight stable within healthy range</span>
          </div>
          <div class="trend-item attention">
            <span class="trend-icon">⚠️</span>
            <span class="trend-text">Sleep pattern slightly irregular for Whiskers</span>
          </div>
        </div>
      </div>
    `;

    const healthSection = document.querySelector('.health-monitoring') || this.createHealthSection();
    healthSection.appendChild(predictionSystem);
  }

  createHealthSection() {
    const healthSection = document.createElement('section');
    healthSection.className = 'health-monitoring';
    healthSection.style.marginTop = '40px';
    healthSection.innerHTML = `
      <h2>🏥 Advanced Pet Health Monitoring</h2>
      <p style="color:var(--muted); margin-top:4px">AI-powered health analysis and monitoring system</p>
    `;

    const main = document.querySelector('main.container');
    if (main) {
      main.appendChild(healthSection);
    }

    return healthSection;
  }

  // Utility methods
  assessUrgency(conditions) {
    if (conditions.some(c => c.severity === 'high')) {
      return {
        level: 'high',
        message: 'Immediate veterinary attention recommended. Some symptoms suggest serious conditions.'
      };
    } else if (conditions.some(c => c.severity === 'moderate')) {
      return {
        level: 'moderate',
        message: 'Schedule a veterinary appointment within 24-48 hours.'
      };
    } else {
      return {
        level: 'low',
        message: 'Monitor symptoms. Contact vet if symptoms worsen or persist.'
      };
    }
  }

  generateRecommendations(conditions, urgency) {
    const recommendations = [];

    if (urgency.level === 'high') {
      recommendations.push({
        icon: '🚨',
        text: 'Seek immediate veterinary care'
      });
    }

    recommendations.push(
      {
        icon: '📝',
        text: 'Keep a detailed log of symptoms and their progression'
      },
      {
        icon: '💧',
        text: 'Ensure your pet stays hydrated'
      },
      {
        icon: '🏠',
        text: 'Keep your pet comfortable and limit activity'
      },
      {
        icon: '📞',
        text: 'Have emergency vet contact information ready'
      }
    );

    return recommendations;
  }

  calculateConfidence(conditions) {
    if (conditions.length === 0) return 0;
    const avgScore = conditions.reduce((sum, c) => sum + c.matchScore, 0) / conditions.length;
    return Math.round(avgScore);
  }

  suggestNextSteps(urgency) {
    const baseSteps = [
      {
        title: 'Document Symptoms',
        description: 'Take photos/videos of visible symptoms and note behavioral changes',
        timeframe: 'Immediately'
      },
      {
        title: 'Contact Veterinarian',
        description: urgency.level === 'high' ? 'Call emergency vet immediately' : 'Schedule appointment',
        timeframe: urgency.level === 'high' ? 'Now' : 'Within 24-48 hours'
      },
      {
        title: 'Monitor Progress',
        description: 'Track symptom changes and your pet\'s response to any treatment',
        timeframe: 'Ongoing'
      }
    ];

    return baseSteps;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

// Initialize the Advanced Pet Health AI system
document.addEventListener('DOMContentLoaded', () => {
  window.petHealthAI = new AdvancedPetHealthAI();
});