##Gulp build and sass compiler tool!

### setup

install npm with node.js (tested with v3.8.5)

install gulp globally (with admin console)

######$ npm install gulp -g

run in this dir:
######$ npm install

You can now run gulp!

### config.json

configure routing for the file structure.

##### SASS

Compiles the source SASS files to CSS on the fly.

SRC : source files to be compiled

DEST : destination of main.css

##### jsMin

This will minify the files from the concatinated js

SRC : must always be the output of the temp folder of js-concat

DEST : destination of app.min.js

##### jsConcat

This will put all the JS files into one large JS file.

SRC : the list of the files you want to include in the project, must always start with the libs

DEST : the output of the concatinated file. must be a TEMP dictory, will be deleted after minify.

### gulpfile.js

#### Commands:

##### 'gulp'
Will run the sass-compiler

##### 'gulp build'

Will create a build folder with main.css and app.min.js (Sass and JS will be compiled)

##### 'gulp serve'

Will reload the page everytime you change SCSS (anc compile to css), JS or HTML.


###coming...

##### 'Sprite maker'

will compile SVGS or PNGS to one sprite file and export coordinates + name.

#### 'full build'

Will make a full build package with all the html, js and sass in one folder.