Github Backup
-------------

Send compressed archives of Github repositories to S3.

Currently pulls down a clone, not a mirror.

Does NOT include issues (yet).

Pushes a gzipped tar file up to Amazon S3.

Usage
-----

First, rename ```config.json.sample``` to ```config.json``` and add your
credentials.

Then: 
```node index.js <user> <bucket> <repo>```

Dependencies
------------

```sudo apt-get install cmake libzip-dev build-essential libssl-dev```
