async function analyze() {
  const url = document.getElementById("url").value;

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ url })
  });

  const data = await res.json();

  let html = `<h3>${data.title}</h3>`;
  html += `<p>${data.channel}</p>`;

  data.formats.forEach(f => {
    html += `
      <button onclick="downloadVideo('${url}','${f.itag}')">
        Download ${f.quality}
      </button>
      <br>
    `;
  });

  document.getElementById("result").innerHTML = html;
}

async function downloadVideo(url, itag) {
  const res = await fetch("/api/download", {
    method: "POST",
    body: JSON.stringify({ url, itag })
  });

  const data = await res.json();

  const a = document.createElement("a");
  a.href = data.downloadUrl;
  a.download = data.title + ".mp4";
  a.click();
}