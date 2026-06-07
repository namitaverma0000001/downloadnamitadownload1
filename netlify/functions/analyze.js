const ytdl = require("@distube/ytdl-core");

exports.handler = async (event) => {
  try {
    const { url } = JSON.parse(event.body);

    if (!url || !ytdl.validateURL(url)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Invalid URL" })
      };
    }

    const info = await ytdl.getInfo(url);

    const formats = info.formats
      .filter(f => f.qualityLabel)
      .map(f => ({
        quality: f.qualityLabel,
        itag: f.itag
      }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        title: info.videoDetails.title,
        channel: info.videoDetails.author.name,
        duration: info.videoDetails.lengthSeconds,
        views: info.videoDetails.viewCount,
        thumbnail: info.videoDetails.thumbnails?.slice(-1)[0]?.url,
        formats
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "YouTube blocked request (410 error)"
      })
    };
  }
};
