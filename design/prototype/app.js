// ========================================
// app.js - Shared Data Layer & Utilities
// ========================================

// Global data store (loaded from data.js MOCK_DATA)
const store = {
    parties: [],
    constituencies: [],
    candidates: [],
    voters: [],
    election: null,
    votes: []
};

// ========================================
// Data Loading (from embedded MOCK_DATA)
// ========================================

function loadAllData() {
    store.parties = JSON.parse(JSON.stringify(MOCK_DATA.parties));
    store.constituencies = JSON.parse(JSON.stringify(MOCK_DATA.constituencies));
    store.candidates = JSON.parse(JSON.stringify(MOCK_DATA.candidates));
    store.voters = JSON.parse(JSON.stringify(MOCK_DATA.voters));
    store.votes = JSON.parse(JSON.stringify(MOCK_DATA.votes));
    store.election = JSON.parse(JSON.stringify(MOCK_DATA.election));
    console.log('Data loaded:', store);
}

// ========================================
// Lookup Helpers
// ========================================

function getParty(id) {
    return store.parties.find(p => p.id === id) || { name: 'ไม่ทราบ' };
}

function getConstituency(id) {
    return store.constituencies.find(c => c.id === id) || { name: 'ไม่ทราบ' };
}

function getCandidate(id) {
    return store.candidates.find(c => c.id === id) || null;
}

function getCandidatesByConstituency(constituencyId) {
    return store.candidates.filter(c => c.constituencyId === constituencyId);
}

// ========================================
// Vote Counting
// ========================================

function countVotesByCandidate(candidateId) {
    return store.votes.filter(v => v.candidateId === candidateId).length;
}

function countVotesByConstituency(constituencyId) {
    return store.votes.filter(v => v.constituencyId === constituencyId).length;
}

function getPartyTotalVotes(partyId) {
    const partyCandidates = store.candidates.filter(c => c.partyId === partyId);
    return partyCandidates.reduce((sum, c) => sum + countVotesByCandidate(c.id), 0);
}

// ========================================
// Dashboard Rendering (index.html)
// ========================================

function renderDashboard(filterConstituency) {
    const filter = filterConstituency || 'all';

    // Election status
    if (store.election) {
        document.getElementById('election-name').textContent = store.election.name;
        const badge = document.getElementById('election-status-badge');
        badge.textContent = store.election.status === 'open' ? 'เปิดรับคะแนน' :
                           store.election.status === 'closed' ? 'ปิดหีบแล้ว' :
                           store.election.status === 'finalized' ? 'ผลเป็นทางการ' : 'รอเปิด';
        badge.className = 'badge badge-' + (store.election.status === 'open' ? 'open' :
                          store.election.status === 'finalized' ? 'confirmed' : 'closed');
        document.getElementById('election-time').textContent =
            `${formatDateTime(store.election.startDate)} - ${formatDateTime(store.election.endDate)}`;
    }

    // Summary
    document.getElementById('total-votes').textContent = store.votes.length;
    document.getElementById('total-constituencies').textContent = store.constituencies.length;
    document.getElementById('total-candidates').textContent = store.candidates.length;
    document.getElementById('total-parties').textContent = store.parties.length;

    // Constituency filter dropdown
    const select = document.getElementById('constituency-filter');
    if (select.options.length <= 1) {
        store.constituencies.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            select.appendChild(opt);
        });
    }

    // Party results
    renderPartyResults(filter);

    // Constituency results
    renderConstituencyResults(filter);
}

function renderPartyResults(filter) {
    const container = document.getElementById('party-results');
    const partyVotes = store.parties.map(p => {
        let candidates;
        if (filter === 'all') {
            candidates = store.candidates.filter(c => c.partyId === p.id);
        } else {
            candidates = store.candidates.filter(c => c.partyId === p.id && c.constituencyId === parseInt(filter));
        }
        const votes = candidates.reduce((sum, c) => sum + countVotesByCandidate(c.id), 0);
        return { ...p, votes };
    }).sort((a, b) => b.votes - a.votes);

    const maxVotes = Math.max(...partyVotes.map(p => p.votes), 1);
    const totalVotes = partyVotes.reduce((s, p) => s + p.votes, 0) || 1;

    container.innerHTML = partyVotes.map((p, i) => `
        <div class="result-row">
            <div class="result-rank">${i + 1}</div>
            <div class="result-info">
                <div class="result-name">${p.name}</div>
            </div>
            <div class="result-bar-container">
                <div class="result-bar">
                    <div class="result-bar-fill party-${p.id}" style="width: ${(p.votes / maxVotes) * 100}%"></div>
                </div>
            </div>
            <div class="result-votes">${p.votes} คะแนน</div>
            <div class="result-percent">${((p.votes / totalVotes) * 100).toFixed(1)}%</div>
        </div>
    `).join('');
}

function renderConstituencyResults(filter) {
    const container = document.getElementById('constituency-results');
    const constList = filter === 'all' ? store.constituencies :
        store.constituencies.filter(c => c.id === parseInt(filter));

    container.innerHTML = constList.map(constituency => {
        const candidates = getCandidatesByConstituency(constituency.id)
            .map(c => ({
                ...c,
                votes: countVotesByCandidate(c.id),
                partyName: getParty(c.partyId).name
            }))
            .sort((a, b) => b.votes - a.votes);

        const maxVotes = Math.max(...candidates.map(c => c.votes), 1);
        const totalVotes = candidates.reduce((s, c) => s + c.votes, 0) || 1;

        return `
            <div class="card constituency-card">
                <h4>${constituency.name} (${constituency.province})</h4>
                <div class="results-container">
                    ${candidates.map((c, i) => `
                        <div class="result-row">
                            <div class="result-rank">${i + 1}</div>
                            <div class="result-info">
                                <div class="result-name">หมายเลข ${c.number} - ${c.name}</div>
                                <div class="result-party">${c.partyName}</div>
                            </div>
                            <div class="result-bar-container">
                                <div class="result-bar">
                                    <div class="result-bar-fill party-${c.partyId}" style="width: ${(c.votes / maxVotes) * 100}%"></div>
                                </div>
                            </div>
                            <div class="result-votes">${c.votes} คะแนน</div>
                            <div class="result-percent">${((c.votes / totalVotes) * 100).toFixed(1)}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// Utility Functions
// ========================================

function formatDateTime(dtStr) {
    if (!dtStr) return '-';
    try {
        const d = new Date(dtStr);
        return d.toLocaleDateString('th-TH', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch {
        return dtStr;
    }
}

function showAlert(message, type) {
    type = type || 'info';
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.left = '50%';
    alert.style.transform = 'translateX(-50%)';
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';
    alert.style.textAlign = 'center';
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

function getNextId(arr) {
    if (arr.length === 0) return 1;
    return Math.max(...arr.map(item => item.id)) + 1;
}
