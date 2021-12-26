import { rtc_description, rtc_list } from "../../src/store";


export function load_rtc(cdn_desc:rtc_list) {
    Object.keys(cdn_desc).forEach(peer => {
        new rtc_requester(cdn_desc[peer]);
    })
}

class rtc_requester {
    constructor (desc:rtc_description) {
        
    }
}