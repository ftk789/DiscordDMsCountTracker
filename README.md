# DiscordDMsCountTracker

Track how many **unread DMs** you have on Discord (web).  
This setup includes a **userscript** and a **local Node.js server**.

---

##  How It Works

1. **Userscript** runs on Discord’s site, watches for DOM changes, and detects unread DMs.
2. It sends the unread DM data to a **local server** (`http://localhost:3644/update`) as JSON.

---

##  Setup

### 1. Install Script

- Install [Tampermonkey](https://www.tampermonkey.net/)
- Add the script from:  
  `https://github.com/ftk789/DiscordDMsCountTracker/raw/main/Discord%20Unread%20Messages%20Tracker.user.js`

or click [here](https://github.com/ftk789/DiscordDMsCountTracker/raw/main/Discord%20Unread%20Messages%20Tracker.user.js)

### 2. Run Server

```bash
npm install express cors
node server.js
```

Server runs at: `http://localhost:3644`

---

##  Example Output

```json
{
  "User, 2 unread messages": {
    "rawUsername": "User",
    "pfp": "https://cdn.discordapp.com/avatars/....png",
    "count": 2
  }
}
```

---

## Notes

- You can change the logic however you like. And I'll try to update the userscript frequently whenever discord does a new update that changes element names etc...
