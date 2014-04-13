var git = require('nodegit'),
    tar = require('tar'),
    fstream = require('fstream'),
    zlib = require('zlib'),
    rimraf = require('rimraf'),
    AWS = require('aws-sdk'),
    config = require('./config.json'),
    async = require('async');

var userName = process.argv[2];
var repoName = process.argv[3];
var bucketName = process.argv[4];

if (!repoName || !userName || !bucketName) {
  console.log("\nProvide a user name, repo name and bucket name.\n");
  console.log("node index.js <user name> <repo name> <bucket name>\n")
  process.exit(1);
}

AWS.config.update({accessKeyId:config.awsAccessKeyId, secretAccessKey:config.awsSecretAccessKey})
var s3 = new AWS.S3();
var d = new Date().getTime();
var compressedFileName = repoName+d+".tar.gz"
var compressedFilePath = __dirname + "/tmp/compressed/"+compressedFileName;
var repoPath = "https://"+config.githubuser+":"+config.githubpw+"@github.com/"+userName+"/"+repoName+".git"

async.series([
  // checkout the repository, compress it
  function(callback){
    console.log("Cloning "+repoPath+"...\n");
    git.Repo.clone(repoPath, "tmp/"+repoName, null, function(err,repo){
    if (err) throw err; 
    console.log("Compressing file...");
    fstream.Reader({path:__dirname+"/tmp/"+repoName, type:"Directory"})
      .on("close", function(){
        console.log("Done compressing file.");
        callback()
      })
      .pipe(tar.Pack())
      .pipe(zlib.createGzip())
      .pipe(fstream.Writer(compressedFilePath))
    })
  },/*
  // cleanup the cloned repository
  function(callback){
    console.log("Deleting cloned repo...");
    rimraf(__dirname+"/tmp/"+repoName, function(){
      console.log("Deleted clone.");
      callback();
    })  
  },*/
  // upload file to s3
  function(callback){
    console.log("Sending file to S3...");
    var fileStream = fstream.Reader({path:compressedFilePath, type: "File"})
    s3.putObject({Bucket:bucketName,Key:compressedFileName, Body:fileStream}, function(err, data){
      if (err) {
        console.log("Upload error: "+err);
      } else {
        console.log("Done uploading to S3.");
      }
      callback(); 
    });
  },
  // cleanup the compressed file
  function(callback){
    console.log("Deleting compressed file...");
    rimraf(__dirname+"/tmp/compressed/", function(){
      console.log("Deleted compressed file.");
      callback();
    })  
  },

],function(err){
  if (err) console.log("Error!" + err);
  console.log("Done uploading and archiving repo: "+repoName+".");
  console.log("Archive name on S3 is: "+compressedFileName+".");
});
