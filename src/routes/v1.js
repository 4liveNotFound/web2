const { Router, query } = require("express");
const router = new Router();

const Album = require("../../lib/album");
const Search = require("../../lib/search");
const List = require("../../lib/list");
const Fetch = require("../../lib/fetch");

/**
 * YouTube
 * @param {*} q
 * @param {*} url
 * @returns
 */

router.get("/youtube/album", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json(`Parameter 'q' is required`);
  const response = await new Album(query).youtube;
  res.json(response);
});

router.get("/youtube/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json(`Parameter 'q' is required`);
  const response = await new Search(query).youtube;
  res.json(response);
});

router.get("/youtube/download", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json(`Parameter 'url' is required!`);
  const response = await new Fetch(url).youtube;
  res.json(response);
});

router.get("/youtube/list", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json(`Parameter 'q' is required`);
  const response = await new List(query).youtube;
  res.json(response);
});

/**
 * SoundCloud
 * @param {*} q
 * @param {*} url
 * @returns
 */

router.get("/soundcloud/list", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json(`Parameter 'q' is required`);
  const limit = req.query.limit;
  const response = await new List(query, limit).soundcloud;
  res.json(response);
});

router.get("/soundcloud/fetch", async (req, res) => {
  const url = req.query.url;
  const type = req.query.type;
  if (!url) return res.json(`Parameter 'url' is required!`);
  const response = await new Fetch(url, type).soundcloud;
  res.json(response);
});

/**
 * Aptoide
 * @param {*} q
 * @param {*} url
 * @returns
 */

router.get("/aptoide/list", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json(`Parameter 'q' is required`);
  const response = await new List(query).aptoide;
  res.json(response);
});

router.get("/aptoide/fetch", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json(`Parameter 'url' is required!`);
  const response = await new Fetch(url).aptoide;
  res.json(response);
});

/**
 * TikTok
 * @param {*} url
 * @returns
 */

router.get("/tiktok/fetch", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json(`Parameter 'url' is required!`);
  const response = await new Fetch(url).tiktok;
  res.json(response);
});

module.exports = router;
