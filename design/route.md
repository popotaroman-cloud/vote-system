# **รายการ Route และโครงสร้างหน้าเว็บ (Routing Table)**

เอกสารสรุปความสัมพันธ์ระหว่าง **Route URL**, **Page ID** จากรายละเอียดหน้าเพจ และสถานะใน **UI State Diagram**

## **1\. สำหรับผู้ใช้ทั่วไปและผู้มีสิทธิเลือกตั้ง (Public & Voter Flow)**

| Route URL | Page ID | ชื่อหน้า / รายละเอียด | Use Case (UC) | สถานะใน UI State Diagram |
| ----- | ----- | ----- | ----- | ----- |
| `/` | P-01 | **หน้าหลัก (Public Dashboard)** แสดงคะแนน Real-time | UC-11 | `LandingPage` |
| `/voter` | P-02-1 | **ตรวจสอบสิทธิ์** (Mock Google Login / Status Check) | UC-07 | `VoterDashboard` |
| `/voter/ballot` | P-02-2 | **คูหาเลือกตั้ง** รายชื่อผู้สมัครในเขตของผู้ใช้ | UC-09 | `BallotInterface` |
| `/voter/confirm` | P-02-3 | **ยืนยันการลงคะแนน** (Modal/Confirmation) | UC-09 | `VoteConfirmation` |
| `/voter/success` | P-02-4 | **ลงคะแนนสำเร็จ** แสดงหลักฐานการลงคะแนน | \- | `VotingSuccess` |

## **2\. สำหรับผู้ดูแลระบบ (EC Admin Flow)**

| Route URL | Page ID | ชื่อหน้า / รายละเอียด | Use Case (UC) | สถานะใน UI State Diagram |
| ----- | ----- | ----- | ----- | ----- |
| `/admin/login` | P-03-0 | **เข้าสู่ระบบ กกต.** (Admin Login) | \- | `AdminLogin` |
| `/admin/dashboard` | P-03-0 | **แผงควบคุมหลัก** (Admin Control Panel) | \- | `AdminControlPanel` |
| `/admin/parties` | P-03-1 | **จัดการพรรคการเมือง** (เพิ่ม/ลบ ข้อมูลพรรค) | UC-01 | `MasterDataManagement` |
| `/admin/constituencies` | P-03-2 | **จัดการเขตเลือกตั้ง** (พื้นที่/จำนวนผู้มีสิทธิ์) | UC-02 | `MasterDataManagement` |
| `/admin/voters` | P-03-3 | **จัดการผู้มีสิทธิ์** (ทะเบียนผู้มีสิทธิ์เลือกตั้ง) | UC-04 | `VoterRegistration` |
| `/admin/candidates` | P-03-4 | **จัดการผู้สมัคร** (ลงทะเบียนผู้สมัครรับเลือกตั้ง) | UC-05 | `CandidateManagement` |
| `/admin/randomize` | P-03-5 | **สุ่มหมายเลข** ระบบรันเลขผู้สมัครในเขต | UC-06 | `RandomizeNumbers` |
| `/admin/control` | P-03-6 | **ควบคุมการเลือกตั้ง** (ตั้งเวลา/เปิด-ปิดระบบ) | UC-03, UC-08 | `ElectionControl` |
| `/admin/finalize` | P-03-7 | **ยืนยันผลทางการ** (ปิดหีบ/Lock ข้อมูลผลคะแนน) | UC-10 | `FinalizeElection` |

## **หมายเหตุการพัฒนา (Implementation Notes)**

* **Authentication Guard**: Route ในกลุ่ม `/admin/*` (ยกเว้น login) และ `/voter/ballot` จะต้องมีการตรวจสอบสิทธิ์ก่อนเข้าใช้งาน  
* **State Transition**: การเปลี่ยนจาก `/voter/ballot` ไปยัง `/voter/success` ควรทำผ่าน Database Transaction เพื่อป้องกันการลงคะแนนซ้ำ (Double Voting)  
* **Real-time**: หน้า `/` (P-01) ควรเชื่อมต่อกับ API หรือ WebSocket เพื่ออัปเดตคะแนนแบบ Real-time ตาม UC-11