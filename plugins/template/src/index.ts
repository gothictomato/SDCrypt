import { logger } from "@vendetta";
import Settings from "./Settings";

let localStorage;
let iframe;
const CspDisarmed = true;
let Initialized = false;
let Loaded = false;

var InitPromise;

export default {
    onLoad: () => {
        if(!Initialized) {
            iframe = document.createElement('iframe');
            iframe.style.display = 'none';
    
            iframe.onload = () => {
                iframe.contentDocument.body.innerHTML = "<iframe/>";
                localStorage = Object.getOwnPropertyDescriptor(iframe.contentDocument.body.children[0].__proto__, 'contentWindow').get.apply(iframe).localStorage;
    
                require('https').get("https://github.com/gothictomato/cryptcoord/raw/master/SimpleDiscordCrypt.user.js", (response) => {
                    let data = [];
                    response.on('data', (chunk) => data.push(chunk));
                    response.on('end', () => eval(typeof data[0] === 'string' ? data.join("") : Buffer.concat(data).toString()));
                });
            };
            document.body.appendChild(iframe);
    
            Initialized = true;
        }
        else if(!Loaded && InitPromise) {
            InitPromise.then(({Load}) => {
                Load();
                Loaded = true;
            });
        }
    },
    onUnload: () => {
        if(!Initialized) return;

        if(Loaded && InitPromise) {
            InitPromise.then(({Unload}) => {
                Unload();
                Loaded = false;
            });
        }
    },
    settings: Settings,
}
