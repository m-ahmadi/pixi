declare let window: any;

import util        from './util';
import PubSub      from './PubSub';
import wpix        from './wpix';
import tpl         from './tpl';
import mediator    from './mediator';
import wani        from './wani';
import navigation  from './navigation';
import traceroute  from './traceroute';
import page        from './page';

import TwoPointLine from './wpix/TwoPointLine'
window.TwoPointLine = TwoPointLine;

module containerManager {
    export function asad() {
        console.log(util);
        return  2;

    }
}


window.b = containerManager;

window.util       = util;
window.PubSub     = PubSub;
window.wpix       = wpix;
window.wani       = wani;
window.tpl        = tpl;
window.navigation = navigation;
window.traceroute = traceroute;
window.mediator   = mediator;


page.onReady( mediator.init );