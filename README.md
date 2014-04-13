Github Backup
-------------

Send compressed archives of Github repositories to S3.

Currently pulls down a clone, not a mirror.

Pushes a gzipped tar file up to Amazon S3.

Usage
-----

First, rename ```config.json.sample``` to ```config.json``` and add your
credentials.

Then: 
```node index.js <user> <repo> <bucket name>```

Dependencies
------------

```sudo apt-get install cmake libzip-dev build-essential libssl-dev```
