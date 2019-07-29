/**
 * Parses loading options -- called by music21_modules.js
 *
 */
import { debug } from './debug.js';
import * as common from './common.js';
import * as miditools from './miditools.js';
import * as tinyNotation from './tinyNotation.js';

export function runConfiguration() {
    let conf;
    // noinspection JSUnresolvedVariable
    if (typeof window.m21conf !== 'undefined') {
        // noinspection JSUnresolvedVariable
        conf = window.m21conf;
    } else {
        conf = loadConfiguration();
    }
    conf.warnBanner = (conf.warnBanner !== undefined) ? conf.warnBanner : warnBanner();
    conf.loadSoundfont = (conf.loadSoundfont !== undefined) ? conf.loadSoundfont : getM21attribute('loadSoundFont') || true;
    conf.renderHTML = (conf.renderHTML !== undefined) ? conf.renderHTML : getM21attribute('renderHTML');
    if (conf.renderHTML === undefined) {
        conf.renderHTML = true;
    }
    conf.m21basePath = getBasePath();

    fixUrls(conf);
    loadDefaultSoundfont(conf);
    renderHTML();
}

export function getBasePath() {
    let m21jsPath = getM21attribute('data-main');
    if (!m21jsPath) {
        m21jsPath = getM21attribute('src');
    }
    const m21basePath = common.pathSimplify(m21jsPath + '/../..');
    if (debug) {
        console.log('Music21 paths: base: ', m21basePath, '; js: ', m21jsPath);
    }
    return m21basePath;
}


export function fixUrls(conf) {
    if (!conf.m21basePath) {
        return;
    }
    for (const u of Object.keys(common.urls)) {
        common.urls[u] = common.pathSimplify(conf.m21basePath + common.urls[u]);
    }
}

/**
 * @returns undefined
 */
export function renderHTML() {
    if (!document) {
        return;
    }
    if (document.readyState === 'complete') {
        tinyNotation.renderNotationDivs();
    } else {
        window.addEventListener('load', () => {
            tinyNotation.renderNotationDivs();
        });
    }
}


export function loadDefaultSoundfont(conf) {
    if (!conf.loadSoundfont || (['no', 'false'].includes(conf.loadSoundfont))) {
        return undefined;
    }
    let instrument;
    if (conf.loadSoundfont === true) {
        instrument = 'acoustic_grand_piano';
    } else {
        instrument = conf.loadSoundfont;
    }
    return miditools.loadSoundfont(instrument);
}

/**
 *
 * @returns {{}}
 */
export function loadConfiguration() {
    const rawConf = getM21attribute('m21conf');
    if (!rawConf) {
        return {};
    }

    let m21conf;
    try {
        m21conf = JSON.parse(rawConf);
    } catch (e) {
        console.warn('Unable to JSON parse music21 configuration' + rawConf.toString() + ' into m21conf');
        m21conf = {};
    }
    return m21conf;
}

/**
 *
 * @param {string} [attribute=m21conf]
 * @returns {undefined|*|string}
 */
export function getM21attribute(attribute='m21conf') {
    // this is case insensitive.
    const scripts = document.getElementsByTagName('script');
    for (const s of Array.from(scripts)) {
        const scriptName = s.getAttribute('data-main') || s.getAttribute('src');
        if (scriptName && /music21/.test(scriptName)) {
            const thisValue = s.getAttribute(attribute) || s.getAttribute(attribute.toLowerCase());
            if (thisValue !== undefined) {
                return thisValue;
            }
        }
    }
    return undefined;
}

/**
 *
 * @returns {boolean}
 */
export function warnBanner() {
    return getM21attribute('warnBanner') !== 'no';
}
