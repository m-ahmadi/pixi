declare let window: any;

import * as PIXI   from 'pixi.js';
import * as $      from 'jquery';

window.jQuery     = $;
import * as UIkit  from 'uikit';

import util        from './util';
import newPubSub   from './pubsub';
import wpix        from './wpix';
import tpl         from './tpl';
import mediator    from './mediator';
import wani        from './wani';
import navigation  from './navigation';
import traceroute  from './traceroute';
import { onReady } from './page';


window.$          = $;

window.util       = util;
window.newPubSub  = newPubSub;
window.wpix       = wpix;
window.tpl        = tpl
window.mediator   = mediator;
window.wani       = wani;
window.navigation = navigation;
window.traceroute = traceroute;

onReady(mediator.init);
