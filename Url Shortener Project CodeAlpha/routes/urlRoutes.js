import express from "express";
const router = express.Router();
import { nanoid } from 'nanoid';
import { createShortUrl, redirect } from "../controllers/urlcontroller.js";
import Cookies from "cookies";


router.get("/", (req, res) => {
  res.render("index", {
    shortUrl: null,      // <== send default empty value
    message: null
  });
res.clearCookie("token");
});


router.post("/shorten", createShortUrl);
router.get("/:shortid",redirect)


export default router;
