# Updating Iconic-Vue-Conference-App to Iconic App Capacitor 3

## Step 1: Let's get the repo and see what it takes to make it build and run before we attempt to make any changes
    ```
    git clone https://github.com/ionic-team/ionic-vue-conference-app.git
    cd ionic-vue-conference-app
    npm ci
    ```

    But there were quickly signs this path may be wrought with peril and terrors!
    ```
    npm WARN old lockfile
    npm WARN old lockfile The package-lock.json file was created with an old version of npm,
    npm WARN old lockfile so supplemental metadata must be fetched from the registry.
    npm WARN old lockfile
    npm WARN old lockfile This is a one-time fix-up, please be patient...
    ```
    Warnings to please be patient for this one time upgrade.  This coming from an app known for it's desire and propensity for downloading the entire internet onto your local hard drive.  This isn't a promising start, but I'm not super smart and I evidently have time to kill - so FORGE AHEAD!!!
    
    Wait what literally seemed forever.  Seriously folks, I think my wife sent me to shave while I waited for this to complete.  Twice.  But I'm nothing if not patient - and we're not discussing how I considered just deleting the lockfile and running ```npm install``` - heck who doesn't like a good race?  But no - I resisted the urge to do that, and it did indeed finish eventually.
    
    Next step - try to fire this puppy up.
    ```npm run serve```
    Oh no - terrible errors!  Google is of no help.  Where can our intrepid here turn?
    
    Hold up - this is open source, and open source tends not to play nice with windows.  Ok - switch to my handy dandy WSL installation, pull down the repository, and ```npm ci``` again.  Right away I can tell things are going much much better - that one is on me - I should have known better.  A few moments later I'm pretty sure my hard drive is almost full, but my chin is still almost as smooth as a newborn baby's behind!  ```npm run serve```.  Kablamo!  A typescript error - "Parameter 'event' implicitly has an 'any' type."   Lame, but at least it's easy to solve.  Hopefully the project isn't littered with all kinds of these.  I readlly don't want to have to turn that off in tsconfig.json, but I don't want to fix hundreds of these errors either.  One and done - HAZZAH - we have a living breathing app.  A little bit of a bumpy start, but after switching to WSL things are going rather smoothly.

## Step 2: Start thinking about upgrading
    Matt Dean is a pretty decent guy.  He's provided me with a guide which should help make this a cake-walk.  At least I hope so!  I point my trusty browser at https://ionicacademy.com/migrate-ionic-app-capacitor-3/ and get cracking!