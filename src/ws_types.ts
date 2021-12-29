export interface ws_message {
    type: string;
    body: any;
}
export interface register_info {
    rtc_config: RTCSessionDescriptionInit;
    files: string[];
}
export interface rtc_answer {
    uuid: string;
    answer: object;
}
export interface rtc_ice {
    uuid: string;
    canidate: object;
}
export interface rtc_offer {
    uuid: string;
    offer: object;
}
