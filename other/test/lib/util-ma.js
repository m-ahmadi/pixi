if (typeof Object.create !== "function") {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}
if (typeof Object.keys !== "function") {
    Object.keys = function (o) {
        var keys = [],
            k;
        for (k in o) {
            if ( o.hasOwnProperty(k) ) {
                keys.push(k);
            }
        }
        return keys;
    };
}
if (typeof Array.prototype.forEach !== "function") {
    Array.prototype.forEach = function (c, t) {
        var o, len, k, kVal;
        if (this !== null) {
            o = Object(this);
            len = o.length >>> 0;
            if (typeof c === "function") {
                k = 0;
                while (k < len) {
                    if (k in o) {
                        kVal = o[k];
                        c.call(t, kVal, k, o);
                    }
                    k += 1;
                }
            }
        }
    };
}
(function (exported) {
    if (typeof define === "function" && define.amd) {
        define(exported);
    } else if (typeof process !== "undefined" &&
               typeof process.versions.node !== "undefined") {
        module.exports = exported;
    } else {
        window.u = exported;
    }
}((function () {
    function isObj(v) {
        return (
            v &&
            typeof v === "object" &&
            typeof v !== null &&
            Object.prototype.toString.call(v) === "[object Object]"
        ) ? true : false;
    }
    function isArr(v) {
        if ( typeof Array.isArray === "function" ) {
            return Array.isArray(v);
        } else {
            return (
                v &&
                typeof v === "object" &&
                typeof v.length === "number" &&
                typeof v.splice === "function" &&
                !v.propertyIsEnumerable("length") &&
                Object.prototype.toString.call(v) === "[object Array]"
            ) ? true : false;
        }
    }
    function getArgs(a) {
        var args = new Array(a.length),
            i;
        for (i=0; i<args.length; i+=1) {
            args[i] = a[i];
        }
        return args;
    }
    function moveArrItem(a, f, t) { // array, from, to
        a.splice( t, 0, a.splice(f, 1)[0] );
    }
    function isInt(n) {
        return isNum(n)  &&  n % 1 === 0;
    }
    function negateNum(n) {
        return isNum(n) ? Math.abs(n) * -1 : undefined;
    }
    function positNum(n) {
        return isNum(n) ? Math.abs(n) : undefined;
    }
    function reverseNumSign(n) {
        if ( isNum(n) ) {
            if (n > 0) {
                return negateNum(n);
            } else if (n < 0) {
                return positNum(n);
            }
        }
    }
    function isNumOdd(n) {
        return isNum(n)  &&  (n % 2) ? true : false;
    }
    function randInt(min, max) { // default between 0 and 10
        min = min ? Math.ceil(min) : 0;
        max = max ? Math.floor(max) : 10;
        return Math.floor(Math.random() * (max - min)) + min;
    }
    function randFloat(min, max) { // default between 0 and 10
        min = min ? min : 0;
        max = max ? max : 10;
        return Math.random() * (max - min) + min;
    }
    function toDecimalPlace(n, p) {
        return isNum(n) ? parseFloat( n.toFixed(p) ) : undefined;
    }
    function isEmptyObj(o) {
        var k;
        if ( isObj(o) ) {
            if ( typeof Object.getOwnPropertyNames === "function" ) {
                return Object.getOwnPropertyNames(o).length === 0; // ES5
            } else {
                for ( k in o ) {
                    if (  o.hasOwnProperty( k )  ) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }
    function isFn(v) {
        return typeof v === "function";
    }
    function isStr(v) {
        return typeof v === "string";
    }
    function isNum(v) {
        return typeof v === "number" && !isNAN(v);
    }
    function isNAN(v) {
        if (typeof Number.isNaN === "function") {
            return Number.isNaN(v);
        } else if (typeof isNaN === "function") {
            return (
                !isObj(v) &&
                !isStr(v) &&
                !isUndef(v) &&
                !isArr(v) &&
                isNaN(v)
            );
        } else {
            return v !== NaN ? false : true;
        }
    }
    function isBool(v) {
        return typeof v === "boolean";
    }
    function isUndef(v) {
        return typeof v === "undefined";
    }
    function isNull(v) {
        return typeof v === "object" && v === null;
    }
    function isEmptyStr(v) {
        return typeof v === "string"  &&  v.length === 0;
    }
    function objLength(o) {
        if ( isObj(o) ) {
            return Object.keys(o).length;
        }
    }
    function substrBeforeLast(c, s) {
        return isStr(c) && isStr(s) ? s.substr( 0, s.lastIndexOf(c) ) : false;
    }
    function substrAfterLast(c, s) {
        return isStr(c) && isStr(s) ? s.substring(s.lastIndexOf(c) + 1) : false;
    }
    function substrBeforeFirst(c, s) {
        return isStr(c) && isStr(s) ? s.substr( 0, s.indexOf(c) ) : false;
    }
    function substrAfterFirst(c, s) {
        return isStr(c) && isStr(s) ? s.substring(s.indexOf(c) + 1) : false;
    }
    function extend() {
        var args = getArgs(arguments),
            len = args.length,
            arr = [],
            objects = [],
            first, last,
            result;

        if (len === 1) {
            first = args[0];
            if ( isArr(first)  &&  first.length > 1 ) {
                last = first.pop();
                objects = first;
            } else if ( isObj(first) ){
                result = Object.create(first);
            }
        } else if (len === 2) {
            first = args[0];
            last = args[len-1];
            if ( isObj(first) ) {
                result = Object.create(first);
            }
        } else if (len > 2) {
            last = args.pop();
            objects = args;
        }

        if (objects.length !== 0) {
            arr.push( {} );
            objects.forEach(function (el, i) {
                if ( isObj(el) ) {
                    Object.keys(el).forEach(function (k) {
                        arr[i][k] = el[k];
                    });
                    arr.push( Object.create(arr[i]) );
                }
            });
            result = arr[arr.length-1];
        }

        if ( last && isObj(last) ) {
            Object.keys(last).forEach(function(key) {
                result[key] = last[key];
            });
        }
        return result;
    }
    function noJq() {
        return typeof jQuery === "undefined" && typeof $ === "undefined";
    }
    function getCommentsInside(selector) {
        if ( noJq() ) { return; }
        return $(selector).contents().filter( function () { return this.nodeType === 8; } );
    }
    function getFirstCommentInside(selector) {
        if ( noJq() ) { return; }
        return getCommentsInside(selector)[0].nodeValue.trim();
    }
    function getEls(root, obj) {
        if ( noJq() || (!root && !obj) ) { return; }
        var o = {},
            el, els;
        if ( isStr(root) ) {
            o.root = $(root);
            el = $(root+" [data-el]");
            els = $(root+" [data-els]");
        } else if (root instanceof jQuery) {
            o.root = root;
            el = root.find("[data-el]");
            els = root.find("[data-els]");
        }
        el.each(function (i, domEl) {
            var j = $(domEl);
            o[ j.data("el") ] = j;
        });
        els.each(function (i, domEl) {
            var j = $(domEl);
            var ks = j.data("els").split(" ");
            ks.forEach(function (k) {
                if (!o[k]) {
                    o[k] = $(root+" [data-els~="+k+"]");
                }
            });
        });
        if (obj) {
            obj = o;
        } else {
            return o;
        }
    }

    return {
        isObj: isObj,
        isArr: isArr,
        getArgs: getArgs,
        moveArrItem: moveArrItem,
        isInt: isInt,
        negateNum: negateNum,
        positNum: positNum,
        reverseNumSign: reverseNumSign,
        isNumOdd: isNumOdd,
        randInt: randInt,
        randFloat: randFloat,
        toDecimalPlace: toDecimalPlace,
        isEmptyObj: isEmptyObj,
        isFn: isFn,
        isStr: isStr,
        isNum: isNum,
        isNAN: isNAN,
        isBool: isBool,
        isUndef: isUndef,
        isNull: isNull,
        isEmptyStr: isEmptyStr,
        objLength: objLength,
        substrBeforeLast: substrBeforeLast,
        substrAfterLast: substrAfterLast,
        substrBeforeFirst: substrBeforeFirst,
        substrAfterFirst: substrAfterFirst,
        extend: extend,
        // jQuery:
        getCommentsInside: getCommentsInside,
        getFirstCommentInside: getFirstCommentInside,
        getEls: getEls
    };
}())));
