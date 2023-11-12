import platform
import os
import shutil
import subprocess

def get_command_output(command):
    try:
        result = subprocess.check_output(command, shell=True, text=True)
        return result.strip()
    except subprocess.CalledProcessError as e:
        return f"Error executing command: {e}"
if os.path.exists("runtime"):
    commit = get_command_output('cd runtime && git log -1 --pretty=format:"%H"')
else:
    commit = None

print("Current Version:",commit)
import requests

def get_latest_commit_sha(username, repo_name):
    api_url = f'https://api.github.com/repos/{username}/{repo_name}/commits'
    
    try:
        response = requests.get(api_url)
        response.raise_for_status()

        commits = response.json()

        latest_commit = commits[0]
        return latest_commit['sha']

    except requests.exceptions.RequestException as e:
        return f"Error fetching data: {e}"

latest_commit_sha = get_latest_commit_sha('JayyDoesDev', 'christy')

print("Latest commit version:", latest_commit_sha)


if platform.system() == "Windows":
    activate_cmd = f"Scripts\\activate"
elif platform.system().lower() == "darwin":
    activate_cmd = f"source"
else:
    activate_cmd = f"activate"

if not latest_commit_sha == commit:
    print("Updating...")
    try:os.rename("runtime", "runtime_old")
    except:...
    os.system("git clone https://github.com/JayyDoesDev/christy.git")
    try:shutil.copyfile("runtime_old/.env", "christy/.env")
    except:...

    os.rename("christy", "runtime")

    print("Updated, Starting Bot...")
    if os.path.exists("runtime/.env"):
        try:
            os.system(activate_cmd + " runtime/.env && cd runtime && yarn install && yarn start")
        except:
            print("Something went wrong with new runtime, reverting to old...")
            os.remove("runtime")
            os.rename("runtime_old", "runtime")
            os.system(activate_cmd + " runtime/.env && cd runtime && yarn install && yarn start")
    else:
        os.system("cd runtime && yarn install")
        print("Installed, Please go edit runtime/.env")
else:
    if os.path.exists("runtime/.env"):
        print("Up to date, starting bot...")
        os.system(activate_cmd + " runtime/.env && cd runtime && yarn start")
    else:
        print("Installed, Please go edit runtime/.env")