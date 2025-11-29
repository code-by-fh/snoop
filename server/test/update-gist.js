import fs from "fs";
import path from "path";

const GIST_ID = process.env.GIST_ID;
const GIST_TOKEN = process.env.GIST_TOKEN;

if (!GIST_TOKEN) {
    throw new Error("GIST_TOKEN not set");
}

const statusPath = path.resolve("test/provider/status.json");
const platformStatus = JSON.parse(fs.readFileSync(statusPath, "utf8"));

let md = "## Plattformstatus\n\n| Plattform | Status |\n|----------|--------|\n";
for (const [platform, ok] of Object.entries(platformStatus)) {
    const color = ok ? "green" : "red";
    const text = ok ? "ok" : "failed";
    md += `| ${platform} | ![](https://img.shields.io/badge/${text}-${color}) |\n`;
}

const body = {
    files: {
        "SNOOP_PROVIDER_STATUS.md": { content: md }
    }
};

const url = GIST_ID
    ? `https://api.github.com/gists/${GIST_ID}`
    : `https://api.github.com/gists`;

const method = GIST_ID ? "PATCH" : "POST";

fetch(url, {
    method,
    headers: {
        Authorization: `token ${GIST_TOKEN}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
})
    .then(res => res.json())
    .then(json => {
        console.log("Gist updated:", json.html_url);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
