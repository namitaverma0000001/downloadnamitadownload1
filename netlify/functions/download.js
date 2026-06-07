const ytdl = require("ytdl-core");

exports.handler = async (event) => {
  try {
    const { url, itag } = JSON.parse(event.body);

    const info = await ytdl.getInfo(url);

    const format = ytdl.chooseFormat(info.formats, { quality: itag });

    // IMPORTANT: return streaming proxy URL (not direct YouTube URL)
    const streamUrl = `${process.env.URL || "https://your-site.netlify.app"}/.netlify/functions/stream?video=${encodeURIComponent(url)}&itag=${itag}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        downloadUrl: streamUrl,
        title: info.videoDetails.title
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
