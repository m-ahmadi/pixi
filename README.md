Topology Front
===================

***
### Documentation Page
In order to see the documentation page:

*Clone the repository:*
```shell
git clone git@repo.ravanertebat.com:cvas/topology-front.git
```
* The documentation page is inside the `docs` folder.
* You can view it correctly by serving the this folder over with a web-server.
* If you go to this folder and just open the `index.html` file, you won't see the page correctly.
* Either clone the repository inside a web-server public folder, or copy the `docs` folder to the web-server public folder.

*http://server-address/topology-front/docs*

*for example: http://127.0.0.1:3000/topology-front/docs*

***
### Dev Commands

Command                         | What it does                                                 | When it should be run
------------------------------- | -------------------------------------------------------------|--------------------------
`npm run compile-js`            | compile js files                                             | After any changes to: `src/js/app/`
`npm run compile-js-watch`      | compile js files and watch                                   | 
`npm run compile-sass`          | compile sass files                                           | After any changes to: `src/sass/`
`npm run compile-sass-watch`    | compile sass files and  watch                                | 
`npm run compile-temps`         | compile dynamic templates                                    | After any changes to: `src/template/`
`npm run compile-temps-watch`   | compile dynamic templates and watch                          | 
`npm run build-html`            | compile static templates                                     | After any changes to: `src/html/`
`npm run build-html-watch`      | compile static templates and watch                           | 
`npm run compile-all`           | compile everything                                           | 
`npm run setenv-debug`          | set environment to debug                                     | 
`npm run setenv-release`        | set environment to release                                   | 
`npm run setenv-release-custom` | set environment to custom-release                            | 
`npm run livereload`            | livereload `dist/index.html`, `dist/css` and `dist/js`       | You want livereload enabled.