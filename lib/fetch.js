const axios = require("axios");
const { shortNumber, timeFormat, toSecs } = require("./functions");
const { fetch } = require("./youtube");

/**
 * Youtube Base Url
 */
const baseWatchUrl = "https://youtube.com/watch?v=";
const baseUrl = "https://youtube.com";

module.exports = class Fetch {
  constructor(url, type) {
    this.url = url;
    this.type = type ?? "sound";
  }

  /**
   * Aptoide
   * @param {*} url
   * @returns
   */

  get aptoide() {
    return new Promise(async (resolve) => {
      try {
        const data = await axios.get(this.url);
        const html = data.data;
        const htmlMatch = html.match(
          /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s
        )[1];
        const json = JSON.parse(htmlMatch).props.app;
        resolve({ creator: "@21psycho", status: true, json });
      } catch (e) {
        resolve({ creator: "@21psycho", status: false, error: e });
      }
    });
  }

  /**
   * SoundCloud
   * @param {*} url
   * @param {*} type
   * @returns
   */

  get soundcloud() {
    return new Promise(async (resolve) => {
      try {
        const response = await axios.get(this.url);
        const html = response.data;
        const htmlMatch = html.match(
          /window\.__sc_hydration\s*=\s*(\[[\s\S]*?\]);/g
        )[0];
        const replaceHtml = htmlMatch.replace(/window.__sc_hydration = /g, "");
        const json = JSON.parse(replaceHtml.slice(0, -1)).filter(
          (item) => item.hydratable === this.type
        )[0].data;
        resolve({ cretor: "@21psycho", status: true, json });
      } catch (e) {
        resolve({ creator: "@21psycho", status: false, msg: e.message });
      }
    });
  }

  /**
   * YouTube
   * @param {*} url
   * @returns
   */

  get youtube() {
    return new Promise(async (res) => {
      try {
        const response = await fetch(this.url);
        const {
          videoId,
          title,
          lengthSeconds,
          shortDescription,
          thumbnail,
          viewCount,
          author,
          keywords,
        } = response.videoDetails;
        const { formats, adaptiveFormats } = response.streamingData;
        let video = new Object();
        formats.map((item) => {
          video.url = item.url ? item.url : "Url Not Found!";
          (video.quality = item.qualityLabel || ""),
            (video.audioQuality = item.audioQuality),
            (video.mimetype = item.mimeType || "");
        });
        let audio = new Array();
        for (let i = 0; i < adaptiveFormats.length; i++) {
          audio.push({
            url: adaptiveFormats[i].url
              ? adaptiveFormats[i].url
              : "Url Not Found!",
            quality: adaptiveFormats[i].qualityLabel || "",
            audioQuality: adaptiveFormats[i].audioQuality,
            mimetype: adaptiveFormats[i].mimeType || "",
          });
        }
        let json = {
          videoId: videoId ?? "",
          url: baseUrl + videoId,
          title: title ?? "",
          duration: timeFormat(lengthSeconds) ?? "00:00",
          description: shortDescription ?? "",
          author: author ?? "",
          thumbnails: thumbnail?.thumbnails ?? "",
          views:
            {
              short:
                shortNumber(parseInt(viewCount?.replace(/[^0-9]/g, ""))) ?? "",
              large: viewCount?.replace(/[^0-9]/g, "") || "",
            } ?? "",
          seconds: lengthSeconds ?? 0,
          keywords: keywords ?? [],
          download: {
            audio: audio.filter((quality) => quality.audioQuality),
            video,
          },
        };
        res({ creator: "@21psycho", status: true, json });
      } catch (e) {
        res({ creator: "@21psycho", status: false, msg: e.message });
      }
    });
  }

  /**
   * TikTok
   * @param {*} url
   * @returns
   */

  get tiktok() {
    return new Promise(async (resolve) => {
      try {
        const cookies = await setTokenTikTok()
        const response = await axios.get(this.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
            "Cookie": cookies
          }
        });
        const html = response.data;
        const match = html.match(
          /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/s
        )[1];
        //const innerJsonString = match.slice(1, -1);
        //const properties = innerJsonString.match(/[^,{}[\]]+:[^,{}[\]]+/g)
        const json =
          JSON.parse(match).__DEFAULT_SCOPE__["webapp.video-detail"].itemInfo
            .itemStruct;
        resolve({ creator: "@21psycho", status: true, json });
      } catch (e) {
        resolve({ creator: "@21psycho", status: false, msg: e.message });
      }
    });
  }
};

/**
 * Get cookies
 * @returns
 */

async function setTokenTikTok() {
  try {
    const response = await axios.get(`https://www.tiktok.com/`, {
      header: {
        "User-Agent":
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
        "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
      },
    });
    const setCookie = response.headers["set-cookie"];
    return setCookie.reduce((acc, cookieStr) => {
      const [cookie] = cookieStr.split(";");
      const [key, value] = cookie.split("=");
      acc[key.trim()] = value.trim();
      return acc;
    }, {});
  } catch (e) {
    return new Error(e);
  }
}
