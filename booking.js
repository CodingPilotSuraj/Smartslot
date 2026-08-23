/**
 * Smartslot - Booking Operations Engine (No QR Code Version)
 */

document.addEventListener("DOMContentLoaded", function() {
    const savedName = localStorage.getItem("loggedUser");
    
    if (!savedName) {
        alert("⚠️ Access Denied! Please login from the main page first.");
        window.location.href = "index.html";
        return;
    }
    
    const welcomeHeading = document.getElementById("welcome-msg");
    if (welcomeHeading) {
        welcomeHeading.innerText = `Welcome, ${savedName}! 👋`;
    }
});

// SIDEBAR TABS SWITCH LOGIC
function switchTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(function(content) {
        content.style.display = 'none';
    });
    
    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) {
        targetTab.style.display = 'block';
    }
    
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(function(item) {
        item.classList.remove('active');
    });
    
    const clickedElement = window.event ? window.event.target : null;
    if (clickedElement && clickedElement.tagName === 'LI') {
        clickedElement.classList.add('active');
    }
}

// BOOKING EXECUTION ENGINE
function generateTicket() {
    const resourceSelect = document.getElementById("resource");
    const timeslotSelect = document.getElementById("timeslot");
    const reasonInput = document.getElementById("reason");
    
    const resource = resourceSelect ? resourceSelect.value : "Unknown Resource";
    const timeslot = timeslotSelect ? timeslotSelect.value : "Default Time";
    const reason = reasonInput ? reasonInput.value.trim() : "";
    const savedName = localStorage.getItem("loggedUser") || "Guest User";
    
    if (!reason) {
        alert("⚠️ Please enter a valid reason for booking this resource!");
        if (reasonInput) reasonInput.focus();
        return;
    }
    
    // CENTRAL DATABASE & CLASH CHECK
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    
    let isAlreadyBooked = allBookings.some(function(booking) {
        return booking.resource === resource && booking.time === timeslot && booking.status !== "Completed";
    });
    
    if (isAlreadyBooked) {
        alert(`❌ Slot Clash Alert!\n\nThis slot for "${resource}" during "${timeslot}" is already booked.\nPlease choose another time slot! ⏰`);
        return;
    }
    
    // Free Slot: Save to centralized local data store
    let newBooking = {
        id: Date.now().toString(),
        student: savedName,
        resource: resource,
        time: timeslot,
        purpose: reason,
        status: "Active Tracking"
    };
    allBookings.push(newBooking);
    localStorage.setItem("allBookings", JSON.stringify(allBookings));
    
    // USER LOG: "My Bookings" Section table update
    const myBookingsList = document.getElementById("my-bookings-list");
    if (myBookingsList) {
        myBookingsList.innerHTML = `
            <div style="padding: 15px; background: #f8fafc; border-left: 5px solid #10b981; margin-bottom: 12px; border-radius: 0 8px 8px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <h4 style="color: #1e293b; margin-bottom: 5px;">${resource}</h4>
                <p style="font-size: 14px; color: #475569; margin: 2px 0;"><strong>Slot:</strong> ${timeslot}</p>
                <p style="font-size: 14px; color: #475569; margin: 2px 0;"><strong>Reason:</strong> ${reason}</p>
                <span style="color: #10b981; font-size: 12px; font-weight: bold;">
                    ● Confirmed & Active
                </span>
            </div>
        `;
    }
    
    alert(`🎉 Success! ${resource} has been successfully booked for ${timeslot}.`);
}

// LOGOUT
function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}
