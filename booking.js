/**
 * Smartslot - Advanced Dynamic Grid Calendar & Multi-Asset History Log Processor
 */

// Global constant array of core scheduling matrix parameters slots
const AVAILABLE_SLOTS_POOL = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM"
];

let selectedSlotString = null; // Session tracking variable for grid pointer click state

document.addEventListener("DOMContentLoaded", function() {
    const savedName = localStorage.getItem("loggedUser");
    if (!savedName) {
        alert("⚠️ Access Denied! Please authorization log in from front page first.");
        window.location.href = "index.html";
        return;
    }
    
    document.getElementById("welcome-msg").innerText = `Welcome, ${savedName}! 👋`;
    
    // Initial core calculations run setups
    renderInteractiveCalendar();
    loadUserPersonalLogCollections();
});

// 1. DYNAMIC INTERACTIVE CALENDAR ENGINE
function renderInteractiveCalendar() {
    const targetResource = document.getElementById("resource").value;
    const gridContainer = document.getElementById("calendar-grid");
    if (!gridContainer) return;
    
    gridContainer.innerHTML = ""; // Flush template structure elements 
    selectedSlotString = null; // Reset selection anchor target pointer

    // Fetch centralized database matrix logs array state
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];

    // Loop elements execution pipeline render mapping
    AVAILABLE_SLOTS_POOL.forEach(function(slotTime) {
        let slotElement = document.createElement("div");
        slotElement.className = "slot-box";
        
        // Match condition algorithm verification checking for conflicts execution state flag
        let isSlotTaken = allBookings.some(function(b) {
            return b.resource === targetResource && b.time === slotTime && b.status !== "Completed";
        });

        if (isSlotTaken) {
            slotElement.classList.add("booked");
            slotElement.innerHTML = `⏰ ${slotTime}<br><span style="font-size:10px; font-weight:bold;">🔴 Booked</span>`;
        } else {
            slotElement.classList.add("available");
            slotElement.innerHTML = `⏰ ${slotTime}<br><span style="font-size:10px;">🟢 Available</span>`;
            
            // Add grid click events mapping configurations handling values shifts pointers
            slotElement.onclick = function() {
                // Clear any previous blue highlights selections layers targets checks
                const allBoxes = document.querySelectorAll(".slot-box");
                allBoxes.forEach(b => b.classList.remove("selected"));
                
                // Set click selections flags focus elements
                slotElement.classList.add("selected");
                selectedSlotString = slotTime;
            };
        }
        gridContainer.appendChild(slotElement);
    });
}

// 2. DYNAMIC RECORD ENGINE - SEPARATING MULTIPLE ACTIVE AND HISTORY LOGS
function loadUserPersonalLogCollections() {
    const activeContainer = document.getElementById("active-bookings-container");
    const historyContainer = document.getElementById("history-bookings-container");
    const activeUser = localStorage.getItem("loggedUser");

    if (!activeContainer || !historyContainer) return;

    activeContainer.innerHTML = "";
    historyContainer.innerHTML = "";

    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];

    // Filter transaction logs mapping target criteria matching active username parameters nodes
    let userSpecificBookings = allBookings.filter(b => b.student === activeUser);

    let activeSlotsCount = 0;
    let historySlotsCount = 0;

    userSpecificBookings.slice().reverse().forEach(function(booking) {
        // Construct visual card element component metrics
        let card = document.createElement("div");
        card.className = "card";
        card.style.maxWidth = "100%";
        card.style.marginBottom = "12px";
        card.style.padding = "15px";

        if (booking.status === "Active Tracking") {
            // Render Component UI inside Active Allocation Array panel
            activeSlotsCount++;
            card.style.borderLeft = "5px solid #10b981";
            card.innerHTML = `
                <div style="display:flex; justify-content:between; align-items:center; width:100%;">
                    <div style="flex-grow:1;">
                        <h4 style="color:#1e293b; font-size:16px;">${booking.resource}</h4>
                        <p style="font-size:13px; color:#475569; margin:3px 0;"><strong>Time Frame Slot:</strong> <code>${booking.time}</code></p>
                        <p style="font-size:13px; color:#475569; margin:3px 0;"><strong>Stated Purpose:</strong> ${booking.purpose}</p>
                    </div>
                    <div>
                        <span style="color:#10b981; background:#dcfce7; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold;">● Confirmed Gate Open</span>
                    </div>
                </div>
            `;
            activeContainer.appendChild(card);
        } else {
            // Render Component UI inside Closed Logs parameters space history framework
            historySlotsCount++;
            card.classList.add("history-card");
            
            let badgeMarkup = booking.status === "Completed"
                ? `<span style="color:#16a34a; font-weight:bold; font-size:11px;">✅ Successfully Released</span>`
                : `<span style="color:#dc2626; font-weight:bold; font-size:11px;">❌ Cancelled by Management</span>`;

            card.innerHTML = `
                <h4 style="color:#64748b; font-size:15px; text-decoration: line-through;">${booking.resource}</h4>
                <p style="font-size:12px; color:#64748b; margin:2px 0;"><strong>Slot:</strong> ${booking.time}</p>
                <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:11px; color:#94a3b8;">Logged: ${booking.timestamp || 'N/A'}</span>
                    ${badgeMarkup}
                </div>
            `;
            historyContainer.appendChild(card);
        }
    });

    // Handle initial empty state blocks configurations layout conditions
    if (activeSlotsCount === 0) {
        activeContainer.innerHTML = `<p style="color:#888; font-style:italic; padding:10px;">ℹ️ You have no multiple active slots allocations currently running.</p>`;
    }
    if (historySlotsCount === 0) {
        historyContainer.innerHTML = `<p style="color:#888; font-style:italic; padding:10px;">ℹ️ No database historical closed transaction tracks found for your username.</p>`;
    }
}

// 3. SECURE PROCESSING ALLOCATION ENGINE SUBMIT 
function processGridBooking() {
    const resource = document.getElementById("resource").value;
    const reason = document.getElementById("reason").value.trim();
    const activeUser = localStorage.getItem("loggedUser") || "Guest";

    // Validation 1: Verify grid cell has tracking click focus point
    if (!selectedSlotString) {
        alert("⚠️ Core Processing Error: Please choose/click an available Time Slot box grid first!");
        return;
    }

    // Validation 2: Ensure purpose input contains text characters metrics values
    if (!reason) {
        alert("⚠️ Core Validation Error: Please provide an active validation reason purpose text block!");
        document.getElementById("reason").focus();
        return;
    }

    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];

    // Double Layer Verification: Check if slot was taken while page was open
    let isClash = allBookings.some(b => b.resource === resource && b.time === selectedSlotString && b.status !== "Completed");
    if (isClash) {
        alert("❌ Slot conflict error! This specific target space cell was just captured by another terminal node log.");
        renderInteractiveCalendar();
        return;
    }

    // Pack tracking payload array dataset maps configurations objects 
    let bookingPayload = {
        id: "SLOT_" + Date.now(),
        student: activeUser,
        resource: resource,
        time: selectedSlotString,
        purpose: reason,
        status: "Active Tracking",
        timestamp: new Date().toLocaleString()
    };

    allBookings.push(bookingPayload);
    localStorage.setItem("allBookings", JSON.stringify(allBookings));

    alert(`🎉 Allocation Confirmed!\n\nYour selected time matrix track: [ ${selectedSlotString} ] for "${resource}" has been securely logged down.`);
    
    // Clear elements value configurations textareas reset
    document.getElementById("reason").value = "";
    
    // Force live components matrix tables interfaces synchronization updates
    renderInteractiveCalendar();
    loadUserPersonalLogCollections();
}

// ROUTING TABS MATRIX CONTROLLER 
function switchTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = 'none');
    
    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.style.display = 'block';
    
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(item => item.classList.remove('active'));
    
    if (window.event && window.event.currentTarget.tagName === 'LI') {
        window.event.currentTarget.classList.add('active');
    }

    // Dynamic data loading triggers on tab switch
    if (tabId === 'my-bookings') {
        loadUserPersonalLogCollections();
    } else if (tabId === 'book-slot') {
        renderInteractiveCalendar();
    }
}

function logout() {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
}
