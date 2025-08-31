/**
 * Blockchain-based Pet Health Records System
 * Features: Immutable health records, smart contracts, decentralized storage, NFT certificates
 */

class BlockchainHealthRecords {
  constructor() {
    this.blockchain = [];
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.difficulty = 2;
    this.healthRecords = new Map();
    this.smartContracts = new Map();
    this.nftCertificates = new Map();
    this.ipfsNodes = [];
    this.init();
  }

  async init() {
    this.setupBlockchainInterface();
    this.initializeGenesisBlock();
    this.setupHealthRecordSystem();
    this.setupSmartContracts();
    this.setupNFTCertificates();
    this.setupDecentralizedStorage();
    this.setupWalletIntegration();
  }

  setupBlockchainInterface() {
    const blockchainSection = document.createElement('section');
    blockchainSection.className = 'blockchain-health-records';
    blockchainSection.style.marginTop = '40px';
    blockchainSection.innerHTML = `
      <div class="blockchain-header">
        <h2>⛓️ Blockchain Health Records</h2>
        <p style="color:var(--muted); margin-top:4px">Secure, immutable, and decentralized pet health records</p>
      </div>

      <div class="blockchain-dashboard">
        <div class="blockchain-stats">
          <div class="stat-card">
            <div class="stat-icon">🔗</div>
            <div class="stat-info">
              <h4>Blocks Mined</h4>
              <span class="stat-number" id="blockCount">1</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <h4>Health Records</h4>
              <span class="stat-number" id="recordCount">0</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
              <h4>NFT Certificates</h4>
              <span class="stat-number" id="nftCount">0</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💎</div>
            <div class="stat-info">
              <h4>Tokens Earned</h4>
              <span class="stat-number" id="tokenBalance">0</span>
            </div>
          </div>
        </div>

        <div class="blockchain-features">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Health Record Management</h3>
            <p>Create and manage immutable health records on the blockchain</p>
            <button class="btn" onclick="this.openHealthRecordManager()">Manage Records</button>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🤝</div>
            <h3>Smart Contracts</h3>
            <p>Automated insurance claims and treatment agreements</p>
            <button class="btn" onclick="this.openSmartContractManager()">View Contracts</button>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>NFT Certificates</h3>
            <p>Digital certificates for vaccinations, training, and achievements</p>
            <button class="btn" onclick="this.openNFTGallery()">View NFTs</button>
          </div>

          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Wallet Integration</h3>
            <p>Connect your crypto wallet for transactions and rewards</p>
            <button class="btn ghost" onclick="this.connectWallet()">Connect Wallet</button>
          </div>
        </div>
      </div>

      <div class="blockchain-explorer">
        <h3>🔍 Blockchain Explorer</h3>
        <div class="explorer-controls">
          <button class="btn ghost" onclick="this.viewBlockchain()">View Blockchain</button>
          <button class="btn ghost" onclick="this.mineBlock()">Mine Block</button>
          <button class="btn ghost" onclick="this.validateChain()">Validate Chain</button>
        </div>
        <div class="blockchain-visualization" id="blockchainViz"></div>
      </div>
    `;

    const main = document.querySelector('main.container');
    if (main) {
      main.appendChild(blockchainSection);
    }

    this.bindBlockchainEvents();
  }

  initializeGenesisBlock() {
    const genesisBlock = new Block(0, "Genesis Block", "0");
    this.blockchain.push(genesisBlock);
    this.updateBlockchainStats();
  }

  setupHealthRecordSystem() {
    this.healthRecordManager = {
      createRecord: (petId, recordData) => {
        const record = {
          id: this.generateId(),
          petId: petId,
          timestamp: Date.now(),
          type: recordData.type,
          data: recordData.data,
          veterinarian: recordData.veterinarian,
          hash: this.calculateHash(JSON.stringify(recordData))
        };

        // Add to blockchain
        this.addTransaction(new Transaction('system', petId, record));
        
        return record;
      },

      getRecords: (petId) => {
        return Array.from(this.healthRecords.values())
          .filter(record => record.petId === petId)
          .sort((a, b) => b.timestamp - a.timestamp);
      },

      verifyRecord: (recordId) => {
        const record = this.healthRecords.get(recordId);
        if (!record) return false;

        // Verify hash integrity
        const calculatedHash = this.calculateHash(JSON.stringify(record.data));
        return calculatedHash === record.hash;
      }
    };
  }

  openHealthRecordManager() {
    const modal = document.createElement('div');
    modal.className = 'health-record-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>📋 Health Record Manager</h3>
          <button class="close-modal" onclick="this.closeModal()">&times;</button>
        </div>
        
        <div class="record-tabs">
          <button class="tab-btn active" data-tab="create">Create Record</button>
          <button class="tab-btn" data-tab="view">View Records</button>
          <button class="tab-btn" data-tab="verify">Verify Records</button>
        </div>

        <div class="tab-content">
          <div class="tab-panel active" id="create">
            <form class="record-form">
              <div class="form-group">
                <label>Pet ID</label>
                <select id="petSelect">
                  <option value="buddy-001">Buddy (Dog)</option>
                  <option value="whiskers-002">Whiskers (Cat)</option>
                  <option value="max-003">Max (Dog)</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Record Type</label>
                <select id="recordType">
                  <option value="vaccination">Vaccination</option>
                  <option value="checkup">Health Checkup</option>
                  <option value="treatment">Treatment</option>
                  <option value="surgery">Surgery</option>
                  <option value="medication">Medication</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Veterinarian</label>
                <input type="text" id="veterinarian" placeholder="Dr. Sarah Johnson">
              </div>
              
              <div class="form-group">
                <label>Details</label>
                <textarea id="recordDetails" placeholder="Detailed information about the health record..."></textarea>
              </div>
              
              <div class="form-group">
                <label>Attachments</label>
                <input type="file" id="recordAttachments" multiple accept="image/*,application/pdf">
              </div>
              
              <button type="button" class="btn" onclick="this.createHealthRecord()">
                ⛓️ Create Blockchain Record
              </button>
            </form>
          </div>

          <div class="tab-panel" id="view">
            <div class="records-list" id="recordsList">
              <div class="loading">Loading records from blockchain...</div>
            </div>
          </div>

          <div class="tab-panel" id="verify">
            <div class="verification-tool">
              <div class="form-group">
                <label>Record ID</label>
                <input type="text" id="verifyRecordId" placeholder="Enter record ID to verify">
              </div>
              <button class="btn" onclick="this.verifyRecord()">🔍 Verify Record</button>
              <div class="verification-result" id="verificationResult"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.loadHealthRecords();
  }

  setupSmartContracts() {
    this.smartContractManager = {
      createInsuranceContract: (petId, coverage, premium) => {
        const contract = {
          id: this.generateId(),
          type: 'insurance',
          petId: petId,
          coverage: coverage,
          premium: premium,
          active: true,
          claims: [],
          created: Date.now()
        };

        this.smartContracts.set(contract.id, contract);
        return contract;
      },

      processClaim: async (contractId, claimData) => {
        const contract = this.smartContracts.get(contractId);
        if (!contract) throw new Error('Contract not found');

        // AI-powered claim validation
        const validation = await this.validateClaim(claimData);
        
        if (validation.approved) {
          const payout = Math.min(claimData.amount, contract.coverage);
          
          // Execute smart contract payout
          this.addTransaction(new Transaction('insurance', contract.petId, {
            type: 'claim_payout',
            amount: payout,
            claimId: claimData.id
          }));

          contract.claims.push({
            ...claimData,
            status: 'approved',
            payout: payout,
            processed: Date.now()
          });
        }

        return validation;
      },

      createTreatmentContract: (petId, veterinarian, treatment) => {
        const contract = {
          id: this.generateId(),
          type: 'treatment',
          petId: petId,
          veterinarian: veterinarian,
          treatment: treatment,
          milestones: [],
          payment: {
            total: treatment.cost,
            paid: 0,
            schedule: treatment.paymentSchedule
          },
          created: Date.now()
        };

        this.smartContracts.set(contract.id, contract);
        return contract;
      }
    };
  }

  openSmartContractManager() {
    const modal = document.createElement('div');
    modal.className = 'smart-contract-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🤝 Smart Contract Manager</h3>
          <button class="close-modal" onclick="this.closeModal()">&times;</button>
        </div>
        
        <div class="contract-dashboard">
          <div class="contract-types">
            <div class="contract-type-card">
              <div class="contract-icon">🛡️</div>
              <h4>Insurance Contracts</h4>
              <p>Automated insurance claims and payouts</p>
              <button class="btn" onclick="this.createInsuranceContract()">Create Contract</button>
            </div>
            
            <div class="contract-type-card">
              <div class="contract-icon">🏥</div>
              <h4>Treatment Contracts</h4>
              <p>Milestone-based treatment agreements</p>
              <button class="btn" onclick="this.createTreatmentContract()">Create Contract</button>
            </div>
            
            <div class="contract-type-card">
              <div class="contract-icon">🎓</div>
              <h4>Training Contracts</h4>
              <p>Performance-based training programs</p>
              <button class="btn" onclick="this.createTrainingContract()">Create Contract</button>
            </div>
          </div>
          
          <div class="active-contracts">
            <h4>Active Contracts</h4>
            <div class="contracts-list" id="activeContracts">
              <div class="contract-item">
                <div class="contract-info">
                  <h5>Insurance Contract #001</h5>
                  <p>Pet: Buddy | Coverage: $5,000 | Premium: $50/month</p>
                </div>
                <div class="contract-status active">Active</div>
              </div>
              
              <div class="contract-item">
                <div class="contract-info">
                  <h5>Treatment Contract #002</h5>
                  <p>Pet: Whiskers | Treatment: Dental Surgery | Progress: 75%</p>
                </div>
                <div class="contract-status pending">In Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  setupNFTCertificates() {
    this.nftManager = {
      mintCertificate: (petId, certificateType, metadata) => {
        const nft = {
          id: this.generateId(),
          tokenId: this.nftCertificates.size + 1,
          petId: petId,
          type: certificateType,
          metadata: metadata,
          image: this.generateNFTImage(certificateType, metadata),
          minted: Date.now(),
          owner: petId
        };

        this.nftCertificates.set(nft.id, nft);
        
        // Add to blockchain
        this.addTransaction(new Transaction('system', petId, {
          type: 'nft_mint',
          nft: nft
        }));

        return nft;
      },

      transferNFT: (nftId, fromOwner, toOwner) => {
        const nft = this.nftCertificates.get(nftId);
        if (!nft || nft.owner !== fromOwner) {
          throw new Error('NFT not found or not owned by sender');
        }

        nft.owner = toOwner;
        nft.transferHistory = nft.transferHistory || [];
        nft.transferHistory.push({
          from: fromOwner,
          to: toOwner,
          timestamp: Date.now()
        });

        // Record transfer on blockchain
        this.addTransaction(new Transaction(fromOwner, toOwner, {
          type: 'nft_transfer',
          nftId: nftId
        }));

        return nft;
      }
    };
  }

  openNFTGallery() {
    const modal = document.createElement('div');
    modal.className = 'nft-gallery-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🎨 NFT Certificate Gallery</h3>
          <button class="close-modal" onclick="this.closeModal()">&times;</button>
        </div>
        
        <div class="nft-dashboard">
          <div class="nft-actions">
            <button class="btn" onclick="this.mintNewNFT()">🎨 Mint New Certificate</button>
            <button class="btn ghost" onclick="this.viewMarketplace()">🏪 View Marketplace</button>
          </div>
          
          <div class="nft-gallery" id="nftGallery">
            <div class="nft-card">
              <div class="nft-image vaccination-cert">
                <div class="nft-badge">Vaccination</div>
              </div>
              <div class="nft-info">
                <h4>Rabies Vaccination Certificate</h4>
                <p>Pet: Buddy | Date: 2024-01-15</p>
                <div class="nft-metadata">
                  <span>Token ID: #001</span>
                  <span>Verified ✅</span>
                </div>
              </div>
            </div>
            
            <div class="nft-card">
              <div class="nft-image training-cert">
                <div class="nft-badge">Training</div>
              </div>
              <div class="nft-info">
                <h4>Obedience Training Certificate</h4>
                <p>Pet: Max | Completed: Advanced Level</p>
                <div class="nft-metadata">
                  <span>Token ID: #002</span>
                  <span>Verified ✅</span>
                </div>
              </div>
            </div>
            
            <div class="nft-card">
              <div class="nft-image health-cert">
                <div class="nft-badge">Health</div>
              </div>
              <div class="nft-info">
                <h4>Annual Health Certificate</h4>
                <p>Pet: Whiskers | Status: Excellent Health</p>
                <div class="nft-metadata">
                  <span>Token ID: #003</span>
                  <span>Verified ✅</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  setupDecentralizedStorage() {
    this.ipfsManager = {
      uploadFile: async (file) => {
        // Simulate IPFS upload
        const hash = this.calculateHash(file.name + file.size + Date.now());
        
        return {
          hash: hash,
          url: `https://ipfs.io/ipfs/${hash}`,
          size: file.size,
          type: file.type
        };
      },

      retrieveFile: async (hash) => {
        // Simulate IPFS retrieval
        return {
          hash: hash,
          url: `https://ipfs.io/ipfs/${hash}`,
          available: true
        };
      },

      pinFile: async (hash) => {
        // Pin file to ensure availability
        return { pinned: true, hash: hash };
      }
    };
  }

  setupWalletIntegration() {
    this.walletManager = {
      connectWallet: async () => {
        // Simulate wallet connection (MetaMask, WalletConnect, etc.)
        if (typeof window.ethereum !== 'undefined') {
          try {
            const accounts = await window.ethereum.request({
              method: 'eth_requestAccounts'
            });
            
            return {
              connected: true,
              address: accounts[0],
              network: 'ethereum'
            };
          } catch (error) {
            throw new Error('Failed to connect wallet');
          }
        } else {
          // Fallback to simulated wallet
          return {
            connected: true,
            address: '0x' + this.generateId().substring(0, 40),
            network: 'simulated'
          };
        }
      },

      getBalance: async (address) => {
        // Get token balance
        return Math.floor(Math.random() * 1000);
      },

      sendTransaction: async (to, amount, data) => {
        // Send blockchain transaction
        const tx = {
          from: this.walletAddress,
          to: to,
          amount: amount,
          data: data,
          hash: this.generateId(),
          timestamp: Date.now()
        };

        this.addTransaction(new Transaction(tx.from, tx.to, tx.data));
        return tx;
      }
    };
  }

  // Blockchain Core Methods
  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  mineBlock() {
    if (this.pendingTransactions.length === 0) {
      this.showNotification('No pending transactions to mine', 'warning');
      return;
    }

    const block = new Block(
      this.blockchain.length,
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.mineBlock(this.difficulty);
    
    this.blockchain.push(block);
    this.pendingTransactions = [];
    
    // Process transactions
    block.transactions.forEach(tx => {
      if (tx.data && tx.data.type === 'health_record') {
        this.healthRecords.set(tx.data.id, tx.data);
      }
    });

    this.updateBlockchainStats();
    this.showNotification('Block mined successfully!', 'success');
  }

  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  validateChain() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const previousBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        this.showNotification('Invalid block hash detected!', 'error');
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        this.showNotification('Invalid previous hash detected!', 'error');
        return false;
      }
    }

    this.showNotification('Blockchain is valid!', 'success');
    return true;
  }

  viewBlockchain() {
    const viz = document.getElementById('blockchainViz');
    viz.innerHTML = '';

    this.blockchain.forEach((block, index) => {
      const blockElement = document.createElement('div');
      blockElement.className = 'block-item';
      blockElement.innerHTML = `
        <div class="block-header">
          <h4>Block #${block.index}</h4>
          <span class="block-timestamp">${new Date(block.timestamp).toLocaleString()}</span>
        </div>
        <div class="block-content">
          <div class="block-hash">Hash: ${block.hash.substring(0, 20)}...</div>
          <div class="block-prev-hash">Previous: ${block.previousHash.substring(0, 20)}...</div>
          <div class="block-transactions">Transactions: ${Array.isArray(block.transactions) ? block.transactions.length : 1}</div>
          <div class="block-nonce">Nonce: ${block.nonce}</div>
        </div>
      `;
      viz.appendChild(blockElement);
    });
  }

  updateBlockchainStats() {
    document.getElementById('blockCount').textContent = this.blockchain.length;
    document.getElementById('recordCount').textContent = this.healthRecords.size;
    document.getElementById('nftCount').textContent = this.nftCertificates.size;
    document.getElementById('tokenBalance').textContent = Math.floor(Math.random() * 1000);
  }

  // Utility Methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  calculateHash(data) {
    // Simple hash function (in production, use SHA-256)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  generateNFTImage(type, metadata) {
    // Generate unique NFT image based on type and metadata
    const colors = ['#78dbff', '#ff77c6', '#a78bfa'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="${color}" opacity="0.1"/>
      <circle cx="150" cy="150" r="100" fill="${color}" opacity="0.3"/>
      <text x="150" y="150" text-anchor="middle" font-size="20" fill="${color}">${type.toUpperCase()}</text>
    </svg>`;
  }

  bindBlockchainEvents() {
    // Add event listeners for blockchain interactions
    document.addEventListener('click', (e) => {
      if (e.target.matches('.close-modal')) {
        e.target.closest('.modal-content').parentElement.remove();
      }
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `blockchain-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

// Block class for blockchain
class Block {
  constructor(index, transactions, previousHash = '') {
    this.index = index;
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const crypto = window.crypto || window.msCrypto;
    const data = this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce;
    
    // Simple hash for demo (use proper crypto in production)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0');
    
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

// Transaction class
class Transaction {
  constructor(fromAddress, toAddress, data) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.data = data;
    this.timestamp = Date.now();
  }
}

// Initialize Blockchain Health Records
document.addEventListener('DOMContentLoaded', () => {
  window.blockchainHealthRecords = new BlockchainHealthRecords();
});