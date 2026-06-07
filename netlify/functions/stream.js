const ytdl = require("ytdl-core");

exports.handler = async (event) => {
  try {
    const videoUrl = event.queryStringParameters.video;
    const itag = event.queryStringParameters.itag;

    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: itag });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${info.videoDetails.title}.mp4"`
      },
      body: Buffer.from(await fetch(format.url).then(r => r.arrayBuffer())).toString("base64"),
      isBase64Encoded: true
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: "Error downloading video"
    };
  }
};
