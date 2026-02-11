// ========================================
// admin.js - Admin Panel Logic
// ========================================

let isLoggedIn = false;

// ========================================
// Admin Login
// ========================================

function adminLogin() {
    const user = document.getElementById('admin-username').value;
    const pass = document.getElementById('admin-password').value;
    if (user === 'admin' && pass === '1234') {
        isLoggedIn = true;
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        initAdminPanel();
    } else {
        showAlert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'danger');
    }
}

// ========================================
// Initialize Admin Panel
// ========================================

function initAdminPanel() {
    loadAllData();
    renderPartyTable();
    renderConstituencyTable();
    renderElectionInfo();
    renderVoterTable();
    renderCandidateTable();
    populateDropdowns();
    updateControlStatus();
    renderFinalizeSummary();
}

// ========================================
// Section Navigation
// ========================================

function showSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('section-' + sectionName).classList.remove('hidden');

    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    event.target.classList.add('active');
}

// ========================================
// UC-01: Party Management
// ========================================

function renderPartyTable() {
    const tbody = document.getElementById('party-table-body');
    tbody.innerHTML = store.parties.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.policy}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteParty(${p.id})">ลบ</button>
            </td>
        </tr>
    `).join('');
}

function addParty() {
    const name = document.getElementById('party-name').value.trim();
    const policy = document.getElementById('party-policy').value.trim();
    if (!name) { showAlert('กรุณากรอกชื่อพรรค', 'warning'); return; }

    store.parties.push({
        id: getNextId(store.parties),
        name,
        logo: '',
        policy
    });

    document.getElementById('party-name').value = '';
    document.getElementById('party-policy').value = '';
    renderPartyTable();
    populateDropdowns();
    showAlert('เพิ่มพรรคการเมืองสำเร็จ', 'success');
}

function deleteParty(id) {
    if (!confirm('ต้องการลบพรรคนี้?')) return;
    store.parties = store.parties.filter(p => p.id !== id);
    renderPartyTable();
    populateDropdowns();
    showAlert('ลบพรรคสำเร็จ', 'success');
}

// ========================================
// UC-02: Constituency Management
// ========================================

function renderConstituencyTable() {
    const tbody = document.getElementById('const-table-body');
    tbody.innerHTML = store.constituencies.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.province}</td>
            <td>${c.voterCount.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteConstituency(${c.id})">ลบ</button>
            </td>
        </tr>
    `).join('');
}

function addConstituency() {
    const name = document.getElementById('const-name').value.trim();
    const province = document.getElementById('const-province').value.trim();
    const voterCount = parseInt(document.getElementById('const-voters').value) || 0;
    if (!name || !province) { showAlert('กรุณากรอกข้อมูลให้ครบ', 'warning'); return; }

    store.constituencies.push({
        id: getNextId(store.constituencies),
        name,
        province,
        voterCount
    });

    document.getElementById('const-name').value = '';
    document.getElementById('const-province').value = '';
    document.getElementById('const-voters').value = '';
    renderConstituencyTable();
    populateDropdowns();
    showAlert('เพิ่มเขตเลือกตั้งสำเร็จ', 'success');
}

function deleteConstituency(id) {
    if (!confirm('ต้องการลบเขตนี้?')) return;
    store.constituencies = store.constituencies.filter(c => c.id !== id);
    renderConstituencyTable();
    populateDropdowns();
    showAlert('ลบเขตสำเร็จ', 'success');
}

// ========================================
// UC-03: Election Schedule
// ========================================

function renderElectionInfo() {
    const el = store.election;
    const container = document.getElementById('election-info');
    if (!el) {
        container.innerHTML = '<p style="color:var(--gray-500);">ยังไม่มีการตั้งค่าการเลือกตั้ง</p>';
        return;
    }
    document.getElementById('elec-name').value = el.name || '';
    if (el.startDate) document.getElementById('elec-start').value = el.startDate.slice(0, 16);
    if (el.endDate) document.getElementById('elec-end').value = el.endDate.slice(0, 16);

    container.innerHTML = `
        <div class="alert alert-info">
            <strong>${el.name}</strong><br>
            เริ่ม: ${formatDateTime(el.startDate)}<br>
            สิ้นสุด: ${formatDateTime(el.endDate)}<br>
            สถานะ: <span class="badge badge-${el.status === 'open' ? 'open' : 'closed'}">${el.status}</span>
        </div>
    `;
}

function saveElection() {
    const name = document.getElementById('elec-name').value.trim();
    const start = document.getElementById('elec-start').value;
    const end = document.getElementById('elec-end').value;

    if (!name || !start || !end) { showAlert('กรุณากรอกข้อมูลให้ครบ', 'warning'); return; }

    store.election = {
        id: 1,
        name,
        startDate: start,
        endDate: end,
        status: store.election ? store.election.status : 'pending'
    };

    renderElectionInfo();
    updateControlStatus();
    showAlert('บันทึกการตั้งค่าสำเร็จ', 'success');
}

// ========================================
// UC-04: Voter Registration
// ========================================

function renderVoterTable() {
    const tbody = document.getElementById('voter-table-body');
    tbody.innerHTML = store.voters.map(v => `
        <tr>
            <td>${v.id}</td>
            <td>${v.email}</td>
            <td>${v.name}</td>
            <td>${getConstituency(v.constituencyId).name}</td>
            <td><span class="badge ${v.hasVoted ? 'badge-confirmed' : 'badge-pending'}">${v.hasVoted ? 'ลงคะแนนแล้ว' : 'ยังไม่ลง'}</span></td>
        </tr>
    `).join('');
}

function addVoter() {
    const email = document.getElementById('voter-email').value.trim();
    const name = document.getElementById('voter-name').value.trim();
    const constId = parseInt(document.getElementById('voter-constituency').value);

    if (!email || !name || !constId) { showAlert('กรุณากรอกข้อมูลให้ครบ', 'warning'); return; }

    store.voters.push({
        id: getNextId(store.voters),
        email,
        name,
        constituencyId: constId,
        hasVoted: false
    });

    document.getElementById('voter-email').value = '';
    document.getElementById('voter-name').value = '';
    renderVoterTable();
    showAlert('เพิ่มผู้มีสิทธิ์เลือกตั้งสำเร็จ', 'success');
}

// ========================================
// UC-05: Candidate Registration
// ========================================

function renderCandidateTable() {
    const tbody = document.getElementById('cand-table-body');
    tbody.innerHTML = store.candidates.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${getParty(c.partyId).name}</td>
            <td>${getConstituency(c.constituencyId).name}</td>
            <td>${c.number || '-'}</td>
            <td><span class="badge badge-${c.status === 'confirmed' ? 'confirmed' : 'pending'}">${c.status === 'confirmed' ? 'ยืนยันแล้ว' : 'รอสุ่มหมายเลข'}</span></td>
        </tr>
    `).join('');
}

function addCandidate() {
    const name = document.getElementById('cand-name').value.trim();
    const partyId = parseInt(document.getElementById('cand-party').value);
    const constId = parseInt(document.getElementById('cand-constituency').value);

    if (!name || !partyId || !constId) { showAlert('กรุณากรอกข้อมูลให้ครบ', 'warning'); return; }

    store.candidates.push({
        id: getNextId(store.candidates),
        name,
        partyId,
        constituencyId: constId,
        number: '',
        photo: '',
        status: 'pending'
    });

    document.getElementById('cand-name').value = '';
    renderCandidateTable();
    showAlert('เพิ่มผู้สมัครสำเร็จ (สถานะ: รอสุ่มหมายเลข)', 'success');
}

// ========================================
// UC-06: Randomize Numbers
// ========================================

function randomizeNumbers() {
    const constFilter = document.getElementById('randomize-constituency').value;
    const resultDiv = document.getElementById('randomize-result');

    const constIds = constFilter === 'all'
        ? store.constituencies.map(c => c.id)
        : [parseInt(constFilter)];

    let results = [];
    constIds.forEach(cid => {
        const candidates = store.candidates.filter(c => c.constituencyId === cid);
        const numbers = Array.from({ length: candidates.length }, (_, i) => i + 1);
        // Fisher-Yates shuffle
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        candidates.forEach((c, i) => {
            c.number = numbers[i];
            c.status = 'confirmed';
        });
        results.push(`${getConstituency(cid).name}: สุ่ม ${candidates.length} คน`);
    });

    renderCandidateTable();

    resultDiv.innerHTML = `
        <div class="alert alert-success">
            <strong>สุ่มหมายเลขเสร็จสิ้น!</strong><br>
            ${results.join('<br>')}
        </div>
    `;
    showAlert('สุ่มหมายเลขผู้สมัครสำเร็จ', 'success');
}

// ========================================
// UC-08: Election Control
// ========================================

function updateControlStatus() {
    const badge = document.getElementById('current-status');
    if (!store.election) {
        badge.textContent = 'ยังไม่มีข้อมูล';
        badge.className = 'badge badge-pending';
        return;
    }
    const status = store.election.status;
    badge.textContent = status === 'open' ? 'เปิดรับคะแนน' :
                       status === 'closed' ? 'ปิดหีบแล้ว' :
                       status === 'finalized' ? 'ผลเป็นทางการ' : 'รอเปิด';
    badge.className = 'badge badge-' + (status === 'open' ? 'open' :
                      status === 'finalized' ? 'confirmed' : 'closed');
}

function setElectionStatus(status) {
    if (!store.election) { showAlert('กรุณาตั้งค่าการเลือกตั้งก่อน (UC-03)', 'warning'); return; }
    if (store.election.status === 'finalized') { showAlert('ผลเป็นทางการแล้ว ไม่สามารถเปลี่ยนได้', 'danger'); return; }

    const action = status === 'open' ? 'เปิด' : 'ปิด';
    if (!confirm(`ต้องการ${action}ระบบเลือกตั้ง?`)) return;

    store.election.status = status;
    updateControlStatus();

    const logDiv = document.getElementById('control-log');
    const now = new Date().toLocaleString('th-TH');
    logDiv.innerHTML += `<div class="alert alert-info">[ ${now} ] ${action}ระบบเลือกตั้ง โดย admin</div>`;

    showAlert(`${action}ระบบเลือกตั้งสำเร็จ`, 'success');
}

// ========================================
// UC-10: Finalize Election
// ========================================

function renderFinalizeSummary() {
    const container = document.getElementById('finalize-summary');
    if (store.votes.length === 0) {
        container.innerHTML = '<p style="color:var(--gray-500);">ยังไม่มีข้อมูลคะแนน</p>';
        return;
    }

    let html = '<h4>สรุปผลคะแนนทุกเขต</h4>';
    store.constituencies.forEach(constituency => {
        const candidates = getCandidatesByConstituency(constituency.id)
            .map(c => ({ ...c, votes: countVotesByCandidate(c.id), partyName: getParty(c.partyId).name }))
            .sort((a, b) => b.votes - a.votes);
        const total = candidates.reduce((s, c) => s + c.votes, 0);

        html += `
            <div class="mt-2">
                <strong>${constituency.name}</strong> (รวม ${total} คะแนน)
                <table class="mt-1">
                    <thead><tr><th>อันดับ</th><th>หมายเลข</th><th>ผู้สมัคร</th><th>พรรค</th><th>คะแนน</th></tr></thead>
                    <tbody>
                        ${candidates.map((c, i) => `
                            <tr style="${i === 0 ? 'background:#d1fae5;' : ''}">
                                <td>${i + 1}</td>
                                <td>${c.number}</td>
                                <td>${c.name}</td>
                                <td>${c.partyName}</td>
                                <td>${c.votes}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    });

    container.innerHTML = html;
}

function finalizeElection() {
    if (!store.election) { showAlert('ไม่มีข้อมูลการเลือกตั้ง', 'danger'); return; }
    if (store.election.status === 'finalized') { showAlert('ผลเป็นทางการแล้ว', 'warning'); return; }
    if (!confirm('ยืนยันประกาศผลเป็นทางการ? ข้อมูลจะถูกล็อกไม่ให้แก้ไขได้อีก')) return;

    store.election.status = 'finalized';
    updateControlStatus();
    showAlert('ยืนยันผลการเลือกตั้งเป็นทางการสำเร็จ', 'success');
}

// ========================================
// Populate Dropdowns
// ========================================

function populateDropdowns() {
    // Constituency dropdowns
    const constSelects = ['voter-constituency', 'cand-constituency', 'randomize-constituency'];
    constSelects.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const firstOpt = el.options[0];
        el.innerHTML = '';
        if (firstOpt && firstOpt.value === 'all') el.appendChild(firstOpt);
        store.constituencies.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            el.appendChild(opt);
        });
    });

    // Party dropdown
    const partySelect = document.getElementById('cand-party');
    if (partySelect) {
        partySelect.innerHTML = '';
        store.parties.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.name;
            partySelect.appendChild(opt);
        });
    }
}
