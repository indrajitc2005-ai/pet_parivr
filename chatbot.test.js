/**
 * @jest-environment jsdom
 */

// Mock PetCareKnowledgeBase
class MockPetCareKnowledgeBase {
  constructor() {
    this.localKnowledge = {
      'vaccination': {
        category: 'health',
        response: 'Pets need core vaccines: rabies, distemper, parvovirus, and adenovirus.',
        urgency: 'high'
      }
    };
  }

  async searchKnowledge(query) {
    if (query.includes('vaccination')) {
      return this.localKnowledge['vaccination'];
    }
    return null;
  }
}

global.PetCareKnowledgeBase = MockPetCareKnowledgeBase;

describe('Chatbot Module', () => {
  let mockBot, mockToggle, mockCloseBot, mockMsgs, mockInput, mockSend;
  let chatHistory = [];

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <div id="bot" style="display: none;">
        <div id="msgs"></div>
        <input id="botInput" type="text" placeholder="Ask me anything...">
        <button id="botSend">Send</button>
        <button id="closeBot">×</button>
        <button id="voiceBtn">🎤</button>
        <button id="historyBtn">📜</button>
      </div>
      <button id="botToggle">💬</button>
      <div class="ai-status">Loading...</div>
    `;

    mockBot = document.getElementById('bot');
    mockToggle = document.getElementById('botToggle');
    mockCloseBot = document.getElementById('closeBot');
    mockMsgs = document.getElementById('msgs');
    mockInput = document.getElementById('botInput');
    mockSend = document.getElementById('botSend');

    // Mock localStorage for chat history
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'furryAIHistory') {
        return JSON.stringify(chatHistory);
      }
      return null;
    });

    localStorage.setItem.mockImplementation((key, value) => {
      if (key === 'furryAIHistory') {
        chatHistory = JSON.parse(value);
      }
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    chatHistory = [];
  });

  describe('Chatbot Initialization', () => {
    test('should initialize chatbot elements correctly', () => {
      const initializeChatbot = () => {
        const bot = document.getElementById('bot');
        const toggle = document.getElementById('botToggle');
        const msgs = document.getElementById('msgs');
        const input = document.getElementById('botInput');
        const send = document.getElementById('botSend');
        
        if (!bot || !toggle || !msgs || !input || !send) {
          console.error('Critical chatbot elements missing!');
          return false;
        }
        
        return true;
      };

      const result = initializeChatbot();
      expect(result).toBe(true);
      expect(console.error).not.toHaveBeenCalled();
    });

    test('should return false when critical elements are missing', () => {
      // Remove critical element
      document.getElementById('bot').remove();

      const initializeChatbot = () => {
        const bot = document.getElementById('bot');
        const toggle = document.getElementById('botToggle');
        const msgs = document.getElementById('msgs');
        const input = document.getElementById('botInput');
        const send = document.getElementById('botSend');
        
        if (!bot || !toggle || !msgs || !input || !send) {
          console.error('Critical chatbot elements missing!');
          return false;
        }
        
        return true;
      };

      const result = initializeChatbot();
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Critical chatbot elements missing!');
    });
  });

  describe('Message Handling', () => {
    test('should handle user messages and provide appropriate responses', async () => {
      const aiResponses = {
        greetings: ["Hello! How can I help your furry friend today?"],
        pharmacy: ["We have a wide range of pet medications."],
        default: ["I'm here to help with pet care questions!"]
      };

      const getAIResponse = (q) => {
        q = q.toLowerCase();
        
        if (q.includes('hello') || q.includes('hi')) {
          return aiResponses.greetings[0];
        }
        
        if (q.includes('pharmacy')) {
          return aiResponses.pharmacy[0];
        }
        
        return aiResponses.default[0];
      };

      const postUser = (html) => {
        const m = document.createElement('div');
        m.className = 'msg user';
        m.innerHTML = html;
        mockMsgs.appendChild(m);
        
        chatHistory.push({type: 'user', content: html, timestamp: new Date()});
      };

      const postBot = (html) => {
        const m = document.createElement('div');
        m.className = 'msg bot';
        m.innerHTML = html;
        mockMsgs.appendChild(m);
        
        chatHistory.push({type: 'bot', content: html, timestamp: new Date()});
      };

      // Test greeting response
      const userMessage = "Hello";
      postUser(userMessage);
      const botResponse = getAIResponse(userMessage);
      postBot(botResponse);

      expect(mockMsgs.children).toHaveLength(2);
      expect(mockMsgs.children[0].className).toBe('msg user');
      expect(mockMsgs.children[0].innerHTML).toBe('Hello');
      expect(mockMsgs.children[1].className).toBe('msg bot');
      expect(mockMsgs.children[1].innerHTML).toBe('Hello! How can I help your furry friend today?');
    });

    test('should integrate with Pet Care Knowledge Base for intelligent responses', async () => {
      const petCareKB = new MockPetCareKnowledgeBase();
      
      const reply = async (q) => {
        if (petCareKB) {
          const knowledge = await petCareKB.searchKnowledge(q);
          if (knowledge) {
            let response = knowledge.response;
            
            if (knowledge.urgency === 'critical') {
              response = '🚨 URGENT: ' + response;
            } else if (knowledge.urgency === 'high') {
              response = '⚠️ IMPORTANT: ' + response;
            }
            
            return response;
          }
        }
        
        return "I'm here to help with pet care questions!";
      };

      const response = await reply('vaccination');
      expect(response).toBe('⚠️ IMPORTANT: Pets need core vaccines: rabies, distemper, parvovirus, and adenovirus.');
    });
  });

  describe('Chat History Management', () => {
    test('should save and load chat history from localStorage', () => {
      const saveHistory = () => {
        localStorage.setItem('furryAIHistory', JSON.stringify(chatHistory));
      };

      const loadHistory = () => {
        const storedHistory = localStorage.getItem('furryAIHistory');
        return storedHistory ? JSON.parse(storedHistory) : [];
      };

      // Add some messages to history
      chatHistory.push(
        {type: 'user', content: 'Hello', timestamp: new Date()},
        {type: 'bot', content: 'Hi there!', timestamp: new Date()}
      );

      saveHistory();
      expect(localStorage.setItem).toHaveBeenCalledWith('furryAIHistory', JSON.stringify(chatHistory));

      const loadedHistory = loadHistory();
      expect(loadedHistory).toHaveLength(2);
      expect(loadedHistory[0].type).toBe('user');
      expect(loadedHistory[0].content).toBe('Hello');
      expect(loadedHistory[1].type).toBe('bot');
      expect(loadedHistory[1].content).toBe('Hi there!');
    });

    test('should handle localStorage errors gracefully', () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const loadHistory = () => {
        try {
          const storedHistory = localStorage.getItem('furryAIHistory');
          return storedHistory ? JSON.parse(storedHistory) : [];
        } catch (e) {
          console.error('Error reading chat history from localStorage:', e);
          return [];
        }
      };

      const result = loadHistory();
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error reading chat history from localStorage:',
        expect.any(Error)
      );
    });
  });

  describe('Bot UI Interactions', () => {
    test('should open bot when toggle button is clicked', () => {
      const openBot = () => {
        mockBot.style.display = 'flex';
        mockInput && mockInput.focus();
      };

      mockToggle.addEventListener('click', openBot);
      mockToggle.click();

      expect(mockBot.style.display).toBe('flex');
    });

    test('should close bot when close button is clicked', () => {
      const closeBot = () => {
        mockBot.style.display = 'none';
      };

      mockCloseBot.addEventListener('click', closeBot);
      mockCloseBot.click();

      expect(mockBot.style.display).toBe('none');
    });

    test('should show typing indicator during response generation', () => {
      const showTyping = () => {
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        `;
        mockMsgs.appendChild(typing);
      };

      const hideTyping = () => {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
      };

      showTyping();
      expect(document.getElementById('typingIndicator')).toBeTruthy();
      expect(document.getElementById('typingIndicator').className).toBe('typing-indicator');

      hideTyping();
      expect(document.getElementById('typingIndicator')).toBeFalsy();
    });
  });

  describe('Voice Recognition', () => {
    test('should handle voice input when supported', () => {
      const mockRecognition = new global.SpeechRecognition();
      let isListening = false;

      const startVoiceRecognition = () => {
        isListening = true;
        mockRecognition.start();
      };

      const stopVoiceRecognition = () => {
        isListening = false;
        mockRecognition.stop();
      };

      startVoiceRecognition();
      expect(isListening).toBe(true);
      expect(mockRecognition.start).toHaveBeenCalled();

      stopVoiceRecognition();
      expect(isListening).toBe(false);
      expect(mockRecognition.stop).toHaveBeenCalled();
    });
  });
});