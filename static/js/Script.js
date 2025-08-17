document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing bulletproof tab system...');
    
    // Get all tab elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.services-tab-content');
    
    // Nuclear option to enforce tab separation
    function enforceTabSeparation() {
        console.log('Enforcing strict tab separation...');
        
        // First hide ALL content
        tabContents.forEach(content => {
            content.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
                position: absolute !important;
                opacity: 0 !important;
            `;
            content.classList.remove('active');
        });
        
        // Then show only active tab
        const activeBtn = document.querySelector('.tab-btn.active');
        if (activeBtn) {
            const tabId = activeBtn.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    height: auto !important;
                    overflow: visible !important;
                    position: relative !important;
                    opacity: 1 !important;
                `;
                activeContent.classList.add('active');
            }
        }
    }
    
    // Tab switching function
    function switchTab(tabId) {
        console.log(`Switching to tab: ${tabId}`);
        
        // Update buttons
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        
        // Enforce separation
        enforceTabSeparation();
    }
    
    // Add click handlers
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });
    
    // Initialize
    enforceTabSeparation();
    
    // Final check after 1 second
    setTimeout(() => {
        const activeTab = document.querySelector('.services-tab-content.active');
        if (!activeTab || activeTab.offsetHeight === 0) {
            console.warn('Nuclear option activating - forcing first tab visible');
            tabBtns[0]?.click();
        }
    }, 1000);
});


function openPlans() {
    document.getElementById("plansModal").style.display = "flex";
}
function closePlans() {
    document.getElementById("plansModal").style.display = "none";
}
window.addEventListener('click', function(event) {
    let modal = document.getElementById("plansModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // prevent normal form submit

        const formData = new FormData(form);

        try {
            const response = await fetch("/submit", {
                method: "POST",
                body: formData
            });
            const result = await response.json();

            if (result.status === "success") {
                showPopup(result.message, true);
                form.reset(); // clear form
            } else {
                showPopup("Something went wrong. Please try again!", false);
            }
        } catch (error) {
            showPopup("Error sending message. Try again later.", false);
        }
    });

    // Fancy Popup Function
    function showPopup(message, success = true) {
        const popup = document.getElementById("popupMessage");
        const popupText = document.getElementById("popupText");
        const checkmark = popup.querySelector(".checkmark");

        popupText.textContent = message;
        checkmark.textContent = success ? "✔" : "✖";
        checkmark.style.color = success ? "#28a745" : "#dc3545"; // green or red

        popup.style.display = "flex";

        // Auto-hide after 3s
        setTimeout(() => {
            popup.style.display = "none";
        }, 3000);
    }
});
