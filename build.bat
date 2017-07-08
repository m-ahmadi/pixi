set INP="./src"
set OUT="./dist"

rm -rf %OUT%
mkdir %OUT%\css %OUT%\js
cp %INP%/lib %INP%/images %INP%/fonts %OUT%/ -r

call > %INP%/html/links/root.htm
call > %INP%/html/scripts/root.htm
rem printf /static/ > %INP%/html/links/root.htm
rem printf /static/ > %INP%/html/scripts/root.htm

cmd /c htmlbilder %INP%/html/ -o %OUT%/index.html
cmd /c handlebars %INP%/templates/template/ -f %OUT%/lib/templates.js -e hbs -m -o
cmd /c handlebars %INP%/templates/partial/ -f %OUT%/lib/partials.js -p -e hbs -m -o
cmd /c babel %INP%/js/ -d %OUT%/js/ -s
cmd /c sass %INP%/sass/style.scss:%OUT%/css/style.css --style expanded --sourcemap=auto