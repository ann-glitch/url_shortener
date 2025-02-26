async function shortenUrl() {
    let inputUrl = document.getElementById("input-url");
    if (!inputUrl.value) {
        showFlashMessage("Please enter a valid URL", "error");
        return;
    }
    
    const formData = new URLSearchParams();
    formData.append("long_url", inputUrl.value.trim());
    
    try {
        const response = await fetch("https://p3tra.co/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });
        
        const data = await response.json();
        document.getElementById("short-url").innerHTML = `<a href="${data.short_url}" target="_blank">${data.short_url}</a>`;
        inputUrl.value = "";
        showFlashMessage("URL shortened successfully!", "success");
    } catch (error) {
        console.error("Error shortening URL:", error);
        showFlashMessage("Failed to shorten URL. Please try again.", "error");
    }
}

document.getElementById("input-url").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        shortenUrl();
    }
});

function showFlashMessage(message, type) {
    const flashMessage = document.getElementById("flash-message");
    flashMessage.textContent = message;
    flashMessage.className = `flash-message ${type}`;
    flashMessage.style.display = "block";
    
    setTimeout(() => {
        flashMessage.style.display = "none";
    }, 3000);
}