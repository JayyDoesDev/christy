import platform
import os
import subprocess

import threading
import subprocess

def run_command(command):
    subprocess.run(command, shell=True)

def run_commands_concurrently(command1, command2):
    thread1 = threading.Thread(target=run_command, args=(command1,))
    thread2 = threading.Thread(target=run_command, args=(command2,))
    thread1.start()
    thread2.start()
    thread1.join()
    thread2.join()


if platform.system() == "Windows":
    activate_cmd = f"Scripts\\activate"
elif platform.system().lower() == "darwin":
    activate_cmd = f"source"
else:
    activate_cmd = f"activate"
if os.path.exists("runtime/.env"):
    print("Starting bot...")
    run_commands_concurrently(activate_cmd + " .env && yarn install && yarn start", "cd microservice && python3 chatevents.py")
else:
    print("Installed, Please go edit runtime/.env")