const API_URL = "https://fakecheck-gpt-python.onrender.com/analyze";

document.addEventListener("DOMContentLoaded", () => {
  const btnPage = document.getElementById("check-page");
  const btnSelection = document.getElementById("check-selection");

  async function analyze(text) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        document.getElementById("result").innerHTML =
          `<p style="color:red;">Errore: ${res.status} ${res.statusText}</p>`;
        return;
      }

      const data = await res.json();
      document.getElementById("result").innerHTML =
        `<p><strong>Score:</strong> ${data.fake_news_score}%</p>
         <p><strong>Motivo:</strong> ${data.explanation}</p>`;
    } catch (error) {
      document.getElementById("result").innerHTML =
        `<p style="color:red;">Errore nella richiesta: ${error.message}</p>`;
    }
  }

  btnPage.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => document.body.innerText
      }, (results) => {
        if (results && results[0]) {
          analyze(results[0].result);
        }
      });
    });
  };

  btnSelection.onclick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => window.getSelection().toString()
      }, (results) => {
        if (results && results[0]) {
          analyze(results[0].result);
        }
      });
    });
  };
});
