// Pet Care Knowledge Base API Integration
class PetCareKnowledgeBase {
    constructor() {
        this.cache = new Map();
        this.localKnowledge = this.createLocalKnowledgeBase();
        console.log('Pet Care Knowledge Base initialized');
    }

    // Local knowledge base as a fallback
    createLocalKnowledgeBase() {
        return {
            // Health and Wellness
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

            // Nutrition
            'diet food': {
                category: 'nutrition',
                response: 'Pets need balanced diets with proper protein, fats, and nutrients. Age, breed, and health conditions determine specific needs.',
                urgency: 'medium',
                followUp: 'What type of pet and age are we discussing?'
            },
            'treats': {
                category: 'nutrition',
                response: 'Treats should be <10% of daily calories. Avoid chocolate, grapes, onions, and xylitol which are toxic.',
                urgency: 'high',
                followUp: 'What treats do you currently give?'
            },

            // Grooming
            'bathing': {
                category: 'grooming',
                response: 'Most dogs need baths every 4-6 weeks, cats usually groom themselves. Use pet-specific shampoos.',
                urgency: 'low',
                followUp: 'What type of coat does your pet have?'
            },
            'brushing': {
                category: 'grooming',
                response: 'Regular brushing prevents mats and reduces shedding. Frequency depends on coat type: daily for long hair, weekly for short hair.',
                urgency: 'low',
                followUp: 'What grooming tools do you use?'
            },

            // Behavior
            'training': {
                category: 'behavior',
                response: 'Positive reinforcement works best. Start with basic commands like sit, stay, come. Consistency is key to success.',
                urgency: 'medium',
                followUp: 'What specific training challenges are you facing?'
            },
            'barking': {
                category: 'behavior',
                response: 'Excessive barking can indicate boredom, anxiety, or alertness. Identify triggers and provide mental stimulation.',
                urgency: 'medium',
                followUp: 'When does the barking typically occur?'
            },

            // Emergency
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

    // Search for pet care information
    async searchKnowledge(query, petType = 'general') {
        const normalizedQuery = query.toLowerCase().trim();
        
        // Check cache first
        if (this.cache.has(normalizedQuery)) {
            return this.cache.get(normalizedQuery);
        }

        try {
            // Try to fetch from external API (placeholder - you can replace with real API)
            const response = await this.fetchFromExternalAPI(normalizedQuery, petType);
            if (response) {
                this.cache.set(normalizedQuery, response);
                return response;
            }
        } catch (error) {
            console.warn('External API unavailable, using local knowledge base');
        }

        // Fallback to local knowledge base
        const localResult = this.searchLocalKnowledge(normalizedQuery, petType);
        if (localResult) {
            this.cache.set(normalizedQuery, localResult);
            return localResult;
        }

        return null;
    }

    // Search local knowledge base
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

    // External API integration (placeholder - replace with actual pet care API)
    async fetchFromExternalAPI(query, petType) {
        // This is a mock implementation - replace with actual API calls
        // Example API: Petfinder, ASPCA, or custom pet care database
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
        
        // Mock responses based on query patterns
        const mockResponses = {
            'parvo': {
                category: 'health',
                response: 'Parvovirus is highly contagious and dangerous, especially for puppies. Symptoms include vomiting, diarrhea, lethargy. Requires immediate veterinary care.',
                urgency: 'critical',
                source: 'external',
                timestamp: new Date().toISOString()
            },
            'flea': {
                category: 'parasites',
                response: 'Fleas can cause itching, allergies, and transmit diseases. Use vet-recommended preventatives monthly. Treat environment and all pets in household.',
                urgency: 'medium',
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

    // Get follow-up questions based on response
    getFollowUpQuestions(knowledge) {
        if (!knowledge || !knowledge.followUp) return [];
        
        return [
            knowledge.followUp,
            'Would you like more details about this?',
            'Is there anything else I can help with regarding pet care?'
        ];
    }

    // Get emergency contact information
    getEmergencyContacts() {
        return {
            vet: '📞 Local Vet: [Your Vet\'s Phone Number]',
            emergency: '🏥 Emergency Clinic: [Emergency Clinic Phone]',
            poison: '☠️ Poison Control: 888-426-4435 (ASPCA)',
            advice: '💡 Always keep these numbers handy in case of emergencies!'
        };
    }
}

// Export for use in chatbot
window.PetCareKnowledgeBase = PetCareKnowledgeBase;