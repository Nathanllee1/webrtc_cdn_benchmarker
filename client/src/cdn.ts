import { cdn_description } from "../../src/store";
import { fileStorage, storage } from "./index";

export function load_cdn(files: cdn_description[], local_files:storage) {
    files.forEach(async (file) => {

        const start_time = new Date().getTime();

        let data = await fetch(file.cdn_url);
        let blob_obj = await data.blob();

        document.getElementById(`rtc_cdn_${file.filename}`)
            .setAttribute("src", URL.createObjectURL(blob_obj))

        console.log(`${file.filename} loaded in ${new Date().getTime() - start_time} ms (${blob_obj.size / 1000000} mb) over CDN`)

        local_files.add_file(file.filename, blob_obj);

    })

    return Promise.resolve();
}