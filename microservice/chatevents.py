from datetime import datetime, timedelta
import requests
import os
import discord
from discord.ext import commands
from dotenv import load_dotenv
import asyncio
import json
import html
import subprocess
import sys
from unidecode import unidecode
from difflib import SequenceMatcher
import secrets

candy_winner = 0

class WordleFormatting:
    start = "```ansi\n"

    black = '[2;30m'

    black = '' # dont delete the unicode character its what makes discord render it with color

    yellow = "[2;33m"

    green = "[2;32m"

    reset = "[0m"

    end = "\n```"

def wordle_md(submission, answer):
    if len(submission) > len(answer):
        return "Your answer is too long, silly!"
    
    current = WordleFormatting.start

    for i in range(len(submission)):
        if submission[i] == answer[i]:
            current += WordleFormatting.green
        elif submission[i] in answer:
            current += WordleFormatting.yellow
        else:
            current += WordleFormatting.black
        current += submission[i] + WordleFormatting.reset

    current += WordleFormatting.end

    return current

class random:

    def randint(start, end):
        if not isinstance(start, int) or not isinstance(end, int):
            raise ValueError("Both start and end must be integers")

        if start > end:
            raise ValueError("Start value must be less than or equal to end value")

        return secrets.randbelow(end - start + 1) + start
    
    def shuffle(lst):
        if not isinstance(lst, list):
            raise ValueError("Input must be a list")

        n = len(lst)

        for i in range(n - 1, 0, -1):
            j = secrets.randbelow(i + 1)
            lst[i], lst[j] = lst[j], lst[i]

    def choice(lst):
        if not isinstance(lst, list):
            raise ValueError("Input must be a list")

        if not lst:
            raise ValueError("List must not be empty")

        index = secrets.randbelow(len(lst))
        return lst[index]


def normalize_and_compare_strings(str1, str2):
    normalized_str1 = unidecode(str1).lower()
    normalized_str2 = unidecode(str2).lower()

    similarity_ratio = SequenceMatcher(None, normalized_str1, normalized_str2).ratio()

    if similarity_ratio > 0.85:
        return True
    else:
        return False

def relaunch():
    python = sys.executable
    script = sys.argv[0]
    subprocess.call([python, script])
    sys.exit()

dotenv_path = os.path.join(os.path.dirname(__file__), "../.env")
load_dotenv(dotenv_path)

def get_env(name): return os.getenv(name)

def fix_encoding(input_string):
    fixed_string = html.unescape(input_string)
    return fixed_string

# todo: move to http request
# todo2: change how the string is manipulated
def prevent_googling(string:str):
    string = fix_encoding(string)
    return string.replace("a", "а").replace("c", "с").replace("e", "е").replace("h" ,"һ").replace("i", "і").replace("j", "ј").replace("y","у").replace("o","о").replace("p", "р").replace(" ", " ")

DROP_CHANNEL_ID = int(get_env("DROPCHANNEL"))

ONGOING_EVENT = False
ONGOING_EVENT_DATA = {}
RANDOM_EVENTS = [
    "button", "trivia", "unscramble", "number", "wordle"
]

EVENTS = [
    "button",
    "trivia",
    "trivia_game",
    "unscramble",
    "number",
    "wordle"
]

# yall really made me do this - im moving this to .env, if you are running this yourself, swap the commented lines
# (also changing the answers btw)
CHRISTMAS_WORDS = json.loads(os.environ['CHRISTMAS_WORDS'])

class Points:
    async def give(userid, amount, event_type = "none"):
        file = os.path.join(os.path.dirname(__file__), "../winners.json")
        while os.path.exists(file):
            print("File exists, waiting")
            await asyncio.sleep(1)

        with open(file, "w") as file:
            print("Writing File")
            file.write(
                json.dumps(
                    {
                        "id": str(userid),
                        "amount": int(amount),
                        "event_type": event_type
                    }
                )
            )

            file.close()

        print("Done Writing at", file)

class unscramble:
    def get_scramble():
        WORD = random.choice(CHRISTMAS_WORDS)
        shuffled = list(WORD)
        random.shuffle(shuffled)
        shuffled = ''.join(shuffled)
        return [shuffled, WORD]

Christy = commands.Bot(
    command_prefix = commands.when_mentioned,
    intents = discord.Intents.all(),
    help_command = None,
    AllowedMentions = discord.AllowedMentions.none()
)

message_count = 50
last_event_trigger = datetime.utcfromtimestamp(0)

@Christy.event
async def on_message(message:discord.Message):
    global RANDOM_EVENTS

    if message.channel.id == DROP_CHANNEL_ID and ONGOING_EVENT == False:
        global message_count, last_event_trigger

        message_count += 1

        if message_count >= 50 and (datetime.now() - last_event_trigger) >= timedelta(minutes=7) and not message.author.bot:
            message_count = 0
            last_event_trigger = datetime.now()
            ctx = await Christy.get_context(message)
            await realtrigger(ctx, random.choice(RANDOM_EVENTS))

    await Christy.process_commands(message)

@Christy.event
async def on_ready():
    print(f"Logged into {Christy.user} ({Christy.user.id})")
    await Christy.tree.sync()
    
@Christy.hybrid_command(
        name="trigger_event",
        description="[Staff Only] Manually trigger a chat event"
)
@discord.app_commands.choices(
        event=[
            discord.app_commands.Choice(name='Trivia (Single Question)', value='trivia'),
            discord.app_commands.Choice(name='Trivia Game (Multi question, put question amount in opt_param paramater)', value="trivia_game"),
            discord.app_commands.Choice(name='Button Chat Event', value="button"),
            discord.app_commands.Choice(name='Unscramble Christmas word game', value="unscramble"),
            discord.app_commands.Choice(name='Bigger Lower Number Game', value="number"),
            discord.app_commands.Choice(name='Wordle Game', value="wordle")
])
async def trigger(ctx, event: discord.app_commands.Choice[str], opt_param:str = ""):
        event = event.value
        print("event thing", event)
        global ONGOING_EVENT
        if not ctx.message.author.guild_permissions.ban_members:
            return await ctx.send("You don't have permission to use this command.", ephemeral=True)
        elif ctx.message.guild.id != int(get_env("GUILDID")):
            return await ctx.send("get denied", ephemeral=True)

        if ONGOING_EVENT == True:
            return await ctx.send("There is already an ongoing event!", ephemeral=True)

        if not event.lower() in EVENTS:
            return await ctx.send(f"Please choose a valid event! Usage: {Christy.user.mention} trigger `EVENT_NAME`", ephemeral=True)
        
        Event_Status = await ctx.send(f"Triggering Event in <#{DROP_CHANNEL_ID}>")
        

        await realtrigger(ctx, event, opt_param)

# why is this not one command? @Marie trigger can be called via a command, while this function cannot for security and ease of calling it via code
async def realtrigger(ctx: commands.Context, event: str = "", opt_param:str = ""):
        
        # try:
            global ONGOING_EVENT, ONGOING_EVENT_DATA, EVENTS, DROP_CHANNEL_ID
        
            if event.lower() == "unscramble":
                ONGOING_EVENT = True
                scramble = unscramble.get_scramble()
                ONGOING_EVENT_DATA["type"] = "unscramble"
                ONGOING_EVENT_DATA["answer"] = scramble[1]

                

                channel = Christy.get_channel(DROP_CHANNEL_ID)

                Event_Message = await channel.send(
                    embed = discord.Embed(
                        title="Chat Event",
                        description=f"Unscramble this word for candy: `{scramble[0]}`",
                        color=discord.Color.blurple()
                    )
                )

                def check(message):
                    return (
                        message.channel.id == DROP_CHANNEL_ID
                        and message.content.lower() == ONGOING_EVENT_DATA["answer"].lower()
                        and message.author != Christy.user
                    )

                try:
                    winner_message = await Christy.wait_for("message", check=check, timeout=60)
                    winner = winner_message.author
                    await winner_message.add_reaction("✅")
                    amount = random.randint(1,10)
                    await channel.send(f"{winner.mention} has won the chat event and recieved {amount} Candy!")
                    await Points.give(winner.id, amount, "unscramble")
                except asyncio.TimeoutError:
                    await channel.send("No one guessed the correct answer. Event ended.")
                
                ONGOING_EVENT = False
                ONGOING_EVENT_DATA = {}

                

            elif event.lower() == "button":
                global candy_winner
                ONGOING_EVENT = True
                ONGOING_EVENT_DATA["type"] = "button"

                

                channel = Christy.get_channel(DROP_CHANNEL_ID)
                candy_winner = 0
                async def button_cb(interaction: discord.Interaction):
                    global ONGOING_EVENT, ONGOING_EVENT_DATA, candy_winner
                    if ONGOING_EVENT:
                        ONGOING_EVENT = False
                        ONGOING_EVENT_DATA = {}
                        await asyncio.sleep(random.randint(0,4) * .1)
                        if candy_winner == 0:
                            candy_winner = interaction.user.id
                            await interaction.response.send_message("You clicked the button!", ephemeral=True)
                            amount = random.randint(1,10)
                            await interaction.channel.send(f"<@{candy_winner}> pressed the button first and has recieved {amount} candy!")
                            await Points.give(candy_winner, amount, "unscramble2")
                            await interaction.message.edit(embed=Event_Message.embeds[0], view=None)
                    else:
                        await interaction.response.send_message("Someone else has already clicked the button!", ephemeral=True)

                button_label = "Click me for candy!"
                button = discord.ui.Button(style=discord.ButtonStyle.primary, label=button_label, custom_id="button_candy")
                button.callback = button_cb

                View = discord.ui.View()
                View.add_item(button)

                Event_Message = await channel.send(
                    embed=discord.Embed(
                        title="Chat Event",
                        description=f"Click the button to get candy!",
                        color=discord.Color.blurple()
                    ),
                    view=View
                )

            if event.lower() == "number":
                ONGOING_EVENT = True
                scramble = unscramble.get_scramble()
                ONGOING_EVENT_DATA["type"] = "number"
                ONGOING_EVENT_DATA["answer"] = random.randint(1,1000) # can be guessed if someone got the random key but should be fine

                

                channel = Christy.get_channel(DROP_CHANNEL_ID)

                Event_Message = await channel.send(
                    embed = discord.Embed(
                        title="Chat Event",
                        description=f"Guess the number I'm thinking of for candy! 1-1000",
                        color=discord.Color.blurple()
                    )
                )

                def check(message):
                    return True

                try:
                    won = 0
                    while won == 0:
                        winner_message = await Christy.wait_for("message", check=check, timeout=360)
                        if winner_message.channel.id == DROP_CHANNEL_ID:
                            try:
                                amount = random.randint(1,10)
                                if int(winner_message.content.strip()) == ONGOING_EVENT_DATA["answer"]:
                                    won = 1
                                    winner = winner_message.author
                                    await winner_message.add_reaction("✅")
                                    
                                    await channel.send(f"{winner.mention} has won the chat event and recieved {amount} Candy!")
                                    await Points.give(winner.id, amount, "number")
                                elif int(winner_message.content.strip()) < ONGOING_EVENT_DATA["answer"]:
                                    await winner_message.reply("Higher!", mention_author=False)
                                else:
                                    await winner_message.reply("Lower!", mention_author=False)
                            except:
                                ...
                except asyncio.TimeoutError:
                    await channel.send("No one guessed the correct answer. Event ended.")
                
                ONGOING_EVENT = False
                ONGOING_EVENT_DATA = {}

            elif event.lower() == "trivia":
                ONGOING_EVENT = True
                ONGOING_EVENT_DATA["type"] = "trivia"

                res = requests.get("https://opentdb.com/api.php?amount=10&type=multiple").json()["results"][0]
                ONGOING_EVENT_DATA["answer"] = res["correct_answer"]
                opts = [res["correct_answer"]] + res["incorrect_answers"]
                random.shuffle(opts)
                ONGOING_EVENT_DATA["options"] = opts

                

                channel = Christy.get_channel(DROP_CHANNEL_ID)

                await channel.send("**Trivia question starting in 5 seconds!**")

                await asyncio.sleep(5)

                strok = prevent_googling("\n".join(ONGOING_EVENT_DATA["options"]))

                await channel.send(
                    embed=discord.Embed(
                        title="Trivia - Single Question",
                        description=f"{prevent_googling(res['question'])}\n\n{strok}\n\nSend your answers in chat! First to get it right will get candy!",
                        color=discord.Color.blurple()
                    )
                )

                def check(message):
                    return (
                        message.channel.id == DROP_CHANNEL_ID
                        and normalize_and_compare_strings(message.content, fix_encoding(ONGOING_EVENT_DATA["answer"]))
                        and message.author != Christy.user
                    )

                try:
                    winner_message = await Christy.wait_for("message", check=check, timeout=120)
                    winner = winner_message.author
                    await winner_message.add_reaction("✅")
                    amount = random.randint(1,10)
                    await channel.send(f"{winner.mention} has won the chat event and recieved {amount} Candy!")
                    await Points.give(winner.id, amount, "trivia")
                except asyncio.TimeoutError:
                    await channel.send("No one guessed the correct answer. Event ended.")
                
                ONGOING_EVENT = False
                ONGOING_EVENT_DATA = {}
            
            elif event.lower() == "trivia_game":
                leaderboard = {}
                amount = int(opt_param.strip())

                if ONGOING_EVENT:
                    await ctx.reply("There's already a event in progress.")
                    return

                ONGOING_EVENT = True
                ONGOING_EVENT_DATA["type"] = "trivia"
                ONGOING_EVENT_DATA["questions"] = []

                for res in requests.get(f"https://opentdb.com/api.php?amount={amount}&type=multiple").json()["results"]:
                    opts = [res["correct_answer"]] + res["incorrect_answers"]
                    random.shuffle(opts)
                    ONGOING_EVENT_DATA["questions"].append(
                        {"question": res["question"], "answer": res["correct_answer"], "options": opts}
                    )

                

                channel = ctx.guild.get_channel(DROP_CHANNEL_ID)

                await channel.send("**Trivia Game Beginning in 30 seconds...**")

                await asyncio.sleep(15)

                for question_number, question_data in enumerate(ONGOING_EVENT_DATA["questions"], start=1):

                    await channel.send(f"**Trivia Question {question_number}/{amount} -** starting in 15 seconds!")

                    await asyncio.sleep(15)

                    options = prevent_googling('\n'.join(question_data["options"]))

                    await channel.send(
                        embed=discord.Embed(
                            title=f"Trivia - Question {question_number}/{amount}",
                            description=f"{prevent_googling(question_data['question'])}\n\n{options}\n\nSend your answers in chat! First to get it right will get a point!",
                            color=discord.Color.blurple(),
                        )
                    )

                    def check(message):
                        print("event data", ONGOING_EVENT_DATA)
                        return (
                            message.channel.id == DROP_CHANNEL_ID
                            and normalize_and_compare_strings(message.content, fix_encoding(ONGOING_EVENT_DATA["questions"][question_number-1]["answer"]))
                            and message.author != ctx.bot.user
                        )

                    try:
                        winner_message = await ctx.bot.wait_for("message", check=check, timeout=120)
                        winner = winner_message.author
                        await winner_message.add_reaction("✅")
                        await channel.send(f"{winner.mention} has won the trivia question and received 1 point!")
                        if winner.id in leaderboard:
                            leaderboard[winner.id] += 1
                        else:
                            leaderboard[winner.id] = 1
                    except asyncio.TimeoutError:
                        await channel.send("No one guessed the correct answer for this question.")

                    await asyncio.sleep(3)

                    leaderboard = dict(sorted(leaderboard.items(), key=lambda item: item[1], reverse=True))

                    leaderboard_text = ""

                    first_15_users = dict(list(leaderboard.items())[:15])

                    place = 1
                    for userid, score in first_15_users.items():
                        leaderboard_text += f"`{place}. ` <@{userid}> - **{score} candies**\n"
                        place += 1

                    await channel.send(embed=discord.Embed(
                        title="Trivia Game - Leaderboard",
                        description=leaderboard_text,
                        color=discord.Color.blurple()
                    ))

                first_place = dict(list(leaderboard.items())[:1])

                for userid, score in first_place.items():
                    await channel.send(f"**Event Ended - <@{userid}> has won the trivia game with **{score}** points!**")
                
                for userid,score in leaderboard.items():
                    print(f"giving score of {score} to {userid}")
                    await Points.give(userid, int(score), "trivia_game")
                    print("gave")

                ONGOING_EVENT = False
                ONGOING_EVENT_DATA = {}

        # except Exception as Error:
        #     print(Error)
        #     ONGOING_EVENT = False
        #     ONGOING_EVENT_DATA = {}
        #     print("A error occured")


            if event.lower() == "wordle":
                ONGOING_EVENT = True
                word_to_guess = unscramble.get_scramble()[1]
                ONGOING_EVENT_DATA["type"] = "wordle"
                ONGOING_EVENT_DATA["answer"] = word_to_guess.lower()

                channel = Christy.get_channel(DROP_CHANNEL_ID)

                Event_Message = await channel.send(
                    embed=discord.Embed(
                        title="Wordle Event",
                        description=f"The word is {len(word_to_guess)} letters long! Submit your answers in chat!",
                        color=discord.Color.blurple()
                    )
                )

                def check(message):
                    return True

                try:
                    won = 0
                    while won == 0:
                        winner_message = await Christy.wait_for("message", check=check, timeout=360)
                        if winner_message.channel.id == DROP_CHANNEL_ID:
                            # try:
                                amount = random.randint(1,10)
                                if winner_message.content.strip().lower() == ONGOING_EVENT_DATA["answer"]:
                                    won = 1
                                    winner = winner_message.author
                                    await winner_message.add_reaction("✅")
                                    
                                    await channel.send(f"{winner.mention} has won the chat event and recieved {amount} Candy!\nThe answer was {ONGOING_EVENT_DATA['answer']}")
                                    await Points.give(winner.id, amount, "wordle")
                                else:
                                    if len(winner_message.content) == len(ONGOING_EVENT_DATA["answer"]):
                                        await winner_message.reply(wordle_md(winner_message.content.lower(), ONGOING_EVENT_DATA["answer"]), mention_author=False)
                            # except:
                            #     ...
                except asyncio.TimeoutError:
                    await channel.send("No one guessed the correct answer. Event ended.")

                ONGOING_EVENT = False
                ONGOING_EVENT_DATA = {}

@Christy.command()
async def reload(ctx:commands.Context):
    if ctx.message.author.id in [419958345487745035, 746446670228619414]:
        await ctx.reply("Reloading...")
        await Christy.close()

@Christy.event 
async def on_command_error(ctx, error): 
    if not isinstance(error, commands.CommandNotFound): 
        raise error

Christy.run(get_env("TOKEN"))

relaunch()
