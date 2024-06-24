const axios = require("axios");

const search = async (query, ogq) => {
  const base = "https://www.youtube.com/results";

  const options = {
    app: "desktop",
    search_query: query,
  };

  try {
    const response = await axios.get(base, { params: options });
    const html = response.data;

    const findInitialData = html.match(/var ytInitialData = {(.*?)};/g)[0];
    const fixData = findInitialData.replace(/var ytInitialData = /g, "");
    const initialData = JSON.parse(fixData.slice(0, -1));

    let data =
      initialData.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents;
    let index,
      confirm = false;
    for (let i = 0; i < data.length; i++) {
      if (confirm) break;
      if (data[i].hasOwnProperty("itemSectionRenderer")) {
        for (let j = 0; j < data[i].itemSectionRenderer.contents.length; j++) {
          if (
            data[i].itemSectionRenderer.contents[j].hasOwnProperty(
              "videoRenderer"
            )
          ) {
            index = i;
            confirm = true;
            break;
          }
        }
      }
    }

    if (
      typeof data[index] === "object" &&
      data[index].hasOwnProperty("itemSectionRenderer")
    ) {
      data = data[index].itemSectionRenderer.contents;
      return data;
    } else {
      throw new Error(`No results were found for search query '${ogq}'.`);
    }
  } catch (error) {
    throw new Error(`Error searching for query '${ogq}': ${error.message}`);
  }
};

const fetch = async (enlace) => {
  try {
    const response = await axios.get(enlace);
    const html = response.data;
    const matchHtml = html.match(/var ytInitialPlayerResponse = {(.*?)};/g)[0];
    const replaceHtml = matchHtml.replace(
      /var ytInitialPlayerResponse = /g,
      ""
    );
    let data = JSON.parse(replaceHtml.slice(0, -1));
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

const album = async (enlace) => {
  try {
    const response = await axios.get(enlace);
    const html = response.data;
    const htmlMatch = html.match(/var ytInitialData = {(.*?)};/g)[0];
    const replaceHtml = htmlMatch.replace(/var ytInitialData = /, "");
    const initialData = JSON.parse(replaceHtml.slice(0, -1));
    let data = initialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents
    return data
  } catch(e) {
    throw new Error(e.message)
  }
}

module.exports = {
  search,
  fetch,
  album
};
