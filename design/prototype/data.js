// ========================================
// data.js - Embedded Mock Data
// ========================================

const MOCK_DATA = {
    parties: [
        { id: 1, name: "พรรคประชาชน", logo: "kaokhai.png", policy: "นโยบายปฏิรูปกองทัพ, กระจายอำนาจ, แก้ผูกขาด" },
        { id: 2, name: "พรรคเพื่อไทย", logo: "pheauthai.png", policy: "นโยบายกระตุ้นเศรษฐกิจ, Digital Wallet, ลดค่าพลังงาน" },
        { id: 3, name: "พรรคภูมิใจไทย", logo: "bhumjaithai.png", policy: "นโยบายกัญชาเสรี, พัฒนาโครงสร้างพื้นฐาน" },
        { id: 4, name: "พรรคพลังประชารัฐ", logo: "pprp.png", policy: "นโยบายบัตรสวัสดิการแห่งรัฐ, สานต่อโครงการรัฐ" },
        { id: 5, name: "พรรคประชาธิปัตย์", logo: "democrat.png", policy: "นโยบายปฏิรูปการศึกษา, สิ่งแวดล้อม" }
    ],

    constituencies: [
        { id: 1, name: "เขต 1 กรุงเทพฯ", province: "กรุงเทพมหานคร", voterCount: 85000 },
        { id: 2, name: "เขต 2 กรุงเทพฯ", province: "กรุงเทพมหานคร", voterCount: 78000 },
        { id: 3, name: "เขต 1 เชียงใหม่", province: "เชียงใหม่", voterCount: 62000 },
        { id: 4, name: "เขต 1 ขอนแก่น", province: "ขอนแก่น", voterCount: 71000 },
        { id: 5, name: "เขต 1 สงขลา", province: "สงขลา", voterCount: 68000 }
    ],

    candidates: [
        { id: 1,  name: "นายสมชาย ใจดี",         partyId: 1, constituencyId: 1, number: 3, photo: "candidate1.png",  status: "confirmed" },
        { id: 2,  name: "นางสาวพิมพ์ใจ รักไทย",   partyId: 2, constituencyId: 1, number: 1, photo: "candidate2.png",  status: "confirmed" },
        { id: 3,  name: "นายประเสริฐ มั่นคง",      partyId: 4, constituencyId: 1, number: 5, photo: "candidate3.png",  status: "confirmed" },
        { id: 4,  name: "นายวิทยา ก้าวหน้า",       partyId: 1, constituencyId: 2, number: 2, photo: "candidate4.png",  status: "confirmed" },
        { id: 5,  name: "นางนภา สดใส",            partyId: 3, constituencyId: 2, number: 4, photo: "candidate5.png",  status: "confirmed" },
        { id: 6,  name: "นายอดิศร แข็งแกร่ง",      partyId: 5, constituencyId: 2, number: 1, photo: "candidate6.png",  status: "confirmed" },
        { id: 7,  name: "นายเกียรติศักดิ์ ซื่อตรง",   partyId: 2, constituencyId: 3, number: 1, photo: "candidate7.png",  status: "confirmed" },
        { id: 8,  name: "นางสาวจันทร์เพ็ญ สว่าง",   partyId: 1, constituencyId: 3, number: 3, photo: "candidate8.png",  status: "confirmed" },
        { id: 9,  name: "นายบุญมี ศรีสุข",          partyId: 3, constituencyId: 3, number: 2, photo: "candidate9.png",  status: "confirmed" },
        { id: 10, name: "นายธนากร เจริญสุข",       partyId: 4, constituencyId: 4, number: 5, photo: "candidate10.png", status: "confirmed" },
        { id: 11, name: "นางสาวรัตนา พัฒนา",      partyId: 2, constituencyId: 4, number: 2, photo: "candidate11.png", status: "confirmed" },
        { id: 12, name: "นายสุรศักดิ์ ยุติธรรม",      partyId: 5, constituencyId: 4, number: 1, photo: "candidate12.png", status: "confirmed" },
        { id: 13, name: "นายชัยวัฒน์ ทักษิณ",       partyId: 1, constituencyId: 5, number: 4, photo: "candidate13.png", status: "confirmed" },
        { id: 14, name: "นางปราณี เมตตา",          partyId: 3, constituencyId: 5, number: 3, photo: "candidate14.png", status: "confirmed" },
        { id: 15, name: "นายอำนาจ ประชาชน",      partyId: 2, constituencyId: 5, number: 1, photo: "candidate15.png", status: "confirmed" }
    ],

    voters: [
        { id: 1,  email: "somchai@gmail.com",    name: "สมชาย วงศ์สกุล",    constituencyId: 1, hasVoted: true },
        { id: 2,  email: "napat@gmail.com",      name: "ณภัทร สุขสันต์",      constituencyId: 1, hasVoted: false },
        { id: 3,  email: "wanida@gmail.com",     name: "วนิดา ศรีทอง",       constituencyId: 2, hasVoted: true },
        { id: 4,  email: "prasit@gmail.com",     name: "ประสิทธิ์ เจริญผล",    constituencyId: 2, hasVoted: false },
        { id: 5,  email: "kanya@gmail.com",      name: "กัญญา ดวงแก้ว",      constituencyId: 3, hasVoted: true },
        { id: 6,  email: "teerapong@gmail.com",  name: "ธีรพงศ์ อินทร์แก้ว",   constituencyId: 3, hasVoted: false },
        { id: 7,  email: "suda@gmail.com",       name: "สุดา แสงจันทร์",      constituencyId: 4, hasVoted: true },
        { id: 8,  email: "anon@gmail.com",       name: "อานนท์ สมบูรณ์",     constituencyId: 4, hasVoted: false },
        { id: 9,  email: "rattana@gmail.com",    name: "รัตนา ภูเขา",         constituencyId: 5, hasVoted: true },
        { id: 10, email: "pichai@gmail.com",     name: "พิชัย มหาชัย",        constituencyId: 5, hasVoted: false }
    ],

    election: { id: 1, name: "การเลือกตั้งสมาชิกสภาผู้แทนราษฎร 2570", startDate: "2027-05-14T08:00:00", endDate: "2027-05-14T17:00:00", status: "open" },

    votes: [
        { id: 1,  candidateId: 2,  constituencyId: 1, timestamp: "2027-05-14T08:15:32" },
        { id: 2,  candidateId: 1,  constituencyId: 1, timestamp: "2027-05-14T08:22:11" },
        { id: 3,  candidateId: 2,  constituencyId: 1, timestamp: "2027-05-14T08:45:03" },
        { id: 4,  candidateId: 1,  constituencyId: 1, timestamp: "2027-05-14T09:01:55" },
        { id: 5,  candidateId: 3,  constituencyId: 1, timestamp: "2027-05-14T09:10:20" },
        { id: 6,  candidateId: 1,  constituencyId: 1, timestamp: "2027-05-14T09:32:44" },
        { id: 7,  candidateId: 2,  constituencyId: 1, timestamp: "2027-05-14T09:55:18" },
        { id: 8,  candidateId: 1,  constituencyId: 1, timestamp: "2027-05-14T10:05:30" },
        { id: 9,  candidateId: 5,  constituencyId: 2, timestamp: "2027-05-14T08:20:15" },
        { id: 10, candidateId: 4,  constituencyId: 2, timestamp: "2027-05-14T08:35:42" },
        { id: 11, candidateId: 4,  constituencyId: 2, timestamp: "2027-05-14T08:50:11" },
        { id: 12, candidateId: 6,  constituencyId: 2, timestamp: "2027-05-14T09:12:33" },
        { id: 13, candidateId: 4,  constituencyId: 2, timestamp: "2027-05-14T09:25:05" },
        { id: 14, candidateId: 5,  constituencyId: 2, timestamp: "2027-05-14T09:40:22" },
        { id: 15, candidateId: 7,  constituencyId: 3, timestamp: "2027-05-14T08:10:45" },
        { id: 16, candidateId: 8,  constituencyId: 3, timestamp: "2027-05-14T08:30:18" },
        { id: 17, candidateId: 7,  constituencyId: 3, timestamp: "2027-05-14T08:55:30" },
        { id: 18, candidateId: 9,  constituencyId: 3, timestamp: "2027-05-14T09:20:12" },
        { id: 19, candidateId: 7,  constituencyId: 3, timestamp: "2027-05-14T09:45:55" },
        { id: 20, candidateId: 11, constituencyId: 4, timestamp: "2027-05-14T08:12:33" },
        { id: 21, candidateId: 10, constituencyId: 4, timestamp: "2027-05-14T08:40:20" },
        { id: 22, candidateId: 11, constituencyId: 4, timestamp: "2027-05-14T09:05:15" },
        { id: 23, candidateId: 12, constituencyId: 4, timestamp: "2027-05-14T09:30:44" },
        { id: 24, candidateId: 11, constituencyId: 4, timestamp: "2027-05-14T09:50:22" },
        { id: 25, candidateId: 15, constituencyId: 5, timestamp: "2027-05-14T08:18:10" },
        { id: 26, candidateId: 13, constituencyId: 5, timestamp: "2027-05-14T08:42:35" },
        { id: 27, candidateId: 14, constituencyId: 5, timestamp: "2027-05-14T09:08:20" },
        { id: 28, candidateId: 13, constituencyId: 5, timestamp: "2027-05-14T09:35:50" },
        { id: 29, candidateId: 15, constituencyId: 5, timestamp: "2027-05-14T09:55:15" }
    ]
};
