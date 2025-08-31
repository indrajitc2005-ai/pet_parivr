// Chatbot elements - add null checks for safety
let bot, toggle, closeBot, msgs, input, send, voiceBtn, historyBtn;

function initializeChatbot() {
  bot = document.getElementById('bot');
  toggle = document.getElementById('botToggle');
  closeBot = document.getElementById('closeBot');
  msgs = document.getElementById('msgs');
  input = document.getElementById('botInput');
  send = document.getElementById('botSend');
  voiceBtn = document.getElementById('voiceBtn');
  historyBtn = document.getElementById('historyBtn');
  
  console.log('Chatbot elements initialized:', {
    bot: !!bot,
    toggle: !!toggle,
    closeBot: !!closeBot,
    msgs: !!msgs,
    input: !!input,
    send: !!send,
    voiceBtn: !!voiceBtn,
    historyBtn: !!historyBtn
  });
  
  // If any critical elements are missing, log error
  if (!bot || !toggle || !msgs || !input || !send) {
    console.error('Critical chatbot elements missing!');
    return false;
  }
  
  return true;
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    if (initializeChatbot()) {
      // Initialize Pet Care Knowledge Base with status updates
      try {
        // Update loading status
        const aiStatusElements = document.querySelectorAll('.ai-status');
        aiStatusElements.forEach(el => {
          el.textContent = 'Loading Pet Care Knowledge Base...';
          el.style.color = 'var(--accent)';
        });
        
        petCareKB = new PetCareKnowledgeBase();
        console.log('Pet Care Knowledge Base loaded successfully');
        
        // Update to success status
        aiStatusElements.forEach(el => {
          el.textContent = '✓ AI Knowledge Base Ready';
          el.style.color = 'var(--success)';
        });
        
        // Brief delay to show success message
        setTimeout(() => {
          aiStatusElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.5s ease';
          });
        }, 1000);
        
      } catch (e) {
        console.error('Failed to initialize knowledge base:', e);
        // Update to error status
        const aiStatusElements = document.querySelectorAll('.ai-status');
        aiStatusElements.forEach(el => {
          el.textContent = '⚠️ AI Initialization Failed - Using Basic Mode';
          el.style.color = 'var(--error)';
        });
      }
      setupEventListeners();
    }
  });
} else {
  if (initializeChatbot()) {
    // Initialize Pet Care Knowledge Base with status updates
    try {
      // Update loading status
      const aiStatusElements = document.querySelectorAll('.ai-status');
      aiStatusElements.forEach(el => {
        el.textContent = 'Loading Pet Care Knowledge Base...';
        el.style.color = 'var(--accent)';
      });
      
      petCareKB = new PetCareKnowledgeBase();
      console.log('Pet Care Knowledge Base loaded successfully');
      
      // Update to success status
      aiStatusElements.forEach(el => {
        el.textContent = '✓ AI Knowledge Base Ready';
        el.style.color = 'var(--success)';
      });
      
      // Brief delay to show success message
      setTimeout(() => {
        aiStatusElements.forEach(el => {
          el.style.opacity = '0';
          el.style.transition = 'opacity 0.5s ease';
        });
      }, 1000);
      
    } catch (e) {
      console.error('Failed to initialize knowledge base:', e);
      // Update to error status
      const aiStatusElements = document.querySelectorAll('.ai-status');
      aiStatusElements.forEach(el => {
        el.textContent = '⚠️ AI Initialization Failed - Using Basic Mode';
        el.style.color = 'var(--error)';
      });
    }
    setupEventListeners();
  }
}

// Chat history with error handling
let chatHistory = [];
try {
  const storedHistory = localStorage.getItem('furryAIHistory');
  if (storedHistory) {
    chatHistory = JSON.parse(storedHistory);
  }
} catch (e) {
  console.error('Error reading chat history from localStorage:', e);
  chatHistory = [];
}

// AI Knowledge Base
let petCareKB = null;

// Enhanced AI responses with knowledge base integration
const aiResponses = {
  greetings: ["Hello! How can I help your furry friend today?", "Hi there! What can I do for you and your pet?", "Greetings! I'm here to assist with all your pet care needs!"],
  pharmacy: ["We have a wide range of pet medications. Would you like to see our bestsellers?", "Our pharmacy offers both prescription and over-the-counter pet medications.", "All our medications are vet-approved for your pet's safety."],
  grooming: ["Regular grooming keeps your pet healthy and happy! Our services include baths, haircuts, and nail trimming.", "Grooming not only keeps your pet looking great but also helps detect skin issues early.", "We have special grooming packages for different breeds and coat types."],
  toys: ["Toys are essential for your pet's mental and physical health!", "We have interactive toys that can keep your pet entertained when you're away.", "Our toy collection includes options for all sizes and types of pets."],
  consult: ["Our vets are available for video consultations from 9 AM to 8 PM.", "You can book a consultation without sharing your personal contact information.", "Our consultation service covers health checkups, behavior advice, and nutrition guidance."],
  hours: ["We're open from 9:00 AM to 8:00 PM, Monday through Saturday.", "On Sundays, we're open from 10:00 AM to 4:00 PM.", "Our online services are available 24/7!"],
  default: ["I'm here to help with pet care questions! You can ask about pharmacy, grooming, toys, or consultations.", "For the best assistance, try asking about specific services like 'pharmacy' or 'grooming'.", "I can help you find the right products and services for your pet!"]
};

function saveHistory() {
  try {
    localStorage.setItem('furryAIHistory', JSON.stringify(chatHistory));
  } catch (e) {
    console.error('Error saving chat history to localStorage:', e);
  }
}

function postUser(html){
  const m = document.createElement('div');
  m.className = 'msg user';
  m.innerHTML = html;
  msgs.appendChild(m);
  msgs.scrollTop = msgs.scrollHeight;
  
  // Add to history
  chatHistory.push({type: 'user', content: html, timestamp: new Date()});
  saveHistory();
}

function postBot(html){
  const m = document.createElement('div');
  m.className = 'msg bot';
  m.innerHTML = html;
  msgs.appendChild(m);
  msgs.scrollTop = msgs.scrollHeight;
  
  // Add to history
  chatHistory.push({type: 'bot', content: html, timestamp: new Date()});
  saveHistory();
}

// Typing indicator
function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

function setupEventListeners() {
  function openBot(){
    bot.style.display = 'flex';
    input && input.focus();
    
    // Load chat history if available
    if (!bot.dataset.boot) {
      // Clear any existing messages first
      if (msgs) {
        msgs.innerHTML = '';
      }
      
      if (chatHistory.length > 0) {
        // Show last few messages from history
        const recentMessages = chatHistory.slice(-5);
        recentMessages.forEach(msg => {
          const m = document.createElement('div');
          m.className = `msg ${msg.type}`;
          m.innerHTML = msg.content;
          if (msgs) msgs.appendChild(m);
        });
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
        
        postBot("Welcome back! 👋<br/>I see you've chatted with me before. How can I help you today?");
      } else {
        postBot("Hi! I'm <b>Furry AI</b> 🐾<br/>Ask me about <i>pharmacy</i>, <i>grooming</i>, <i>toys</i>, <i>consult</i> or <i>hours</i>.");
      }
      bot.dataset.boot = 1;
    }
  }

  toggle && toggle.addEventListener('click', openBot);
  closeBot && closeBot.addEventListener('click', ()=> bot.style.display='none');

  function go(href){ window.location.href = href; }
  const intents = [
  {k:/hours|time|open/i, a:()=> 'We’re open <b>9:00–20:00</b>, Mon–Sat. Sunday: <b>10:00–16:00</b>.'},
  {k:/pharmacy|med|medicine|rx/i, a:()=> { go('pharmacy.html'); return 'Opening <b>Pharmacy</b>…'; }},
  {k:/groom|spa|trim|bath|accessor/i, a:()=> { go('grooming.html'); return 'Let’s browse <b>Grooming & Accessories</b>…'; }},
  {k:/toy|play|ball/i, a:()=> { go('toys.html'); return 'Zooming to <b>Toys</b>…'; }},
  {k:/consult|doctor|video|appointment/i, a:()=> { go('consult.html'); return 'Booking a <b>Consult</b> page…'; }},
  {k:/about|team|clinic/i, a:()=> { go('about.html'); return 'Loading <b>About Us</b>…'; }},
  {k:/login|sign.?in/i, a:()=> { go('login.html'); return 'Taking you to <b>Login</b>…'; }},
  {k:/signup|register|sign.?up/i, a:()=> { go('signup.html'); return 'Creating a new account…'; }},
  {k:/.*/, a:(q)=> `I didn’t fully get “${q}”. Try keywords like <i>pharmacy</i>, <i>grooming</i>, <i>toys</i>, <i>consult</i>, <i>hours</i>, <i>login</i>.`},
];

function getAIResponse(q) {
  q = q.toLowerCase();
  
  // Check for specific keywords and return relevant responses
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)];
  }
  
  if (q.includes('pharmacy') || q.includes('medicine') || q.includes('meds')) {
    return aiResponses.pharmacy[Math.floor(Math.random() * aiResponses.pharmacy.length)];
  }
  
  if (q.includes('groom') || q.includes('bath') || q.includes('hair')) {
    return aiResponses.grooming[Math.floor(Math.random() * aiResponses.grooming.length)];
  }
  
  if (q.includes('toy') || q.includes('play') || q.includes('game')) {
    return aiResponses.toys[Math.floor(Math.random() * aiResponses.toys.length)];
  }
  
  if (q.includes('consult') || q.includes('doctor') || q.includes('vet')) {
    return aiResponses.consult[Math.floor(Math.random() * aiResponses.consult.length)];
  }
  
  if (q.includes('hour') || q.includes('time') || q.includes('open')) {
    return aiResponses.hours[Math.floor(Math.random() * aiResponses.hours.length)];
  }
  
  // Default response if no keywords match
  return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
}

async function reply(q){
  const hit = intents.find(x=> x.k.test(q));
  if (hit) return hit.a(q);
  
  // Try knowledge base first for intelligent responses
  if (petCareKB) {
    try {
      const knowledge = await petCareKB.searchKnowledge(q);
      if (knowledge) {
        let response = knowledge.response;
        
        // Add urgency indicator for critical issues
        if (knowledge.urgency === 'critical') {
          response = '🚨 URGENT: ' + response;
        } else if (knowledge.urgency === 'high') {
          response = '⚠️ IMPORTANT: ' + response;
        }
        
        // Add follow-up suggestion
        if (knowledge.followUp) {
          response += `<br/><br/><small><i>${knowledge.followUp}</i></small>`;
        }
        
        return response;
      }
    } catch (error) {
      console.error('Knowledge base error:', error);
      // Fall back to basic response
    }
  }
  
  // Fallback to basic AI response
  return getAIResponse(q);
}

async function handleSend(){
  const q = input.value.trim();
  if(!q) return;
  postUser(q);
  input.value = '';
  
  // Show typing indicator
  showTyping();
  
  try {
    // Get AI response (with knowledge base integration)
    const response = await reply(q);
    
    // Simulate AI thinking time
    setTimeout(()=> {
      hideTyping();
      postBot(response);
    }, 800 + Math.random() * 800);
  } catch (error) {
    console.error('Error getting AI response:', error);
    hideTyping();
    postBot("I encountered an error. Please try again or ask something else.");
  }
}

send && send.addEventListener('click', handleSend);
input && input.addEventListener('keydown', e=>{ if(e.key==='Enter') handleSend(); });

// Voice input functionality
let isListening = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition && voiceBtn) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  
  recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.add('listening');
    voiceBtn.textContent = '🛑';
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    input.value = transcript;
    voiceBtn.classList.remove('listening');
    voiceBtn.textContent = '🎤';
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    voiceBtn.classList.remove('listening');
    voiceBtn.textContent = '🎤';
    isListening = false;
  };
  
  recognition.onend = () => {
    voiceBtn.classList.remove('listening');
    voiceBtn.textContent = '🎤';
    isListening = false;
  };
  
  voiceBtn.addEventListener('click', () => {
    if (isListening) {
      recognition.stop();
      voiceBtn.classList.remove('listening');
      voiceBtn.textContent = '🎤';
      isListening = false;
    } else {
      recognition.start();
    }
  });
} else if (voiceBtn) {
  // Hide voice button if not supported
  voiceBtn.style.display = 'none';
}

// Chat history functionality
if (historyBtn) {
  historyBtn.addEventListener('click', () => {
    if (chatHistory.length === 0) {
      alert('No chat history found.');
      return;
    }
    
    
    let historyHTML = '<h3>Chat History</h3>';
    chatHistory.forEach(msg => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      historyHTML += `
        <div class="msg ${msg.type}">
          <small>${time}</small>
          ${msg.content}
        </div>
      `;
    });
    
    // Clear current messages and show history
    msgs.innerHTML = historyHTML;
    msgs.scrollTop = msgs.scrollHeight;
  });
}

}

// Auto open once on first visit
setTimeout(()=>{
  try {
    if(!localStorage.getItem('ft_bot_opened')){
      openBot();
      localStorage.setItem('ft_bot_opened','1');
    }
  } catch (e) {
    console.error('Error checking/updating bot open status:', e);
  }
}, 600);
