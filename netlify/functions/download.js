const ytdl = require("@distube/ytdl-core");

exports.handler = async (event) => {
  try {
    const { url, itag } = JSON.parse(event.body);

    const info = await ytdl.getInfo(url);

    const format = ytdl.chooseFormat(info.formats, {
      quality: itag
    });

    if (!format?.url) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: "Format not found" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        title: info.videoDetails.title,
        downloadUrl: format.url
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Failed due to YouTube 410 block"
      })
    };
  }
};
