async function shortenUrl() {
    const inputUrl = document.getElementById("input-url");
    const url = inputUrl.value.trim();
    const resultContainer = document.getElementById("result-container");
    const shortUrlInput = document.getElementById("short-url");
    const copyBtn = document.getElementById("copy-btn");

    // hide result container before processing
    resultContainer.classList.add("hidden");

    if (!url) {
        showFlashMessage("Please enter a URL.", "error");
        return;
    }

    if (!isValidUrl(url)) {
        showFlashMessage("The provided URL is invalid. Please enter a valid URL.", "error");
        return;
    }

    try {
        const response = await fetch("https://p3tra.co/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ "long_url": url })
        });
        const data = await response.json();

        if (data.status_code == 400) {
            showFlashMessage("Error processing request. Please review your input and try again.", "error")
            return;
        }
        
        shortUrlInput.value = data.short_url;
        resultContainer.classList.remove("hidden"); // show result container
        copyBtn.setAttribute("data-url", data.short_url);
        showFlashMessage("URL shortened successfully!", "success");
        inputUrl.value = "";
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

function copyToClipboard() {
    const copyBtn = document.getElementById("copy-btn");
    const shortUrl = document.getElementById("short-url");

    if (!shortUrl.value) return;

    navigator.clipboard.writeText(shortUrl.value).then(() => {
        copyBtn.querySelector("#copy-text").textContent = "Copied!"; 

        setTimeout(() => {
            copyBtn.querySelector("#copy-text").textContent = "Copy";
        }, 2000);
    }).catch(() => {
        showFlashMessage("Failed to copy the URL. Please try manually.", "error");
    });
}

function isValidUrl(url) {
    const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/;
    return pattern.test(url);
}

function showFlashMessage(message, type) {
    const flashMessage = document.getElementById("flash-message");
    flashMessage.textContent = message;
    flashMessage.className = `flash-message ${type}`;
    flashMessage.style.display = "block";
    
    setTimeout(() => {
        flashMessage.style.display = "none";
    }, 4000);
}