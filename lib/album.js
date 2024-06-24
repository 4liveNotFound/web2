const { album } = require("./youtube");
const baseWatchUrl = "https://youtube.com/watch?v=";
const baseUrl = "https://youtube.com";

module.exports = class Album {
  constructor(query) {
    this.query = query;
  }

  /**
   * Album YouTube
   * @param {*} query
   * @returns
   */

  get youtube() {
    return new Promise(async (resolve) => {
      try {
        const response = await album(this.query);
        const json = new Array();
        for (let i = 0; i < response.length; i++) {
          const {
            videoId,
            thumbnail,
            title,
            shortBylineText,
            lengthText,
            lengthSeconds,
            videoInfo,
          } = response[i].playlistVideoRenderer;
          json.push({
            videoId,
            url: baseWatchUrl + videoId,
            title: title?.runs?.[0]?.text ?? "",
            thumbs: thumbnail?.thumbnails ?? [],
            author: shortBylineText?.runs?.[0]?.text ?? "",
            duration: lengthText?.simpleText ?? "",
            durationMs: lengthSeconds ?? "",
            views:
              videoInfo?.runs?.[0]?.text
                ?.replace(" de", "")
                ?.replace(" vistas", "")
                ?.toUpperCase() ?? "",
            date: videoInfo?.runs?.[2]?.text ?? "",
          });
        }
        resolve({ creator: "@21psycho", status: true, json });
      } catch (e) {
        resolve({ creator: "@21psycho", status: false, msg: e.message });
      }
    });
  }
};
