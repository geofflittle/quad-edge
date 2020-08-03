#!/usr/bin/env node

import fs from "fs"
import http from "http"
import open from "open"
import path from "path"

const index = fs.readFileSync(path.join("assets", "index.html"))

console.log(index)

const server = http
    .createServer((req, res) => {
        res.writeHead(200, { "Content-Type": "text/html" })
        res.write(index)
        res.end()
    })
    .listen(8080)

;(async () => await open("http://localhost:8080"))()
