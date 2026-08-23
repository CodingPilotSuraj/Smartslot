/**
 * Smartslot - Multi-Role Authorization with Fixed Password System
 */

// Tabs badalne ka simple function
function toggleLoginView(role) {
    const studentBox = document.getElementById("student-login-box");
    const adminBox = document.getElementById("admin-login-box");
    const btnStudent = document.getElementById("btn-student-view");
    const btnAdmin = document.getElementById("btn-admin-view");

    if (role === 'student') {
        studentBox.style.display = "block";
        adminBox.style.display = "none";
        btnStudent.style.background = "#007bff";
        btnAdmin.style.background = "#64748b";
    } else {
        studentBox.style.display = "none";
        adminBox.style.display = "block";
        btnStudent.style.background = "#64748b";
        btnAdmin.style.background = "#16a34a"; // Green for Admin view
    }
}

// Student Login Execution
function handleStudentLogin() {
    const name = document.getElementById('student-username').value.trim();
    if (!name) {
        alert("⚠️ Please enter your name to access the dashboard!");
        return;
    }
    // Browser memory me naam save karna
    localStorage.setItem("loggedUser", name);
    window.location.href = "dashboard.html";
}

// ADMIN LOGIN WITH FIXED PASSWORD
function handleAdminLogin() {
    const enteredPassword = document.getElementById("admin-password").value;
    
    // Yahan aap apna manpasand password set kar sakte hain
    const correctPassword = "Admin@123";

    if (!enteredPassword) {
        alert("⚠️ Please enter the admin password!");
        return;
    }

    // Password Check Logic
    if (enteredPassword === correctPassword) {
        alert("🎉 Authorization Successful! Opening Admin Panel...");
        window.location.href = "admin.html";
    } else {
        alert("❌ Wrong Password! Access Denied.");
        document.getElementById("admin-password").value = ""; // Form clear karna
    }
}

// KEYPRESS SUPPORT: Admin password box me Enter dabane par bhi login ho jaye
document.getElementById('admin-password')?.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleAdminLogin();
    }
});
