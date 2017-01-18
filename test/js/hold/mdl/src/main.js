import util       from './util';
import coPubsub   from './pubsub';
import pixi       from './pixi';
import tpl        from './tpl';
import mediator from './mediator';
import {onready}  from './page';


window.util     = util;
window.coPubsub = coPubsub;
window.pixi     = pixi;
window.tpl      = tpl
window.mediator = mediator;
window.ready    = onready;

onready( mediator.init );