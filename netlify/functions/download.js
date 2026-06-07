const ytdl = require("ytdl-core");

exports.handler = async (event) => {
  try {
    const { url, itag } = JSON.parse(event.body);

    const info = await ytdl.getInfo(url);

    const format = ytdl.chooseFormat(info.formats, { quality: itag });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        downloadUrl: format.url,
        title: info.videoDetails.title
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};