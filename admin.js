/**
 * Smartslot - Admin Central Processing & History Archival Core Script
 */

function loadAdminTable() {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    
    // Select Both Table Target Bodies
    const activeTableBody = document.querySelector("#bookings-table tbody");
    const historyTableBody = document.querySelector("#history-table tbody");

    if (!activeTableBody || !historyTableBody) return;
    
    // Reset contents
    activeTableBody.innerHTML = "";
    historyTableBody.innerHTML = "";

    let activeCount = 0;
    let historyCount = 0;

    // Process pipeline records matching loops (Reverse order to see latest first)
    for (let i = allBookings.length - 1; i >= 0; i--) {
        let booking = allBookings[i];
        let row = document.createElement("tr");

        // CONDITION A: IF THE SLOT IS STILL ACTIVE & RUNNING
        if (booking.status === "Active Tracking") {
            activeCount++;
            row.innerHTML = `
                <td><strong>${booking.student}</strong></td>
                <td>${booking.resource}</td>
                <td><code>${booking.time}</code></td>
                <td>
                    <button onclick="changeSlotStatus(${i}, 'Completed')" style="background-color: #10b981; color: white; padding: 6px 12px; font-size: 12px; border-radius: 4px; width: auto; margin-right: 5px; cursor: pointer; border: none; font-weight:bold;">✔ Complete</button>
                    <button onclick="changeSlotStatus(${i}, 'Cancelled')" style="background-color: #dc2626; color: white; padding: 6px 12px; font-size: 12px; border-radius: 4px; width: auto; cursor: pointer; border: none;">❌ Cancel</button>
                </td>
            `;
            activeTableBody.appendChild(row);
        } 
        // CONDITION B: IF THE SLOT IS CLOSED (COMPLETED OR CANCELLED)
        else {
            historyCount++;
            let statusBadge = booking.status === "Completed"
                ? `<span style="color: #16a34a; font-weight: bold; background: #dcfce7; padding: 4px 8px; border-radius: 4px;">✅ Completed</span>`
                : `<span style="color: #dc2626; font-weight: bold; background: #fee2e2; padding: 4px 8px; border-radius: 4px;">❌ Cancelled</span>`;

            row.innerHTML = `
                <td><strong>${booking.student}</strong></td>
                <td>${booking.resource}</td>
                <td><code>${booking.time}</code></td>
                <td>${statusBadge}</td>
            `;
            historyTableBody.appendChild(row);
        }
    }

    // Empty state triggers validations placeholders
    if (activeCount === 0) {
        activeTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888; padding: 15px; font-style:italic;">📭 No active running reservations currently.</td></tr>`;
    }
    if (historyCount === 0) {
        historyTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888; padding: 15px; font-style:italic;">📭 Archive logs empty. No historical tracks recorded yet.</td></tr>`;
    }
}

// SECURE STATUS UPDATE PIPELINE (Instead of direct index purging)
function changeSlotStatus(index, newStatus) {
    let allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    
    let student = allBookings[index].student;
    let resource = allBookings[index].resource;
    let textAlert = newStatus === 'Completed' ? 'Successfully Completed' : 'Cancel';

    if (confirm(`Are you sure you want to mark ${student}'s booking for "${resource}" as ${textAlert}?`)) {
        // Shift state instead of deleting row item array metrics
        allBookings[index].status = newStatus;
        allBookings[index].timestamp = new Date().toLocaleString(); // Save closing timestamp
        
        localStorage.setItem("allBookings", JSON.stringify(allBookings));
        alert(`🏁 Status updated! Track shifted safely to permanent Admin History log.`);
        loadAdminTable(); // Dynamic refresh interface
    }
}

// SYSTEM RESET FLUSH (Clears entire local DB strings)
function clearAllData() {
    if (confirm("⚠️ Warning! This action will delete ALL records including current bookings and permanent logs history. Proceed?")) {
        localStorage.removeItem("allBookings");
        alert("🗑️ Central Memory Nodes Purged Completely!");
        loadAdminTable();
    }
}

function logoutAdmin() {
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", loadAdminTable);
