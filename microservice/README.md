# Christy

This is the runtime for christy that will automatically update christy if a new version is found. It supports automatic fallback to older version if new updates causes it to crash, and it also installs the python dependancies for the python side of things.

Note: Functionality of this software was not tested for windows, if anyone wants to test it, go ahead<br>
Note 2: Services like Redis still need to be installed manually

# Quickstart

1. Install Python for your operating system
     - Windows: Open CMD and type in python3, that should open the microsoft store. install it from there.
     - Macos: Check if you have python3 already via terminal (`python3 --version`). If not, get it here - https://www.python.org/downloads/macos/
     - Linux Distros: Open your command line and do `sudo apt-get install python3`, it should be installed by default on most distros though

2. Register for a MongoDB Account and get the URL

3. Create a new discord application with all intents

## Linux / MacOS
```
git clone -b runtime https://github.com/jayydoesdev/christy.git
cd runtime
chmod +x setup_linux+macos.sh
./setup_linux+macos.sh
```

## Windows (CMD)
```
git clone -b runtime https://github.com/jayydoesdev/christy.git
./setup_windows.bat
```

4. Edit runtime/.env.example and rename it to .env after you are done
5. Rerun the setup file for your OS, and you should see it start