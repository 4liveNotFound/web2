const axios = require("axios");
const { search: youtube } = require("./youtube");
const { shortNumber, timeFormat, toSecs } = require("./functions");
const baseWatchUrl = "https://youtube.com/watch?v=";
const baseUrl = "https://youtube.com";

module.exports = class List {
  constructor(query, limit, type) {
    this.query = query;
    this.limit = limit ?? '20'
    this.type = type ?? "track"
  }

  get aptoide() {
    return new Promise(async (resolve) => {
      try {
        const data = await axios.get(
          `https://web-api-cache.aptoide.com/search?query=${this.query}&country=CL&mature=false`
        );
        resolve({
          creator: "@21psycho",
          status: true,
          json: data.data.datalist.list,
        });
      } catch (e) {
        resolve({ creator: "@21psycho", status: false, msg: e });
      }
    });
  }

  get soundcloud() {
    return new Promise(async (res) => {
      try {
        const response = await axios.get(
          `https://api-v2.soundcloud.com/search?q=${this.query}&client_id=ICQyLasUBASlFk0tLJ8FRmTTFc11FVBZ&limit=${this.limit}&offset=0&app_locale=en`
        );
        res({
          creator: "@21psycho",
          status: true,
          json: response.data.collection.filter(
            (item) => item.kind === this.type
          ),
        });
      } catch (e) {
        res({ creator: "@21psycho", status: false, msg: e.message });
      }
    });
  }

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
        let json = [];
        const search = await youtube(this.query);
        search.map((i) => {
          if (i.hasOwnProperty("videoRenderer")) {
            const { videoRenderer } = i;
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
            json.push({
              type: "video",
              id: videoId,
              title: title?.runs?.[0]?.text ?? "",
              cover: {
                url: thumbnail?.thumbnails?.[0]?.url ?? "",
                width: thumbnail?.thumbnails?.[0]?.width ?? 0,
                height: thumbnail?.thumbnails?.[0]?.height ?? 0,
              },
              viewCount:
                parseInt(viewCountText?.simpleText?.replace(/[^0-9]/g, "")) ||
                0,
              shortViewCount,
              duration,
              seconds,
              author,
              url: baseWatchUrl + videoId,
              date,
            });
          }
        });
        resolve({ creator: "@21psyco", status: true, json });
      } catch (e) {
        resolve({ creator: "@21psycho", status: false, msg: e.message });
      }
    });
  }
};
