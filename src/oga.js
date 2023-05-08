import { rejects } from "assert"
import axios from "axios"
import Ffmpeg from "fluent-ffmpeg"
import installer from '@ffmpeg-installer/ffmpeg'
import { createWriteStream } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { removeFile } from "./utils.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

class OgaConverter {
    constructor() {
        Ffmpeg.setFfmpegPath(installer.path)
    }

    toMp3(input, output) {
        try {
            const outputPath = resolve(dirname(input), `${output}.mp3`)
            return new Promise((resolve, rejects) => {
                Ffmpeg(input)
                    .inputOption('-t 30')
                    .output(outputPath)
                    .on('end', () => {
                        removeFile(input)
                        resolve(outputPath)
                    })
                    .on('error', err => rejects(err.message))
                    .run()
            })
        } catch (e) {
            console.log('Error while create creating mp3', e.message)
        }
    }

    async create(url, filename) {
        try {
            const ogaPath = resolve(__dirname, '../voices', `${filename}.oga`)
            const response = await axios({
                method: 'get',
                url,
                responseType: "stream",
            })
            return new Promise(resolve => {
                const stream = createWriteStream(ogaPath)
                response.data.pipe(stream)
                stream.on('finish', () => resolve(ogaPath))
            })
        } catch (e) {
            console.log('Error while create creating oga', e.message)
        }
    }
}

export const oga = new OgaConverter()