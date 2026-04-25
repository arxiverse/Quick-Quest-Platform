import fs from "fs"
import path from "path"

const distPath = path.resolve("dist")

function getFiles(dir) {

    let results = []

    const list = fs.readdirSync(dir)

    list.forEach(file => {

        const filePath = path.join(dir, file)

        const stat = fs.statSync(filePath)

        if (stat && stat.isDirectory()) {

            results = results.concat(getFiles(filePath))

        } else {

            results.push(
                filePath.replace(distPath, "")
            )

        }

    })

    return results

}

const files = getFiles(distPath)

const sw = `

const CACHE_NAME = "qqm-cache-v1"

const PRECACHE = ${JSON.stringify(files, null, 2)}

self.addEventListener("install", event => {

 event.waitUntil(

  caches.open(CACHE_NAME)

   .then(cache => cache.addAll(PRECACHE))

 )

})

self.addEventListener("activate", event => {

 event.waitUntil(

  caches.keys().then(keys =>

   Promise.all(

    keys
     .filter(k => k !== CACHE_NAME)
     .map(k => caches.delete(k))

   )

  )

 )

})

self.addEventListener("fetch", event => {

 if (event.request.method !== "GET") return

 event.respondWith(

  caches.match(event.request)

   .then(res => res || fetch(event.request))

 )

})

`

fs.writeFileSync(
    path.join(distPath, "sw.js"),
    sw
)

console.log("SW generated with", files.length, "files")