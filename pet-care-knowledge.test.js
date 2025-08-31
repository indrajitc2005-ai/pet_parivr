/**
 * @jest-environment jsdom
 */

describe('Pet Care Knowledge Base', () => {
  let petCareKB;

  // Mock PetCareKnowledgeBase class
  class PetCareKnowledgeBase {
    constructor() {
      this.cache = new Map();
      this.localKnowledge = this.createLocalKnowledgeBase();
    }

    createLocalKnowledgeBase() {
      return {
        'vaccination': {
          category: 'health',
          response: 'Pets need core vaccines: rabies, distemper, parvovirus, and adenovirus. Puppies/kittens need a series starting at 6-8 weeks, then boosters annually or every 3 years.',
          urgency: 'high',
          followUp: 'When was your pet last vaccinated?'
        },
        'spay neuter': {
          category: 'health',
          response: 'Spaying/neutering prevents unwanted litters and reduces cancer risks. Recommended at 4-6 months for most pets.',
          urgency: 'medium',
          followUp: 'Have you considered scheduling this procedure?'
        },
        'diet food': {
          category: 'nutrition',
          response: 'Pets need balanced diets with proper protein, fats, and nutrients. Age, breed, and health conditions determine specific needs.',
          urgency: 'medium',
          followUp: 'What type of pet and age are we discussing?'
        },
        'emergency': {
          category: 'emergency',
          response: '🚨 If your pet shows: difficulty breathing, seizures, uncontrolled bleeding, or toxin ingestion - GO TO VET IMMEDIATELY!',
          urgency: 'critical',
          followUp: 'Please describe the emergency symptoms'
        },
        'poison': {
          category: 'emergency',
          response: 'If you suspect poisoning, contact your vet or animal poison control immediately. Do NOT induce vomiting unless instructed.',
          urgency: 'critical',
          followUp: 'What substance was ingested and when?'
        }
      };
    }

    async searchKnowledge(query, petType = 'general') {
      const normalizedQuery = query.toLowerCase().trim();
      
      if (this.cache.has(normalizedQuery)) {
        return this.cache.get(normalizedQuery);
      }

      try {
        const response = await this.fetchFromExternalAPI(normalizedQuery, petType);
        if (response) {
          this.cache.set(normalizedQuery, response);
          return response;
        }
      } catch (error) {
        console.warn('External API unavailable, using local knowledge base');
      }

      const localResult = this.searchLocalKnowledge(normalizedQuery, petType);
      if (localResult) {
        this.cache.set(normalizedQuery, localResult);
        return localResult;
      }

      return null;
    }

    searchLocalKnowledge(query, petType) {
      for (const [keyword, knowledge] of Object.entries(this.localKnowledge)) {
        if (query.includes(keyword)) {
          return {
            ...knowledge,
            source: 'local',
            timestamp: new Date().toISOString()
          };
        }
      }
      return null;
    }

    async fetchFromExternalAPI(query, petType) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockResponses = {
        'parvo': {
          category: 'health',
          response: 'Parvovirus is highly contagious and dangerous, especially for puppies. Symptoms include vomiting, diarrhea, lethargy. Requires immediate veterinary care.',
          urgency: 'critical',
          source: 'external',
          timestamp: new Date().toISOString()
        },
        'heartworm': {
          category: 'parasites',
          response: 'Heartworms are transmitted by mosquitoes and can be fatal. Monthly prevention is essential. Testing required before starting prevention.',
          urgency: 'high',
          source: 'external',
          timestamp: new Date().toISOString()
        }
      };

      for (const [pattern, response] of Object.entries(mockResponses)) {
        if (query.includes(pattern)) {
          return response;
        }
      }

      return null;
    }

    getFollowUpQuestions(knowledge) {
      if (!knowledge || !knowledge.followUp) return [];
      
      return [
        knowledge.followUp,
        'Would you like more details about this?',
        'Is there anything else I can help with regarding pet care?'
      ];
    }

    getEmergencyContacts() {
      return {
        vet: '📞 Local Vet: [Your Vet\'s Phone Number]',
        emergency: '🏥 Emergency Clinic: [Emergency Clinic Phone]',
        poison: '☠️ Poison Control: 888-426-4435 (ASPCA)',
        advice: '💡 Always keep these numbers handy in case of emergencies!'
      };
    }
  }

  beforeEach(() => {
    petCareKB = new PetCareKnowledgeBase();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Knowledge Base Initialization', () => {
    test('should initialize with local knowledge base', () => {
      expect(petCareKB.localKnowledge).toBeDefined();
      expect(petCareKB.cache).toBeInstanceOf(Map);
      expect(Object.keys(petCareKB.localKnowledge)).toContain('vaccination');
      expect(Object.keys(petCareKB.localKnowledge)).toContain('emergency');
    });

    test('should create comprehensive local knowledge base', () => {
      const knowledge = petCareKB.localKnowledge;
      
      expect(knowledge['vaccination']).toEqual({
        category: 'health',
        response: 'Pets need core vaccines: rabies, distemper, parvovirus, and adenovirus. Puppies/kittens need a series starting at 6-8 weeks, then boosters annually or every 3 years.',
        urgency: 'high',
        followUp: 'When was your pet last vaccinated?'
      });

      expect(knowledge['emergency']).toEqual({
        category: 'emergency',
        response: '🚨 If your pet shows: difficulty breathing, seizures, uncontrolled bleeding, or toxin ingestion - GO TO VET IMMEDIATELY!',
        urgency: 'critical',
        followUp: 'Please describe the emergency symptoms'
      });
    });
  });

  describe('Local Knowledge Search', () => {
    test('should search local knowledge base for pet care information', () => {
      const result = petCareKB.searchLocalKnowledge('vaccination');
      
      expect(result).toBeDefined();
      expect(result.category).toBe('health');
      expect(result.response).toContain('core vaccines');
      expect(result.urgency).toBe('high');
      expect(result.source).toBe('local');
      expect(result.timestamp).toBeDefined();
    });

    test('should return null for unknown queries', () => {
      const result = petCareKB.searchLocalKnowledge('unknown topic');
      expect(result).toBeNull();
    });

    test('should handle case-insensitive searches', () => {
      const result = petCareKB.searchLocalKnowledge('VACCINATION');
      expect(result).toBeDefined();
      expect(result.category).toBe('health');
    });
  });

  describe('Urgency Level Classification', () => {
    test('should return appropriate urgency levels for different queries', () => {
      const criticalResult = petCareKB.searchLocalKnowledge('emergency');
      expect(criticalResult.urgency).toBe('critical');

      const highResult = petCareKB.searchLocalKnowledge('vaccination');
      expect(highResult.urgency).toBe('high');

      const mediumResult = petCareKB.searchLocalKnowledge('diet food');
      expect(mediumResult.urgency).toBe('medium');
    });

    test('should categorize emergency situations as critical', () => {
      const emergencyResult = petCareKB.searchLocalKnowledge('emergency');
      const poisonResult = petCareKB.searchLocalKnowledge('poison');

      expect(emergencyResult.urgency).toBe('critical');
      expect(poisonResult.urgency).toBe('critical');
      expect(emergencyResult.response).toContain('🚨');
    });
  });

  describe('External API Integration', () => {
    test('should fetch from external API when available', async () => {
      const result = await petCareKB.fetchFromExternalAPI('parvo');
      
      expect(result).toBeDefined();
      expect(result.category).toBe('health');
      expect(result.response).toContain('Parvovirus');
      expect(result.urgency).toBe('critical');
      expect(result.source).toBe('external');
    });

    test('should return null for unknown external queries', async () => {
      const result = await petCareKB.fetchFromExternalAPI('unknown disease');
      expect(result).toBeNull();
    });

    test('should handle API delays', async () => {
      const startTime = Date.now();
      await petCareKB.fetchFromExternalAPI('heartworm');
      
      // Fast-forward timers to simulate API delay
      jest.advanceTimersByTime(300);
      
      expect(setTimeout).toHaveBeenCalled();
    });
  });

  describe('Comprehensive Search', () => {
    test('should use cache for repeated queries', async () => {
      const query = 'vaccination info';
      
      // First search
      const result1 = await petCareKB.searchKnowledge(query);
      expect(result1).toBeDefined();
      
      // Second search should use cache
      const result2 = await petCareKB.searchKnowledge(query);
      expect(result2).toBe(result1); // Same object reference from cache
      expect(petCareKB.cache.has(query.toLowerCase().trim())).toBe(true);
    });

    test('should fallback to local knowledge when external API fails', async () => {
      // Mock external API to throw error
      petCareKB.fetchFromExternalAPI = jest.fn().mockRejectedValue(new Error('API Error'));
      
      const result = await petCareKB.searchKnowledge('vaccination');
      
      expect(result).toBeDefined();
      expect(result.source).toBe('local');
      expect(console.warn).toHaveBeenCalledWith('External API unavailable, using local knowledge base');
    });

    test('should return null when no knowledge is found', async () => {
      const result = await petCareKB.searchKnowledge('completely unknown topic');
      expect(result).toBeNull();
    });
  });

  describe('Follow-up Questions', () => {
    test('should provide follow-up questions for knowledge responses', () => {
      const knowledge = {
        followUp: 'When was your pet last vaccinated?'
      };

      const followUps = petCareKB.getFollowUpQuestions(knowledge);
      
      expect(followUps).toHaveLength(3);
      expect(followUps[0]).toBe('When was your pet last vaccinated?');
      expect(followUps[1]).toBe('Would you like more details about this?');
      expect(followUps[2]).toBe('Is there anything else I can help with regarding pet care?');
    });

    test('should return empty array when no follow-up is available', () => {
      const knowledge = { response: 'Some response' };
      const followUps = petCareKB.getFollowUpQuestions(knowledge);
      expect(followUps).toEqual([]);
    });
  });

  describe('Emergency Contacts', () => {
    test('should provide emergency contact information', () => {
      const contacts = petCareKB.getEmergencyContacts();
      
      expect(contacts).toHaveProperty('vet');
      expect(contacts).toHaveProperty('emergency');
      expect(contacts).toHaveProperty('poison');
      expect(contacts).toHaveProperty('advice');
      
      expect(contacts.poison).toContain('888-426-4435');
      expect(contacts.advice).toContain('Always keep these numbers handy');
    });
  });

  describe('Category Classification', () => {
    test('should classify knowledge into appropriate categories', () => {
      const healthResult = petCareKB.searchLocalKnowledge('vaccination');
      const nutritionResult = petCareKB.searchLocalKnowledge('diet food');
      const emergencyResult = petCareKB.searchLocalKnowledge('emergency');

      expect(healthResult.category).toBe('health');
      expect(nutritionResult.category).toBe('nutrition');
      expect(emergencyResult.category).toBe('emergency');
    });
  });
});