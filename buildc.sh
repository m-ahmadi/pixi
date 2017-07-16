#!/bin/bash
PATH=$PATH:./node_modules/.bin
INP=./src
OUT=./release/static
HOUT=./release

rm -rf $OUT
mkdir $OUT/css $OUT/js -p
cp $INP/lib $INP/images $INP/fonts $OUT/ -r

printf "" > $INP/html/links/root.htm
printf "" > $INP/html/scripts/root.htm
printf /static/ > $INP/html/links/root.htm
printf /static/ > $INP/html/scripts/root.htm

htmlbilder $INP/html/ -o $HOUT/index.html
handlebars $INP/templates/template/ -f $OUT/lib/templates.js -e hbs -m -o
handlebars $INP/templates/partial/ -f $OUT/lib/partials.js -p -e hbs -m -o
babel $INP/js/ -d $OUT/js/ -s

if [ -x "$(command -v sass)" ]; then
	sass $INP/sass/style.scss:$OUT/css/style.css --style expanded --sourcemap=auto
else
	node-sass $INP/sass/style.scss > $OUT/css/style.css --output-style expanded --source-map true --indent-type tab --indent-width 1
fi