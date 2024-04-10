const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const _CONST = require("./app/config/constant");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

require("./app/models/createTables");

// Thay đổi kết nối cơ sở dữ liệu
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "submissionv2",
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
    } else {
        console.log("Connected to MySQL.");
    }
});

const authRoute = require("./app/routers/auth");
const userRoute = require("./app/routers/user");
const assetCategoryRoute = require("./app/routers/assetCategoryRoutes");
const assetsRoute = require("./app/routers/assetRoutes");
const vendorsRoute = require("./app/routers/vendorRoutes");
const notificationRoutes = require("./app/routers/notificationRoutes");
const residenceRulesRoutes = require("./app/routers/residenceRulesRoutes");
const contractsRoutes = require("./app/routers/contractsRouter");
const dashboardRouter = require("./app/routers/dashboardRouter");
const newsRouter = require("./app/routers/newsRouter");

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/assetCategory", assetCategoryRoute);
app.use("/api/assets", assetsRoute);
app.use("/api/vendors", vendorsRoute);
app.use("/api/notifications", notificationRoutes);
app.use("/api/residence-rules", residenceRulesRoutes);
app.use("/api/contracts", contractsRoutes);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/news", newsRouter);

const PORT = process.env.PORT || _CONST.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
