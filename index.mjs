"use strict";
import fs from "fs";

const query = fs.readFileSync("TopLanguagesQuery.gql", "utf-8");
const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: `{ "query": ${JSON.stringify(query)}`,
    headers: { 'Authorization': `Bearer ${process.argv[2]}` }
}).then(async res => await res.json());
let languages = new Map();

for (const node of response.data.user.repositories.nodes) {
    for (const edge of node.languages.edges) {
        languages.set(edge.node.name, {
            size: edge.size + (languages.get(edge.node.name) ? languages.get(edge.node.name).size : 0),
            color: edge.node.color
        });
    }
}
fs.writeFileSync("LanguageData.json", JSON.stringify(new Map([...languages].sort((a, b) => b[1].size - a[1].size)), (_key, value) => value instanceof Map ? [...value] : value, 4));