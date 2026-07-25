import asyncio
import os
import sys

sys.path.append(os.getcwd())

from browser_use import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
import scripts.outreach_agent as oa

# Subclass ChatGoogleGenerativeAI to satisfy browser-use agent event model metadata requirements
class CustomGemini(ChatGoogleGenerativeAI):
    provider: str = "google"
    model_name: str = "gemini-2.5-flash"

async def main():
    env = oa.load_env('.env.local')
    gemini_key = env.get('GEMINI_API_KEY')
    if not gemini_key:
        print("[-] Error: GEMINI_API_KEY missing from .env.local")
        return

    print("[*] Initializing browser-use Agent with CustomGemini model...")
    llm = CustomGemini(
        model="gemini-2.5-flash",
        google_api_key=gemini_key
    )

    agent = Agent(
        task="Open https://html.duckduckgo.com and search for 'Plumbify AI Missed Call Recovery', then extract top result title.",
        llm=llm
    )

    print("[*] Running browser-use automated task...")
    result = await agent.run()
    print("[+] Task Execution Result:\n", result)

if __name__ == "__main__":
    asyncio.run(main())
