async function analyze() {
  const url = document.getElementById("url").value;

  if (!url) {
    alert("Please paste a video URL");
    return;
  }

  document.getElementById("result").innerHTML = "Loading...";

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await res.json();

    if (!data.success) {
      document.getElementById("result").innerHTML =
        `<p style="color:red;">${data.error}</p>`;
      return;
    }

    let html = `
      <h2>${data.title}</h2>
      <p><b>Channel:</b> ${data.channel}</p>
      <p><b>Views:</b> ${data.views}</p>
      <p><b>Duration:</b> ${data.duration}</p>
      <img src="${data.thumbnail}" width="250" style="border-radius:10px;" />
      <hr>
      <h3>Select Quality</h3>
    `;

    data.formats.forEach(f => {
      html += `
        <button class="btn" onclick="downloadVideo('${url}', '${f.itag}')">
          Download ${f.quality}
        </button>
        <br><br>
      `;
    });

    document.getElementById("result").innerHTML = html;

  } catch (err) {
    document.getElementById("result").innerHTML =
      `<p style="color:red;">Error: ${err.message}</p>`;
  }
}


// FIXED DOWNLOAD FUNCTION (IMPORTANT)
async function downloadVideo(url, itag) {
  const btns = document.querySelectorAll("button");
  btns.forEach(b => b.disabled = true);

  try {
    const res = await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, itag })
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    // Create real download trigger
    const a = document.createElement("a");
    a.href = data.downloadUrl;
    a.setAttribute("download", data.title + ".mp4");
    document.body.appendChild(a);
    a.click();
    a.remove();

  } catch (err) {
    alert("Download failed: " + err.message);
  }

  btns.forEach(b => b.disabled = false);
}


// OPTIONAL: Enter key support
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    analyze();
  }
});
