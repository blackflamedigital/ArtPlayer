import flip from './flip';
import aspectRatio from './aspectRatio';
import playbackRate from './playbackRate';
import subtitleOffset from './subtitleOffset';
import Component from '../utils/component';
import { append, addClass, setStyle, inverseClass, includeFromEvent, def, has } from '../utils';

function makeRecursion(option, parentItem, parentList) {
    for (let index = 0; index < option.length; index++) {
        const item = option[index];
        item.$parentItem = parentItem;
        item.$parentList = parentList;
        if (item.selector) {
            makeRecursion(item.selector, item, option);
        }
    }
    return option;
}

function isStringOrNumber(val) {
    return ['string', 'number'].includes(typeof val);
}

export default class Setting extends Component {
    constructor(art) {
        super(art);

        const {
            option,
            events: { proxy },
            template: { $setting, $player },
        } = art;

        this.name = 'setting';
        this.$parent = $setting;

        this.option = [];
        this.events = [];
        this.cache = new Map();

        if (option.setting) {
            if (option.playbackRate) {
                this.option.push(playbackRate(art));
            }

            if (option.aspectRatio) {
                this.option.push(aspectRatio(art));
            }

            if (option.flip) {
                this.option.push(flip(art));
            }

            if (option.subtitleOffset) {
                this.option.push(subtitleOffset(art));
            }

            for (let index = 0; index < option.settings.length; index++) {
                this.option.push(option.settings[index]);
            }

            this.option = makeRecursion(this.option);

            this.init(this.option);

            art.on('blur', () => {
                if (this.show) {
                    this.show = false;
                    this.init(this.option);
                }
            });

            proxy($player, 'click', (event) => {
                if (
                    this.show &&
                    !includeFromEvent(event, art.controls.setting) &&
                    !includeFromEvent(event, this.$parent)
                ) {
                    this.show = false;
                    this.init(this.option);
                }
            });
        }
    }

    add(callback) {
        if (typeof callback === 'function') {
            this.option.push(callback(this.art));
        } else {
            this.option.push(callback);
        }

        this.cache = new Map();
        this.events.forEach((event) => event());
        this.events = [];
        this.$parent.innerHTML = '';
        this.option = makeRecursion(this.option);
        this.init(this.option);
    }

    creatHeader(item) {
        const {
            icons,
            events: { proxy },
        } = this.art;

        const $item = document.createElement('div');
        addClass($item, 'art-setting-item');
        addClass($item, 'art-setting-item-back');
        const $left = append($item, '<div class="art-setting-item-left"></div>');
        const $icon = document.createElement('div');
        addClass($icon, 'art-setting-item-left-icon');
        append($icon, icons.arrowLeft);
        append($left, $icon);
        append($left, item.$parentItem.html);

        const event = proxy($item, 'click', () => {
            this.init(item.$parentList);
        });

        this.events.push(event);

        return $item;
    }

    creatItem(type, item) {
        const {
            icons,
            events: { proxy },
        } = this.art;

        const $item = document.createElement('div');
        addClass($item, 'art-setting-item');

        if (isStringOrNumber(item.name)) {
            $item.dataset.name = item.name;
        }

        if (isStringOrNumber(item.value)) {
            $item.dataset.value = item.value;
        }

        const $left = append($item, '<div class="art-setting-item-left"></div>');
        const $right = append($item, '<div class="art-setting-item-right"></div>');

        const $icon = document.createElement('div');
        addClass($icon, 'art-setting-item-left-icon');

        switch (type) {
            case 'switch':
            case 'range':
                append($icon, isStringOrNumber(item.icon) || item.icon instanceof Element ? item.icon : icons.config);
                break;
            case 'selector':
                if (item.selector && item.selector.length) {
                    append(
                        $icon,
                        isStringOrNumber(item.icon) || item.icon instanceof Element ? item.icon : icons.config,
                    );
                } else {
                    append($icon, icons.check);
                }
                break;
            default:
                break;
        }

        append($left, $icon);
        item.$icon = $icon;

        def(item, 'icon', {
            configurable: true,
            get() {
                return $icon.innerHTML;
            },
            set(value) {
                if (isStringOrNumber(value)) {
                    $icon.innerHTML = value;
                }
            },
        });

        const $html = document.createElement('div');
        addClass($html, 'art-setting-item-left-text');
        append($html, item.html || '');
        append($left, $html);
        item.$html = $html;

        def(item, 'html', {
            configurable: true,
            get() {
                return $html.innerHTML;
            },
            set(value) {
                if (isStringOrNumber(value)) {
                    $html.innerHTML = value;
                }
            },
        });

        const $tooltip = document.createElement('div');
        addClass($tooltip, 'art-setting-item-right-tooltip');
        append($tooltip, item.tooltip || '');
        append($right, $tooltip);
        item.$tooltip = $tooltip;

        def(item, 'tooltip', {
            configurable: true,
            get() {
                return $tooltip.innerHTML;
            },
            set(value) {
                if (isStringOrNumber(value)) {
                    $tooltip.innerHTML = value;
                }
            },
        });

        switch (type) {
            case 'switch': {
                const $state = document.createElement('div');
                addClass($state, 'art-setting-item-right-icon');
                const $switchOn = append($state, icons.switchOn);
                const $switchOff = append($state, icons.switchOff);
                setStyle(item.switch ? $switchOff : $switchOn, 'display', 'none');
                append($right, $state);
                item.$switch = item.switch;

                def(item, 'switch', {
                    configurable: true,
                    get() {
                        return item.$switch;
                    },
                    set(value) {
                        item.$switch = value;
                        if (value) {
                            setStyle($switchOff, 'display', 'none');
                            setStyle($switchOn, 'display', null);
                        } else {
                            setStyle($switchOff, 'display', null);
                            setStyle($switchOn, 'display', 'none');
                        }
                    },
                });
                break;
            }
            case 'range':
                {
                    const $state = document.createElement('div');
                    addClass($state, 'art-setting-item-right-icon');
                    const $range = append($state, '<input type="range">');
                    $range.value = item.range[0] || 0;
                    $range.min = item.range[1] || 0;
                    $range.max = item.range[2] || 10;
                    $range.step = item.range[3] || 1;
                    addClass($range, 'art-setting-range');
                    append($right, $state);
                    item.$range = $range;

                    def(item, 'range', {
                        configurable: true,
                        get() {
                            return $range.valueAsNumber;
                        },
                        set(value) {
                            $range.value = Number(value);
                        },
                    });
                }
                break;
            case 'selector':
                if (item.selector && item.selector.length) {
                    const $state = document.createElement('div');
                    addClass($state, 'art-setting-item-right-icon');
                    append($state, icons.arrowRight);
                    append($right, $state);
                }
                break;
            default:
                break;
        }

        switch (type) {
            case 'switch': {
                if (item.onSwitch) {
                    const event = proxy($item, 'click', async (event) => {
                        item.switch = await item.onSwitch.call(this.art, item, $item, event);
                    });

                    this.events.push(event);
                }
                break;
            }
            case 'range': {
                if (item.onRange && item.$range) {
                    const event = proxy(item.$range, 'change', async (event) => {
                        item.tooltip = await item.onRange.call(this.art, item, $item, event);
                    });

                    this.events.push(event);
                }
                break;
            }
            case 'selector':
                {
                    const event = proxy($item, 'click', async (event) => {
                        if (item.selector && item.selector.length) {
                            this.init(item.selector, item.width);
                        } else {
                            inverseClass($item, 'art-current');

                            if (item.$parentList) {
                                this.init(item.$parentList);
                            }

                            if (item.$parentItem && item.$parentItem.onSelect) {
                                const result = await item.$parentItem.onSelect.call(this.art, item, $item, event);
                                if (item.$parentItem.$tooltip && isStringOrNumber(result)) {
                                    item.$parentItem.$tooltip.innerHTML = result;
                                }
                            }
                        }
                    });

                    this.events.push(event);

                    if (item.default) {
                        addClass($item, 'art-current');
                    }
                }
                break;
            default:
                break;
        }

        return $item;
    }

    init(option, width) {
        const { constructor } = this.art;

        if (this.cache.has(option)) {
            const $panel = this.cache.get(option);
            inverseClass($panel, 'art-current');
            setStyle(this.$parent, 'width', `${$panel.dataset.width}px`);
            setStyle(this.$parent, 'height', `${$panel.dataset.height}px`);
        } else {
            const $panel = document.createElement('div');
            addClass($panel, 'art-setting-panel');
            $panel.dataset.width = width || constructor.SETTING_WIDTH;
            $panel.dataset.height = option.length * constructor.SETTING_ITEM_HEIGHT;

            if (option[0] && option[0].$parentItem) {
                append($panel, this.creatHeader(option[0]));
                $panel.dataset.height = Number($panel.dataset.height) + constructor.SETTING_ITEM_HEIGHT;
            }

            for (let index = 0; index < option.length; index++) {
                const item = option[index];
                if (has(item, 'switch')) {
                    append($panel, this.creatItem('switch', item));
                } else if (has(item, 'range')) {
                    append($panel, this.creatItem('range', item));
                } else {
                    append($panel, this.creatItem('selector', item));
                }
            }

            append(this.$parent, $panel);
            this.cache.set(option, $panel);
            inverseClass($panel, 'art-current');
            setStyle(this.$parent, 'width', `${$panel.dataset.width}px`);
            setStyle(this.$parent, 'height', `${$panel.dataset.height}px`);

            if (option[0] && option[0].$parentItem && option[0].$parentItem.mounted) {
                option[0].$parentItem.mounted.call(this.art, $panel, option[0].$parentItem);
            }
        }
    }
}
