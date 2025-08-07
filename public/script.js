document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("urlForm");
  const resultDiv = document.getElementById("result");
  const errorDiv = document.getElementById("error");
  const shortUrlLink = document.getElementById("shortUrlLink");
  const copyButton = document.getElementById("copyButton");
  const copyFeedback = document.getElementById("copyFeedback");
  const submitButton = document.getElementById("submitButton");
  const buttonText = document.getElementById("buttonText");
  const spinner = document.getElementById("spinner");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const longUrl = e.target.elements.longUrl.value;

    buttonText.textContent = "Shortening...";
    spinner.style.display = "inline-block";
    submitButton.disabled = true;

    resultDiv.classList.add("hidden");
    errorDiv.classList.add("hidden");

    try {
      const response = await fetch("/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      shortUrlLink.href = data.shortUrl;
      shortUrlLink.textContent = data.shortUrl;
      resultDiv.classList.remove("hidden");
      copyFeedback.classList.add("hidden");
    } catch (err) {
      errorDiv.textContent = err.message;
      errorDiv.classList.remove("hidden");
    } finally {
      buttonText.textContent = "Shorten URL";
      spinner.style.display = "none";
      submitButton.disabled = false;
    }
  });

  copyButton.addEventListener("click", () => {
    navigator.clipboard
      .writeText(shortUrlLink.href)
      .then(() => {
        copyFeedback.classList.remove("hidden");
        setTimeout(() => copyFeedback.classList.add("hidden"), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        alert("Oops, unable to copy");
      });
  });
});
