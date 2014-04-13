Github Backup
-------------

Send compressed archives to Github repositories on S3.

Pulls down the repo and related issues into a csv file. Pushes a tar file up to
Amazon S3.

Requires a pre-generated personal access token to exist in a file called
'token'.

Usage
-----

First, rename ```config.json.sample``` to ```config.json``` and add your
credentials.

Then: 
```node index.js <user> <repo>```

Dependencies
------------

```sudo apt-get install cmake libzip-dev build-essential libssl-dev```
