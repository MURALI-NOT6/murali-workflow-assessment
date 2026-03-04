import express from "express";
import bodyParser from "body-parser";
import fs from "fs/promises";
import path from "path";

const app = express();
app.use(bodyParser.json({ limit: "5mb" }));

const PORT = 4030;

app.post("/failed-incident", async (req, res) => {
    try {
        const payload = req.body;
        let items = Array.isArray(payload) ? payload : [payload];

        for (const item of items) {
            if (item && item.incidentId) {
                const filePath = path.join("fixtures", "incidents", `${item.incidentId}.json`);
                await fs.writeFile(filePath, JSON.stringify(item, null, 2), "utf-8");
            }
        }

        return res.status(200).json({ ok: true, message: "Saved failed incident(s) successfully" });
    } catch (error) {
        console.error("Error saving failed incident:", error);
        return res.status(500).json({ ok: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Failure storage service listening on http://localhost:${PORT}`);
});
