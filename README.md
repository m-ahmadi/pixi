Topology Front
===================


### Dev Commands

###### Go to project dir and run the following commands by prepending `npm run ` to them, for example:  
	`npm run sass`

Command                         | Description
------------------------------- | ---------------------------------------------------------------------------------------
`sass`                          | Compile sass files.
`html`                          | Build `index.html` from static templates.
`temp`                          | Precompile the dynamic Handlebars templates.
`js`                            | Compile js files.
`sass-w`                        | Watch sass
`html-w`                        | Watch html
`temp-w`                        | Watch temp
`js-w`                          | Watch js
`compile-all`                   | Compile everything.
`livereload`                    | Enable livereload for: `dist/index.html`, `dist/css` and `dist/js`
`env-debug-hard`                | Set current environment to debug-hard.
`env-debug-normal`              | Set current environment to debug-normal.
`env-debug-light`               | Set current environment to debug-light.
`env-release`                   | Set current environment to release-light.
`showenv`                       | Show current environment.
`libcss`                        | Build CSS dependencies based on current environment.
`libjs`                         | Build JS dependencies based on current environment.
`build-libs`                    | Build CSS and JS dependencies based on current environment.
`build`                         | Build dependencies and compile everything based on current environment.
`release`                       | Mr. Sadeghzadeh custom release.
`build-debug-hard`              | Build and compile everything according to `debug-hard` environment.
`build-debug-normal`            | Build and compile everything according to `debug-normal` environment.
`build-debug-light`             | Build and compile everything according to `debug-light` environment.
`build-release-light`           | Build and compile everything according to `release-light` environment.
`build-release-hard`            | Build and compile everything according to `release-hard` environment.
`fakeData`                      | Run fake data server on localhost:3000



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
