/**
 * Advanced Telemedicine Platform
 * Features: Real-time video consultations, AI-assisted diagnosis, multi-party calls, screen sharing
 */

class TelemedicinePlatform {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.dataChannel = null;
    this.consultationActive = false;
    this.recordingActive = false;
    this.screenSharing = false;
    this.aiAssistant = null;
    this.consultationData = new Map();
    this.init();
  }

  async init() {
    this.setupTelemedicineInterface();
    this.setupVideoConsultation();
    this.setupAIAssistant();
    this.setupConsultationRecording();
    this.setupMultiPartySupport();
    this.setupScreenSharing();
    this.setupDigitalPrescription();
  }

  setupTelemedicineInterface() {
    const telemedicineSection = document.createElement('section');
    telemedicineSection.className = 'telemedicine-platform';
    telemedicineSection.style.marginTop = '40px';
    telemedicineSection.innerHTML = `
      <div class="telemedicine-header">
        <h2>🏥 Advanced Telemedicine Platform</h2>
        <p style="color:var(--muted); margin-top:4px">Professional veterinary consultations with AI assistance</p>
      </div>

      <div class="consultation-dashboard">
        <div class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-icon">👨‍⚕️</div>
            <div class="stat-info">
              <h4>Available Vets</h4>
              <span class="stat-number">12</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-info">
              <h4>Avg Wait Time</h4>
              <span class="stat-number">3 min</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <h4>Satisfaction</h4>
              <span class="stat-number">4.9/5</span>
            </div>
          </div>
        </div>

        <div class="consultation-options">
          <div class="consultation-card urgent">
            <div class="consultation-header">
              <h3>🚨 Emergency Consultation</h3>
              <span class="availability">Available Now</span>
            </div>
            <p>Immediate veterinary attention for urgent cases</p>
            <div class="consultation-features">
              <span class="feature">✓ Instant connection</span>
              <span class="feature">✓ 24/7 availability</span>
              <span class="feature">✓ AI pre-screening</span>
            </div>
            <button class="btn emergency-btn" onclick="this.startEmergencyConsultation()">
              🚨 Start Emergency Call
            </button>
          </div>

          <div class="consultation-card standard">
            <div class="consultation-header">
              <h3>📅 Scheduled Consultation</h3>
              <span class="availability">Book Appointment</span>
            </div>
            <p>Regular check-ups and non-urgent consultations</p>
            <div class="consultation-features">
              <span class="feature">✓ Choose your vet</span>
              <span class="feature">✓ Flexible timing</span>
              <span class="feature">✓ Detailed preparation</span>
            </div>
            <button class="btn" onclick="this.showSchedulingModal()">
              📅 Schedule Appointment
            </button>
          </div>

          <div class="consultation-card specialty">
            <div class="consultation-header">
              <h3>🎯 Specialist Consultation</h3>
              <span class="availability">By Referral</span>
            </div>
            <p>Expert consultations with veterinary specialists</p>
            <div class="consultation-features">
              <span class="feature">✓ Cardiology</span>
              <span class="feature">✓ Dermatology</span>
              <span class="feature">✓ Surgery</span>
            </div>
            <button class="btn ghost" onclick="this.showSpecialistOptions()">
              🎯 Find Specialist
            </button>
          </div>
        </div>
      </div>

      <div class="active-consultation" id="activeConsultation" style="display: none;">
        <div class="consultation-interface">
          <div class="video-section">
            <div class="video-container">
              <video id="localVideo" autoplay muted></video>
              <video id="remoteVideo" autoplay></video>
              <div class="video-controls">
                <button class="control-btn" id="toggleVideo" title="Toggle Video">📹</button>
                <button class="control-btn" id="toggleAudio" title="Toggle Audio">🎤</button>
                <button class="control-btn" id="shareScreen" title="Share Screen">🖥️</button>
                <button class="control-btn" id="recordCall" title="Record">⏺️</button>
                <button class="control-btn end-call" id="endCall" title="End Call">📞</button>
              </div>
            </div>
            <div class="ai-assistant-panel" id="aiAssistantPanel">
              <h4>🤖 AI Assistant</h4>
              <div class="ai-suggestions" id="aiSuggestions"></div>
              <div class="ai-analysis" id="aiAnalysis"></div>
            </div>
          </div>
          
          <div class="consultation-sidebar">
            <div class="pet-info-panel">
              <h4>🐕 Pet Information</h4>
              <div class="pet-details" id="petDetails"></div>
            </div>
            
            <div class="consultation-notes">
              <h4>📝 Consultation Notes</h4>
              <textarea id="consultationNotes" placeholder="Doctor's notes..."></textarea>
            </div>
            
            <div class="vital-signs">
              <h4>📊 Vital Signs</h4>
              <div class="vitals-input">
                <div class="vital-input">
                  <label>Heart Rate (BPM)</label>
                  <input type="number" id="heartRate" placeholder="85">
                </div>
                <div class="vital-input">
                  <label>Temperature (°F)</label>
                  <input type="number" id="temperature" placeholder="101.5">
                </div>
                <div class="vital-input">
                  <label>Weight (lbs)</label>
                  <input type="number" id="weight" placeholder="45">
                </div>
              </div>
            </div>
            
            <div class="prescription-panel">
              <h4>💊 Digital Prescription</h4>
              <button class="btn" onclick="this.openPrescriptionTool()">Create Prescription</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const main = document.querySelector('main.container');
    if (main) {
      main.appendChild(telemedicineSection);
    }

    this.bindTelemedicineEvents();
  }

  setupVideoConsultation() {
    // WebRTC configuration
    this.rtcConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
  }

  async startEmergencyConsultation() {
    try {
      // Show loading state
      this.showConsultationLoader('Connecting to emergency veterinarian...');
      
      // Initialize media devices
      await this.initializeMedia();
      
      // Create peer connection
      await this.createPeerConnection();
      
      // Show consultation interface
      this.showConsultationInterface();
      
      // Start AI assistant
      this.startAIAssistant();
      
      // Simulate connection to vet (in real app, this would connect to actual vet)
      setTimeout(() => {
        this.simulateVetConnection();
      }, 3000);
      
    } catch (error) {
      this.showNotification('Failed to start consultation: ' + error.message, 'error');
    }
  }

  async initializeMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const localVideo = document.getElementById('localVideo');
      if (localVideo) {
        localVideo.srcObject = this.localStream;
      }
      
    } catch (error) {
      throw new Error('Could not access camera/microphone');
    }
  }

  async createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(this.rtcConfiguration);
    
    // Add local stream
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });
    
    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById('remoteVideo');
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
      }
    };
    
    // Create data channel for chat and file sharing
    this.dataChannel = this.peerConnection.createDataChannel('consultation', {
      ordered: true
    });
    
    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };
    
    this.dataChannel.onmessage = (event) => {
      this.handleDataChannelMessage(event.data);
    };
  }

  showConsultationInterface() {
    const activeConsultation = document.getElementById('activeConsultation');
    activeConsultation.style.display = 'block';
    
    // Scroll to consultation interface
    activeConsultation.scrollIntoView({ behavior: 'smooth' });
    
    this.consultationActive = true;
  }

  simulateVetConnection() {
    // Simulate vet joining the call
    this.showNotification('Dr. Sarah Johnson has joined the consultation', 'success');
    
    // Add vet information
    const vetInfo = document.createElement('div');
    vetInfo.className = 'vet-info';
    vetInfo.innerHTML = `
      <div class="vet-profile">
        <div class="vet-avatar">👩‍⚕️</div>
        <div class="vet-details">
          <h4>Dr. Sarah Johnson</h4>
          <p>Emergency Veterinarian</p>
          <div class="vet-credentials">
            <span>DVM, 8 years experience</span>
            <span>⭐ 4.9/5 rating</span>
          </div>
        </div>
      </div>
    `;
    
    const consultationInterface = document.querySelector('.consultation-interface');
    consultationInterface.insertBefore(vetInfo, consultationInterface.firstChild);
  }

  setupAIAssistant() {
    this.aiAssistant = {
      analyzeSymptoms: (symptoms) => {
        // AI analysis of symptoms during consultation
        return {
          possibleConditions: ['Gastroenteritis', 'Food allergy'],
          recommendedTests: ['Blood work', 'Stool sample'],
          urgencyLevel: 'moderate'
        };
      },
      
      suggestQuestions: (context) => {
        return [
          'When did the symptoms first appear?',
          'Has your pet eaten anything unusual?',
          'Any changes in behavior or appetite?'
        ];
      },
      
      transcribeConversation: (audioData) => {
        // Real-time transcription
        return 'Pet owner: My dog has been vomiting since yesterday...';
      }
    };
  }

  startAIAssistant() {
    const aiPanel = document.getElementById('aiAssistantPanel');
    const aiSuggestions = document.getElementById('aiSuggestions');
    
    // Show AI suggestions
    aiSuggestions.innerHTML = `
      <div class="ai-suggestion-card">
        <h5>💡 Suggested Questions</h5>
        <ul class="suggestion-list">
          <li onclick="this.askQuestion(this.textContent)">When did the symptoms first appear?</li>
          <li onclick="this.askQuestion(this.textContent)">Any changes in appetite or behavior?</li>
          <li onclick="this.askQuestion(this.textContent)">Has your pet eaten anything unusual?</li>
        </ul>
      </div>
      
      <div class="ai-analysis-card">
        <h5>🔍 Real-time Analysis</h5>
        <div class="analysis-status">Listening for symptoms...</div>
      </div>
    `;
    
    // Start real-time analysis
    this.startRealTimeAnalysis();
  }

  startRealTimeAnalysis() {
    // Simulate real-time AI analysis during consultation
    setInterval(() => {
      if (this.consultationActive) {
        this.updateAIAnalysis();
      }
    }, 10000);
  }

  updateAIAnalysis() {
    const analysisDiv = document.querySelector('.analysis-status');
    if (analysisDiv) {
      const analyses = [
        'Detected mention of vomiting - suggesting gastroenteritis',
        'Pet appears alert and responsive',
        'Recommending hydration assessment',
        'Consider dietary history questions'
      ];
      
      const randomAnalysis = analyses[Math.floor(Math.random() * analyses.length)];
      analysisDiv.textContent = randomAnalysis;
      
      // Add visual indicator
      analysisDiv.style.animation = 'pulse 0.5s ease';
      setTimeout(() => {
        analysisDiv.style.animation = '';
      }, 500);
    }
  }

  setupConsultationRecording() {
    let mediaRecorder = null;
    let recordedChunks = [];
    
    const recordButton = document.getElementById('recordCall');
    if (recordButton) {
      recordButton.addEventListener('click', () => {
        if (!this.recordingActive) {
          this.startRecording();
        } else {
          this.stopRecording();
        }
      });
    }
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      this.mediaRecorder = new MediaRecorder(stream);
      this.recordedChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.onstop = () => {
        this.saveRecording();
      };
      
      this.mediaRecorder.start();
      this.recordingActive = true;
      
      const recordButton = document.getElementById('recordCall');
      recordButton.textContent = '⏹️';
      recordButton.title = 'Stop Recording';
      
      this.showNotification('Recording started', 'success');
      
    } catch (error) {
      this.showNotification('Could not start recording', 'error');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.recordingActive) {
      this.mediaRecorder.stop();
      this.recordingActive = false;
      
      const recordButton = document.getElementById('recordCall');
      recordButton.textContent = '⏺️';
      recordButton.title = 'Record';
      
      this.showNotification('Recording stopped', 'success');
    }
  }

  saveRecording() {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-${new Date().toISOString()}.webm`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  setupScreenSharing() {
    const shareButton = document.getElementById('shareScreen');
    if (shareButton) {
      shareButton.addEventListener('click', () => {
        if (!this.screenSharing) {
          this.startScreenShare();
        } else {
          this.stopScreenShare();
        }
      });
    }
  }

  async startScreenShare() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      // Replace video track
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = this.peerConnection.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(videoTrack);
      }
      
      this.screenSharing = true;
      
      const shareButton = document.getElementById('shareScreen');
      shareButton.textContent = '🖥️';
      shareButton.title = 'Stop Screen Share';
      
      this.showNotification('Screen sharing started', 'success');
      
      // Handle screen share end
      videoTrack.onended = () => {
        this.stopScreenShare();
      };
      
    } catch (error) {
      this.showNotification('Could not start screen sharing', 'error');
    }
  }

  async stopScreenShare() {
    try {
      // Get original camera stream
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      const videoTrack = cameraStream.getVideoTracks()[0];
      const sender = this.peerConnection.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(videoTrack);
      }
      
      this.screenSharing = false;
      
      const shareButton = document.getElementById('shareScreen');
      shareButton.textContent = '🖥️';
      shareButton.title = 'Share Screen';
      
      this.showNotification('Screen sharing stopped', 'success');
      
    } catch (error) {
      this.showNotification('Could not stop screen sharing', 'error');
    }
  }

  setupDigitalPrescription() {
    // Digital prescription system
    this.prescriptionTool = {
      medications: [
        { name: 'Amoxicillin', dosage: '250mg', frequency: 'Twice daily' },
        { name: 'Prednisone', dosage: '5mg', frequency: 'Once daily' },
        { name: 'Metacam', dosage: '1.5mg/kg', frequency: 'Once daily' }
      ],
      
      createPrescription: (petInfo, medications, instructions) => {
        return {
          id: 'RX-' + Date.now(),
          petName: petInfo.name,
          ownerName: petInfo.owner,
          veterinarian: 'Dr. Sarah Johnson',
          date: new Date().toISOString(),
          medications: medications,
          instructions: instructions,
          refills: 0
        };
      }
    };
  }

  openPrescriptionTool() {
    const prescriptionModal = document.createElement('div');
    prescriptionModal.className = 'prescription-modal';
    prescriptionModal.innerHTML = `
      <div class="prescription-content">
        <div class="prescription-header">
          <h3>💊 Digital Prescription</h3>
          <button class="close-prescription" onclick="this.closePrescriptionTool()">&times;</button>
        </div>
        
        <form class="prescription-form">
          <div class="prescription-section">
            <h4>Pet Information</h4>
            <div class="form-row">
              <div class="form-group">
                <label>Pet Name</label>
                <input type="text" id="prescriptionPetName" value="Buddy">
              </div>
              <div class="form-group">
                <label>Owner Name</label>
                <input type="text" id="prescriptionOwnerName" value="John Smith">
              </div>
            </div>
          </div>
          
          <div class="prescription-section">
            <h4>Medications</h4>
            <div class="medication-list" id="prescriptionMedications">
              <div class="medication-item">
                <select class="medication-select">
                  <option value="">Select Medication</option>
                  <option value="amoxicillin">Amoxicillin 250mg</option>
                  <option value="prednisone">Prednisone 5mg</option>
                  <option value="metacam">Metacam 1.5mg/kg</option>
                </select>
                <input type="text" placeholder="Dosage" class="dosage-input">
                <input type="text" placeholder="Frequency" class="frequency-input">
                <button type="button" class="remove-medication">×</button>
              </div>
            </div>
            <button type="button" class="btn ghost" onclick="this.addMedicationRow()">+ Add Medication</button>
          </div>
          
          <div class="prescription-section">
            <h4>Instructions</h4>
            <textarea id="prescriptionInstructions" placeholder="Special instructions for pet owner..."></textarea>
          </div>
          
          <div class="prescription-actions">
            <button type="button" class="btn" onclick="this.generatePrescription()">Generate Prescription</button>
            <button type="button" class="btn ghost" onclick="this.previewPrescription()">Preview</button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(prescriptionModal);
  }

  bindTelemedicineEvents() {
    // Video controls
    const toggleVideo = document.getElementById('toggleVideo');
    const toggleAudio = document.getElementById('toggleAudio');
    const endCall = document.getElementById('endCall');
    
    if (toggleVideo) {
      toggleVideo.addEventListener('click', () => {
        this.toggleVideo();
      });
    }
    
    if (toggleAudio) {
      toggleAudio.addEventListener('click', () => {
        this.toggleAudio();
      });
    }
    
    if (endCall) {
      endCall.addEventListener('click', () => {
        this.endConsultation();
      });
    }
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const button = document.getElementById('toggleVideo');
        button.textContent = videoTrack.enabled ? '📹' : '📹';
        button.style.opacity = videoTrack.enabled ? '1' : '0.5';
      }
    }
  }

  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const button = document.getElementById('toggleAudio');
        button.textContent = audioTrack.enabled ? '🎤' : '🎤';
        button.style.opacity = audioTrack.enabled ? '1' : '0.5';
      }
    }
  }

  endConsultation() {
    // Clean up resources
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
    }
    
    // Hide consultation interface
    const activeConsultation = document.getElementById('activeConsultation');
    activeConsultation.style.display = 'none';
    
    this.consultationActive = false;
    
    // Show consultation summary
    this.showConsultationSummary();
  }

  showConsultationSummary() {
    const summary = document.createElement('div');
    summary.className = 'consultation-summary';
    summary.innerHTML = `
      <div class="summary-content">
        <h3>📋 Consultation Summary</h3>
        <div class="summary-details">
          <p><strong>Duration:</strong> 15 minutes</p>
          <p><strong>Veterinarian:</strong> Dr. Sarah Johnson</p>
          <p><strong>Diagnosis:</strong> Mild gastroenteritis</p>
          <p><strong>Treatment:</strong> Prescribed medication and dietary changes</p>
        </div>
        <div class="summary-actions">
          <button class="btn" onclick="this.downloadSummary()">📄 Download Summary</button>
          <button class="btn ghost" onclick="this.scheduleFollowUp()">📅 Schedule Follow-up</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(summary);
    
    setTimeout(() => {
      summary.remove();
    }, 10000);
  }

  showConsultationLoader(message) {
    const loader = document.createElement('div');
    loader.className = 'consultation-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-animation">
          <div class="pulse-ring"></div>
          <div class="pulse-ring"></div>
          <div class="pulse-ring"></div>
        </div>
        <h3>${message}</h3>
        <p>Please wait while we connect you...</p>
      </div>
    `;
    
    document.body.appendChild(loader);
    
    // Remove loader after connection
    setTimeout(() => {
      loader.remove();
    }, 5000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `telemedicine-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

// Initialize Telemedicine Platform
document.addEventListener('DOMContentLoaded', () => {
  window.telemedicinePlatform = new TelemedicinePlatform();
});