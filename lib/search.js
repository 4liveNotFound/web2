const {search: youtube} = require('./youtube')
const { shortNumber, timeFormat, toSecs } = require("./functions");
const baseWatchUrl = "https://youtube.com/watch?v=";
const baseUrl = "https://youtube.com";


module.exports = class Search {
  constructor(query) {
    this.query = query;
  }

  /**
   * YouTube
   * @param {*} query
   * @returns
   */

  get youtube() {
    return new Promise(async (resolve, reject) => {
      try {
        const resolveOwner = (ownerText, owner) => {
          if (!ownerText) return null;
          const author = ownerText.runs[0];
          const authorUrl =
            author.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
            author.navigationEndpoint.commandMetadata.webCommandMetadata.url;
          const isVerified =
            owner && JSON.stringify(owner).includes("VERIFIED");
          return {
            name: author.text,
            url: baseUrl + authorUrl,
            verified: isVerified,
          };
        };

        const search = await youtube(this.query);

        search
          .filter((item) => item.videoRenderer)
          .map((item) => {
            const { videoRenderer } = item;
            const {
              videoId,
              title,
              runs,
              thumbnail,
              viewCountText,
              lengthText,
              ownerText,
              ownerBadges,
              publishedTimeText,
            } = videoRenderer;
            const shortViewCount = shortNumber(
              parseInt(viewCountText?.simpleText?.replace(/[^0-9]/g, "")) || 0
            );
            const duration = lengthText?.simpleText || "00:00";
            const seconds = toSecs(duration);
            const author = resolveOwner(ownerText, ownerBadges);
            const date = publishedTimeText?.simpleText || "";
            resolve({
              creator: "@21psycho",
              status: true,
              json: {
                type: "video",
                id: videoId,
                title: title?.runs?.[0]?.text ?? "",
                cover: {
                  url: thumbnail?.thumbnails?.[0]?.url ?? "",
                  width: thumbnail?.thumbnails?.[0]?.width ?? 0,
                  height: thumbnail?.thumbnails?.[0].height ?? 0,
                },
                viewCount:
                  viewCountText?.simpleText?.replace(/[^0-9]/g, "") ||
                  0,
                shortViewCount,
                duration,
                seconds,
                author,
                url: baseWatchUrl + videoId,
                date,
              },
            });
          });
      } catch (e) {
        resolve({ creator: "@21psycho", status: false, msg: e.message });
      }
    });
  }
};
