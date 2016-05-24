#!/usr/bin/env node

// Add Platform Class
// v1.0
// Automatically adds the platform class to the body tag
// after the `prepare` command. By placing the platform CSS classes
// directly in the HTML built for the platform, it speeds up
// rendering the correct layout/style for the specific platform
// instead of waiting for the JS to figure out the correct classes.

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];

function addTagToBody(indexPath, tags) {
  try {
    var html = fs.readFileSync(indexPath, 'utf8');
    var bodyTag = findBodyTag(html);
    if(!bodyTag) return; // no opening body tag, something's wrong.
    if(tags == null || tags.length <=0) return; //tags need to add.

    for(var i=0; i<tags.length; i++) {
      var tag = tags[i];
      if(bodyTag.indexOf(tag) > -1) continue; // already added

      var newBodyTag = bodyTag;
      var classAttr = findClassAttr(bodyTag);

      if(classAttr) {
        // body tag has existing class attribute, add the classname
        var endingQuote = classAttr.substring(classAttr.length-1);
        var newClassAttr = classAttr.substring(0, classAttr.length-1);
        newClassAttr += ' ' + tag + endingQuote;
        newBodyTag = bodyTag.replace(classAttr, newClassAttr);
      } else {
        // add class attribute to the body tag
        newBodyTag = bodyTag.replace('>', ' class="' + tag + '">');
      }

      html = html.replace(bodyTag, newBodyTag);
      bodyTag = newBodyTag;

      process.stdout.write('add to body class: ' + tag + '\n');
    }

    fs.writeFileSync(indexPath, html, 'utf8');

  } catch(e) {
    process.stdout.write(e);
  }
}

function findBodyTag(html) {
  // get the body tag
  try{
    return html.match(/<body(?=[\s>])(.*?)>/gi)[0];
  }catch(e){}
}

function findClassAttr(bodyTag) {
  // get the body tag's class attribute
  try{
    return bodyTag.match(/ class=["|'](.*?)["|']/gi)[0];
  }catch(e){}
}

if (rootdir) {

  // go through each of the platform directories that have been prepared
  var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);
  var tags = [];

  for(var x=0; x<platforms.length; x++) {
    // open up the index.html file at the www root
    try {
      var platform = platforms[x].trim().toLowerCase();
      var indexPath;

      if(platform == 'android') {
        indexPath = path.join('platforms', platform, 'assets', 'www', 'index.html');
      } else {
        indexPath = path.join('platforms', platform, 'www', 'index.html');
      }

      if(fs.existsSync(indexPath)) {
        tags.push('platform-' + platform);
      }
    } catch(e) {
      process.stdout.write(e);
    }
  }

  tags.push('platform-cordova platform-webview');

  var apiEvn = process.env.API_EVN;
  if(apiEvn != null){
    tags.push("api-" + apiEvn);
  }

  try {
    addTagToBody(indexPath, tags);
  } catch(e) {
    process.stdout.write(e);
  }
}
