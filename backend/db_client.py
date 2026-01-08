import os
from supabase import create_client, Client
from dotenv import load_dotenv

# read .env file
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise ValueError("ERROR: Cannot find SUPABASE_URL or SUPABASE_KEY in .env file")

# Generate Supabase Client.
supabase: Client = create_client(url,key)
