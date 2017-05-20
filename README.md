Topology Front
===================

### Building and Compiling:

npm install m-ahmadi/sway-cli -g

  1. *`cd topology-front`*
  2. Prepend *`sway`* to the command and run it.  
For example: *`sway sass`*


sway commands:

Command                         | Description
------------------------------- | ---------------------------------------------------------------------------------------
`html`           | Compile HTML.
`sass`           | Compile Sass.
`temp`           | Compile dynamic templates.
`js`             | Compile JavaScript.
`html-w`         | Watch HTML.
`sass-w`         | Watch Sass.
`temp-w`         | Watch dynamic templates.
`js-w`           | Watch JavaScript
`compile`        | Compile everything.
`live`           | Enable livereload for: dist/index.html, dist/css and dist/js
`env [name]`     | Show current environment, or change it.
`lib [which]`    | Build lib based on current environment.
`libs`           | Build all libs.
`build [env]`    | Build libs and compile. You can specify another env.
`release`        | Custom release.
`release-hard`   | Build and compile release-hard.
`sync`           | Sync the local Sway config with the global one.

npm run commands

Command                         | Description
------------------------------- | ---------------------------------------------------------------------------------------
`fakeData`       | Run fake data server on localhost:3000
    
    
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
