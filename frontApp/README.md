# easyVim Front App

What you need:
  NodeJs

  First time:
    Run in your project root:
      --npm install--
      --bower install--
     --gulp install--

  For build:
    gulp compile
    gulp --project auto reloads when it's modified--
    
To add new dependences: 
  --for tools-- 
    npm install --save [dependency-name]
  --for libraries-- 
    bower install --save [dependency-name] (they also need to be incuded in index.html)

!IMPORTANT:
    for coffeescript files you will need a watcher or something to compile them due to the fact that gulp accepts only js at the moment