// Page load hote hi chalne wala code
document.addEventListener("DOMContentLoaded", function() {
    const savedName = localStorage.getItem("loggedUser");
    
    // Security check: Agar login nahi kiya toh wapas bhej do
    if (!savedName) {
        alert("⚠️ Please login first!");
        window.location.href = "index.html";
        return;
    }
    
    // Naam update karna
    document.getElementById("welcome-msg").innerText = `Welcome, ${savedName}! 👋`;
});

// SIDEBAR TABS SWITCH LOGIC
function switchTab(tabId) {
    // 1. Saare tab content ko chhupao (hide)
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');
    
    // 2. Sirf select kiye huye tab ko dikhao
    document.getElementById(`tab-${tabId}`).style.display = 'block';
    
    // 3. Sidebar menu highlights badalna
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(item => item.classList.remove('active'));
    
    // Click kiye huye element ko active class dena
    event.currentTarget.classList.add('active');
}

// BOOKING & QR GENERATOR LOGIC
function generateTicket() {
    const resource = document.getElementById("resource").value;
    const timeslot = document.getElementById("timeslot").value;
    const reason = document.getElementById("reason").value.trim();
    const savedName = localStorage.getItem("loggedUser");
    
    if (!reason) {
        alert("⚠️ Please enter a reason for booking!");
        return;
    }
    
    // 1. Admin ke liye data save karna (LocalStorage)
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    let newBooking = {
        student: savedName,
        resource: resource,
        time: timeslot
    };
    allBookings.push(newBooking);
    localStorage.setItem("allBookings", JSON.stringify(allBookings));
    
    // 2. QR Code container saaf karna aur naya QR banana
    document.getElementById('qrcode').innerHTML = ""; 
    document.getElementById('qr-card').style.display = 'block'; // QR Card ko dikhao
    
    new QRCode(document.getElementById("qrcode"), `User:${savedName}|Item:${resource}|Time:${timeslot}`);
    
    // 3. My Bookings section me live text add karna
    document.getElementById("my-bookings-list").innerHTML = `
        <div style="padding: 10px; background: #f1f2f6; border-left: 4px solid #2ed573; margin-bottom: 10px;">
            <strong>${resource}</strong><br>
            Time: ${timeslot} <br>
            <span style="color: green; font-size: 12px;">● Confirmed</span>
        </div>
    `;
    
    alert(`🎉 Success! ${resource} booked for ${timeslot}.`);
}

// LOGOUT LOGIC
function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}
