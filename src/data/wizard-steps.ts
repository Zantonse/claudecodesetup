import { WizardStep } from '@/lib/types';

export const wizardSteps: WizardStep[] = [
  // ─── Phase 1: Opening the Terminal ───────────────────────────────────────────

  {
    id: 'what-is-terminal',
    phase: 1,
    phaseTitle: 'Opening the Terminal',
    headline: 'What is the Terminal?',
    explanation:
      "The Terminal is how you talk to your computer using text instead of clicking. It's been around since before mice even existed — back when keyboards were the only way to give a computer instructions. Everything you can do by clicking buttons and opening windows can also be done by typing a command. Think of it like texting your computer instead of pointing at it.",
    action: {
      type: 'instruction',
      instruction: "Let's start by understanding what the Terminal is.",
    },
  },
  {
    id: 'open-terminal',
    phase: 1,
    phaseTitle: 'Opening the Terminal',
    headline: 'Open Terminal',
    explanation:
      "Press Cmd + Space to open Spotlight — that's the search bar built into your Mac. Type the word Terminal, then hit Enter. A window will pop up that looks mostly blank: a dark or white background, your name, and a blinking cursor waiting for you to type something. That blinking cursor is the terminal saying \"I'm ready — what would you like to do?\"",
    action: {
      type: 'instruction',
      instruction: "Press Cmd + Space to open Spotlight, type 'Terminal', and hit Enter.",
    },
  },
  {
    id: 'first-command',
    phase: 1,
    phaseTitle: 'Opening the Terminal',
    headline: 'Your First Command',
    explanation:
      "Let's try your very first command. Type the word below exactly as you see it, then press Enter. The terminal will respond with your username — the name you use to sign into your Mac. This is how the terminal works: you type an instruction, press Enter, and the computer responds. Every command you'll ever run follows this same pattern.",
    action: {
      type: 'command',
      command: 'whoami',
    },
    whatThisDoes:
      "This asks the computer 'who am I logged in as?' It responds with your username — the name you use to sign into your Mac.",
  },

  // ─── Phase 2: Installing Claude Code ─────────────────────────────────────────

  {
    id: 'what-is-claude-code',
    phase: 2,
    phaseTitle: 'Installing Claude Code',
    headline: 'What is Claude Code?',
    explanation:
      "Claude Code is an AI assistant that lives in your terminal. Instead of clicking buttons in an app, you have a conversation with Claude — tell it what you want to build, and it writes the code, creates files, and runs commands for you. It's like having a programmer sitting next to you who never gets tired and can type a thousand times faster than any human. You describe what you want in plain English, and Claude figures out how to make it happen.",
    action: {
      type: 'confirmation',
      confirmLabel: "Got it, let's install it!",
    },
  },
  {
    id: 'install-claude-code',
    phase: 2,
    phaseTitle: 'Installing Claude Code',
    headline: 'Install Claude Code',
    explanation:
      "This command downloads and installs Claude Code from the internet. It's similar to downloading an app from the App Store, except you're doing it through text instead of clicking a button. The installation usually takes about 30 seconds. You may see a lot of text scrolling by — that's normal, it's just the installer telling you what it's doing.",
    action: {
      type: 'command',
      command: 'curl -fsSL https://claude.ai/install.sh | bash',
    },
    whatThisDoes:
      "The 'curl' part downloads the installer from Claude's website. The 'bash' part runs it. Together, they install Claude Code on your Mac.",
    troubleshooting:
      "If you see 'Permission denied', try running: sudo curl -fsSL https://claude.ai/install.sh | bash (you'll need to enter your Mac password)",
  },
  {
    id: 'verify-installation',
    phase: 2,
    phaseTitle: 'Installing Claude Code',
    headline: 'Verify It Installed',
    explanation:
      "Let's confirm everything installed correctly by asking Claude Code to tell us its version number. If the installation worked, you'll see a response like 1.x.x — a number that represents which version you have. If you see an error instead, don't worry — the troubleshooting note below will help.",
    action: {
      type: 'command',
      command: 'claude --version',
    },
    whatThisDoes:
      'This asks Claude Code to report its version number. If it responds with a number, the installation was successful!',
    troubleshooting:
      "If you see 'command not found', close the Terminal completely (Cmd + Q) and reopen it, then try again. The terminal needs to reload after installing new software.",
  },

  // ─── Phase 3: Logging In ──────────────────────────────────────────────────────

  {
    id: 'you-need-an-account',
    phase: 3,
    phaseTitle: 'Logging In',
    headline: 'You Need a Claude Account',
    explanation:
      "Claude Code connects to Claude's AI brain, which lives in the cloud — on Anthropic's servers. To use it, you need a Claude account. If you already have a Claude Pro, Max, or Team subscription at claude.ai, you're all set. If not, head to claude.ai and sign up before continuing. The free tier works too, though it has usage limits.",
    action: {
      type: 'instruction',
      instruction:
        "If you already have a Claude account (claude.ai), you're ready! If not, visit claude.ai to sign up first.",
    },
  },
  {
    id: 'log-in',
    phase: 3,
    phaseTitle: 'Logging In',
    headline: 'Log In to Claude',
    explanation:
      "Just type the word below and press Enter. Something a little unexpected will happen: your web browser will pop open automatically with a login page. Sign in to your Claude account there, and once you're logged in, come back to the terminal. Claude Code will recognize that you signed in and be ready to go.",
    action: {
      type: 'command',
      command: 'claude',
    },
    whatThisDoes:
      "Typing 'claude' starts Claude Code for the first time. It opens your web browser so you can sign in with your Claude account. Once you log in, Claude Code remembers you.",
  },
  {
    id: 'confirm-logged-in',
    phase: 3,
    phaseTitle: 'Logging In',
    headline: 'Confirm You\'re Logged In',
    explanation:
      "After logging in through your browser, come back to the terminal. You should see a greeting from Claude and a blinking cursor — that's Claude waiting for your first instruction. If you see that, you're in! Claude is connected and ready.",
    action: {
      type: 'confirmation',
      confirmLabel: "Yes, I see Claude's welcome message!",
    },
    troubleshooting:
      "If login didn't work, type 'claude' again and retry. Make sure you have an active internet connection and a valid Claude subscription.",
  },

  // ─── Phase 4: Using Claude Code ──────────────────────────────────────────────

  {
    id: 'navigate-to-folder',
    phase: 4,
    phaseTitle: 'Using Claude Code',
    headline: 'Navigate to a Folder',
    explanation:
      "Before we start building, we need to create a home for our project. Folders in the terminal work exactly like folders in Finder — they're containers that hold your files. This command will go to your Desktop, create a new folder called my-first-project, and step inside it. Everything Claude creates from this point will live in that folder.",
    action: {
      type: 'command',
      command: 'cd ~/Desktop && mkdir my-first-project && cd my-first-project',
    },
    whatThisDoes:
      "This does three things: goes to your Desktop folder, creates a new folder called 'my-first-project', and goes inside it. Think of it like opening Finder, creating a new folder on your Desktop, and double-clicking to open it.",
  },
  {
    id: 'start-claude-code',
    phase: 4,
    phaseTitle: 'Using Claude Code',
    headline: 'Start Claude Code',
    explanation:
      "Now that we're inside our project folder, let's start Claude Code. Type the command below and press Enter. You'll see Claude's prompt appear — a blinking cursor that means Claude is waiting for your instruction. You're now in a conversation with an AI that can write and run code on your computer.",
    action: {
      type: 'command',
      command: 'claude',
    },
    whatThisDoes:
      'This starts Claude Code inside your project folder. Claude will be able to create and edit files right here.',
  },
  {
    id: 'ask-claude-to-build',
    phase: 4,
    phaseTitle: 'Using Claude Code',
    headline: 'Ask Claude to Build Something',
    explanation:
      "Here comes the fun part. Type the instruction below to give Claude its first real task. Watch what happens: Claude will think for a moment, then you'll see it writing code right in your terminal window. A file will appear in your my-first-project folder on your Desktop. This is Claude doing what it does — turning plain-English instructions into working code.",
    action: {
      type: 'instruction',
      instruction: 'Create a simple webpage that says "Hello! I made this with Claude Code!" and save it as index.html',
    },
    whatThisDoes:
      "You're giving Claude its first instruction. Claude will think about what you asked, write HTML code, and save it as a file called index.html in your project folder.",
  },
  {
    id: 'see-what-claude-made',
    phase: 4,
    phaseTitle: 'Using Claude Code',
    headline: 'See What Claude Made',
    explanation:
      "Claude just created a real webpage on your computer. Let's open it and see it in action. This command tells your Mac to open the file, and since it's an HTML file, your web browser will open it automatically. You should see a webpage with your message on it — a webpage that you built, with help from Claude.",
    action: {
      type: 'command',
      command: 'open index.html',
    },
    whatThisDoes:
      "The 'open' command tells your Mac to open a file with its default application. For .html files, that's your web browser — so you'll see your webpage!",
  },
  {
    id: 'you-did-it',
    phase: 4,
    phaseTitle: 'Using Claude Code',
    headline: 'You Did It!',
    explanation:
      "You just went from never having used a terminal to building a webpage with an AI assistant — and that's genuinely impressive. Think about everything you did: you opened the terminal, learned how commands work, installed software, created a project folder, had a conversation with Claude, and saw real code appear in your browser. That's not a small thing. Every developer you've ever heard of started somewhere just like this. Welcome to the other side.",
    action: {
      type: 'confirmation',
      confirmLabel: 'I did it!',
    },
  },
];
