// ========================================
// voter.js - Voter Flow Logic
// ========================================

let currentVoter = null;
let selectedCandidateId = null;

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    populateVoterSelect();
});

function populateVoterSelect() {
    const select = document.getElementById('mock-google-select');
    store.voters.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.id;
        opt.textContent = `${v.name} (${v.email})`;
        select.appendChild(opt);
    });
}

// ========================================
// Step Navigation
// ========================================

function goToStep(stepNum) {
    document.querySelectorAll('.voter-step').forEach(s => s.classList.add('hidden'));
    document.getElementById('voter-step-' + stepNum).classList.remove('hidden');

    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById('step-' + i);
        stepEl.classList.remove('active', 'completed');
        if (i < stepNum) stepEl.classList.add('completed');
        if (i === stepNum) stepEl.classList.add('active');
    }
}

// ========================================
// UC-07: Mock Google Login
// ========================================

function mockGoogleLogin() {
    const select = document.getElementById('mock-google-select');
    const voterId = parseInt(select.value);

    if (!voterId) {
        showAlert('กรุณาเลือกผู้ใช้', 'warning');
        return;
    }

    currentVoter = store.voters.find(v => v.id === voterId);
    if (!currentVoter) {
        showAlert('ไม่พบข้อมูลผู้ใช้', 'danger');
        return;
    }

    goToStep(2);
    checkVoterStatus();
}

// ========================================
// Check Voter Status
// ========================================

function checkVoterStatus() {
    const container = document.getElementById('voter-status-content');
    const constituency = getConstituency(currentVoter.constituencyId);
    const electionOpen = store.election && store.election.status === 'open';

    let html = `
        <div class="alert alert-info mt-2">
            <strong>ข้อมูลผู้มีสิทธิ์</strong><br>
            ชื่อ: ${currentVoter.name}<br>
            อีเมล: ${currentVoter.email}<br>
            เขตเลือกตั้ง: ${constituency.name}
        </div>
    `;

    if (currentVoter.hasVoted) {
        // Already voted
        html += `
            <div class="alert alert-warning mt-1">
                ท่านได้ลงคะแนนเรียบร้อยแล้ว ไม่สามารถลงซ้ำได้
            </div>
            <a href="index.html" class="btn btn-primary mt-2">ดูผลคะแนน</a>
        `;
    } else if (!electionOpen) {
        // Election not open
        html += `
            <div class="alert alert-danger mt-1">
                ระบบเลือกตั้งยังไม่เปิด หรือปิดหีบแล้ว
            </div>
            <a href="index.html" class="btn btn-primary mt-2">กลับหน้าหลัก</a>
        `;
    } else {
        // Ready to vote
        html += `
            <div class="alert alert-success mt-1">
                ท่านมีสิทธิ์ลงคะแนนเลือกตั้ง
            </div>
            <button class="btn btn-success mt-2" onclick="enterBallot()">เข้าสู่คูหาออนไลน์</button>
        `;
    }

    container.innerHTML = html;
}

// ========================================
// UC-09: Ballot Interface
// ========================================

function enterBallot() {
    goToStep(3);
    selectedCandidateId = null;
    const constituency = getConstituency(currentVoter.constituencyId);
    document.getElementById('ballot-constituency-name').textContent = constituency.name;

    const candidates = getCandidatesByConstituency(currentVoter.constituencyId)
        .sort((a, b) => a.number - b.number);

    const container = document.getElementById('ballot-candidates');
    container.innerHTML = candidates.map(c => `
        <div class="ballot-card" id="ballot-${c.id}" onclick="selectCandidate(${c.id})">
            <div class="ballot-number">${c.number}</div>
            <div class="ballot-info">
                <h4>${c.name}</h4>
                <p>${getParty(c.partyId).name}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('confirm-vote-btn').disabled = true;
}

function selectCandidate(candidateId) {
    selectedCandidateId = candidateId;

    document.querySelectorAll('.ballot-card').forEach(card => card.classList.remove('selected'));
    document.getElementById('ballot-' + candidateId).classList.add('selected');
    document.getElementById('confirm-vote-btn').disabled = false;
}

// ========================================
// Vote Confirmation
// ========================================

function confirmVote() {
    if (!selectedCandidateId) return;

    const candidate = getCandidate(selectedCandidateId);
    const party = getParty(candidate.partyId);

    document.getElementById('modal-confirm-text').innerHTML = `
        คุณต้องการลงคะแนนให้<br>
        <strong>หมายเลข ${candidate.number} - ${candidate.name}</strong><br>
        พรรค${party.name}<br>
        ใช่หรือไม่?
    `;

    document.getElementById('vote-modal').classList.add('show');
}

function closeModal() {
    document.getElementById('vote-modal').classList.remove('show');
}

function submitVote() {
    closeModal();

    const candidate = getCandidate(selectedCandidateId);
    const party = getParty(candidate.partyId);

    // Record vote (anonymous)
    store.votes.push({
        id: getNextId(store.votes),
        candidateId: selectedCandidateId,
        constituencyId: currentVoter.constituencyId,
        timestamp: new Date().toISOString()
    });

    // Mark voter as voted
    currentVoter.hasVoted = true;

    // Show success
    goToStep(4);

    document.getElementById('vote-receipt').innerHTML = `
        <div class="alert alert-success">
            <strong>บันทึกคะแนนเรียบร้อย</strong><br>
            เขตเลือกตั้ง: ${getConstituency(currentVoter.constituencyId).name}<br>
            เวลา: ${new Date().toLocaleString('th-TH')}<br>
            <em>(คะแนนถูกบันทึกแบบ Anonymous)</em>
        </div>
    `;

    showAlert('ลงคะแนนเรียบร้อยแล้ว!', 'success');
}
