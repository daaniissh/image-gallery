const express = require("express");
const cores  = require("cors");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const imageList = require("./imageDatabase.json");
const app = express();

app.use(cores());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();

    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

const upload = multer({ storage: storage });
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `Date: ${new Date()}, Method: ${req.method}, URl: ${req.url} \n`,
    (err) => {
      if (err) throw err;
      console.log("?", err);
      next();
    }
  );
});
app.get("/api/images", (req, res) => {
  res.json(imageList);
});
app.post("/api/upload", upload.single("upload_file"), (req, res) => {
  try {
    imageList.unshift({ id: uuidv4(), fileName: req.file.filename });
    fs.writeFileSync("./imageDatabase.json", JSON.stringify(imageList));
    res.status(200).json({ message: "image uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.sendStatus(200);
  }
});
app.all("*",(req,res)=>{
  res.json({
    message:"invalid url, try again"
  })
})
const port = 3001;
app.listen(port, () => {
  console.log("listening on port:3001");
});
