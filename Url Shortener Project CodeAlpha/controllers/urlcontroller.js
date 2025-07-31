
import { nanoid } from "nanoid";
import Url from "../models/url.js";
import jwt from "jsonwebtoken";



export const createShortUrl = async (req, res) => {
  const { originalUrl } = req.body;

  try {
    let existing = await Url.findOne({ longUrl: originalUrl });
    if (existing) {
      const token = jwt.sign(
        { url: originalUrl },       // payload
        process.env.Jwtkey,     // secret key
        { algorithm: "HS256", expiresIn: "1h" }  
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,        
        sameSite: "Strict",  
        maxAge: 3600000      // 1 hour
      });
      return res.render("index", {
        shortUrl: `${req.headers.host}/${existing.shortid}`,
        message: "URL already shortened.",
        clicks: existing.clicks,
        createdAt: existing.createdAt
      });
    }



    const newShortId = nanoid(6);

    const newUrl = await Url.create({
      longUrl: originalUrl,
      shortid: newShortId
    });

    res.render("index", {
      shortUrl: `${req.headers.host}/${newShortId}`,
      message: "Short URL created successfully!",
      createdAt: newUrl.createdAt
    });



    const token = jwt.sign(
      { url: originalUrl },      
      process.env.Jwtkey,     
      { algorithm: "HS256", expiresIn: "1h" }  
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // only over HTTPS
      sameSite: "Strict",  // or 'Lax' for limited cross-site
      maxAge: 3600000      // 1 hour
    });



  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const redirect = async (req, res) => {
  const { shortid } = req.params;
  const urlEntry = await Url.findOne({ shortid });

  if (!urlEntry) {
    return res.status(404).send('Short URL not found');
  }

  urlEntry.clicks++;
  await urlEntry.save();

  console.log(urlEntry.clicks)

  res.redirect(urlEntry.longUrl);
};

