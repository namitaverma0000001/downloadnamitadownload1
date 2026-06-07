const ytdl = require("ytdl-core");

exports.handler = async (event) => {
  try {
    const { url } = JSON.parse(event.body);

    const info = await ytdl.getInfo(url);

    const formats = info.formats
      .filter(f => f.qualityLabel)
      .map(f => ({
        quality: f.qualityLabel,
        itag: f.itag,
        mime: f.mimeType
      }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        title: info.videoDetails.title,
        channel: info.videoDetails.author.name,
        duration: info.videoDetails.lengthSeconds,
        views: info.videoDetails.viewCount,
        formats
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};