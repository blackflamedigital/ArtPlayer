import { mergeDeep } from '../utils';
import zhCn from './zh-cn.json';
import zhTw from './zh-tw.json';
import pl from './pl.json';
import cs from './cs.json';

export default class I18n {
    constructor(art) {
        this.art = art;
        this.languages = {
            'zh-cn': zhCn,
            'zh-tw': zhTw,
            'pl': pl,
            'cs': cs,
        };
        this.init();
    }

    init() {
        const lang = this.art.option.lang.toLowerCase();
        this.language = this.languages[lang] || {};
    }

    get(key) {
        return this.language[key] || key;
    }

    update(value) {
        this.languages = mergeDeep(this.languages, value);
        this.init();
    }
}
