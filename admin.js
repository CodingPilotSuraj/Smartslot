/**
 * Smartslot - Admin Central Processing Pipeline Core Script
 */

function loadAdminTable() {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    const tableBody = document.querySelector("#bookings-table tbody");

    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (allBookings.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #888; padding: 25px;">📭 No operational scheduling allocations found.</td></tr>`;
        return;
    }

    // Process pipeline rows render layout loops mapping
    for (let i = allBookings.length - 1; i >= 0; i--) {
        let booking = allBookings[i];
        let row = document.createElement("tr");

        // Status style handling based on workflow flag state configuration
        let statusBadge = booking.status === "Completed" 
            ? `<span style="color: #16a34a; font-weight: bold; background: #dcfce7; padding: 4px 8px; border-radius: 4px;">✅ Completed</span>`
            : `<span style="color: #d97706; font-weight: bold; background: #fef3c7; padding: 4px 8px; border-radius: 4px;">⏳ Running Slot</span>`;

        // Action operations condition validation rendering controls state
        let actionButtonsMarkup = booking.status === "Completed"
            ? `—`
            : `<button onclick="markAsCompleted(${i})" style="background-color: #10b981; color: white; padding: 6px 12px; font-size: 12px; border-radius: 4px; width: auto; margin-right: 5px; cursor: pointer; border: none; font-weight:bold;">✔ Complete</button>
               <button onclick="deleteBooking(${i})" style="background-color: #dc2626; color: white; padding: 6px 12px; font-size: 12px; border-radius: 4px; width: auto; cursor: pointer; border: none;">❌ Cancel</button>`;

        row.innerHTML = `
            <td><strong>${booking.student}</strong></td>
            <td>${booking.resource}</td>
            <td><code>${booking.time}</code></td>
            <td>${statusBadge}</td>
            <td style="display:flex; align-items:center;">${actionButtonsMarkup}</td>
        `;
        tableBody.appendChild(row);
    }
}

// NEW FUNCTION: Process Allocation Slot Release Workflow Complete Action
function markAsCompleted(index) {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    
    if (confirm(`Mark booking for ${allBookings[index].student} as successfully Completed?`)) {
        // Update workflow flag to allow future slot availability checks 
        allBookings[index].status = "Completed";
        localStorage.setItem("allBookings", JSON.stringify(allBookings));
        alert("🏁 Resource space status successfully updated to Completed & Slot Released!");
        loadAdminTable();
    }
}

function deleteBooking(index) {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    if (confirm(`Cancel reservation slot for ${allBookings[index].student}?`)) {
        allBookings.splice(index, 1);
        localStorage.setItem("allBookings", JSON.stringify(allBookings));
        alert("🗑️ Allocation log row successfully purged!");
        loadAdminTable();
    }
}

function clearAllData() {
    if (confirm("⚠️ Clear all database transaction rows?")) {
        localStorage.removeItem("allBookings");
        alert("🗑️ Central Memory Nodes Purged!");
        loadAdminTable();
    }
}

// Redirect execution framework control safely 
function logoutAdmin() {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", loadAdminTable);
