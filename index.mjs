"use strict";
import fs from "fs";

const query = fs.readFileSync("TopLanguagesQuery.gql", "utf-8");
const getResponse = async (cursor = null) => (await fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: `{ "query": ${JSON.stringify(query)}, "variables": { "cursor": ${JSON.stringify(cursor)}}`,
    headers: { 'Authorization': `Bearer ${process.argv[2]}` }
}).then(async res => await res.json())).data.user.repositories;
let response = await getResponse();
let repos = response.nodes;
while (response.pageInfo.hasNextPage) {
    response = await getResponse(response.pageInfo.endCursor);
    repos.push(...response.nodes);
}
let languages = new Map();
for (const node of repos) {
    for (const edge of node.languages.edges) {
        languages.set(edge.node.name, {
            size: edge.size + (languages.get(edge.node.name) ? languages.get(edge.node.name).size : 0),
            color: edge.node.color
        });
    }
}
fs.writeFileSync("LanguageData.json", JSON.stringify(Object.fromEntries([...languages].sort((a, b) => b[1].size - a[1].size)), null, 4));