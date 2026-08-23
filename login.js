/**
 * Handle Login Function
 * Iska kaam user input check karna aur sahi page par redirect karna hai.
 */
function handleLogin() {
    // 1. Input field se value nikalna aur extra spaces saaf karna
    const usernameInput = document.getElementById('username');
    const name = usernameInput.value.trim();
    
    // 2. Validation Check: Agar field khali hai toh warning do
    if (!name) {
        alert("⚠️ Please enter a name or type 'admin' to login!");
        usernameInput.focus(); // Cursor ko wapas input par le jana
        return;
    }
    
    // 3. Admin Check: Agar name 'admin' (small ya capital) hai toh Admin Panel par bhejo
    if (name.toLowerCase() === "admin") {
        alert("📊 Welcome back, Administrator! Opening Admin Panel...");
        window.location.href = "admin.html";
    } 
    // 4. Student/Teacher Check: Normal users ke liye data save karke dashboard par bhejo
    else {
        // Browser memory (localStorage) me naam save karna taaki dashboard ise read kar sake
        localStorage.setItem("loggedUser", name);
        
        alert(`🎉 Welcome ${name}! Checking available resources...`);
        window.location.href = "dashboard.html";
    }
}

// ---- SMART UX FEATURE ----
// Agar user input field me naam likh kar direct 'Enter' key dabaye, toh bhi login chal jaye
document.getElementById('username').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleLogin();
    }
});
