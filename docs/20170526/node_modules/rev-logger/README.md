rev-logger
==============

Getting files revision numbers on git.

## install

### from npm

```
npm install rev-logger
```

### from github

```
git clone git://github.com/fnobi/rev-logger.git
```

## usage

### CLI

```
$ git log --oneline lib/RevLogger.js
6cc1c7a 該当dirまで移動してからgit
f43f0d8 EventEmitterいらない
198b7cb cli化
4ac98ec 移植
8f1b74a rehack.

$ rev-logger lib/RevLogger.js
5       lib/RevLogger.js

$ echo test >> lib/RevLogger.js
$ rev-logger lib/RevLogger.js
6       lib/RevLogger.js
```

### node.js

```javascript
const revLogger = new RevLogger({
    'script.js': 'js/script.js',
    'style.css': 'css/style.css'
});

console.log(revLogger.versions()); // => { 'script.js': 12, 'style.css': 18 }
```
