from omnidimension import Client

# Replace this with your actual API key
api_key = "YOUR_OMNI_API_KEY"
client = Client(api_key)

# Replace with your current ngrok URL
webhook_url = "https://9a5a-2409-40d0-28-3d18-35bb-d9bc-d8b3-3564.ngrok-free.app/webhook"

# Create the agent
response = client.agent.create(
    name="AuctionAssist",
    welcome_message="""Hello, this is AuctionAssist, your voice guide for the online auction platform. How can I assist you with auctions today?""",
    context_breakdown=[
        {
            "title": "Greeting and Intent Capture",
            "body": "Welcome the caller to the AuctionAssist service. Prompt them to inquire about ongoing auctions, request product details, or place a bid."
        },
        {
            "title": "Responding to 'list_auctions' Intent",
            "body": f"When a caller asks about current auctions, capture 'list_auctions' and POST to '{webhook_url}' to retrieve product info."
        },
        {
            "title": "Handling 'get_product_info' Intent",
            "body": f"When a caller asks about a product, capture 'product_name' and POST to '{webhook_url}' to retrieve product info."
        },
        {
            "title": "Processing 'place_bid' Intent",
            "body": f"Capture 'product_name' and 'bid_amount'. Then POST to '{webhook_url}' to place the bid if it's higher than the current bid."
        },
        {
            "title": "Speech Style Guidelines",
            "body": "Use a professional, clear, and enthusiastic voice with helpful cues like 'Alright!' or 'Let’s check that for you.'"
        }
    ],
    transcriber={
        "provider": "deepgram_stream",
        "silence_timeout_ms": 400,
        "model": "nova-3",
        "numerals": True,
        "punctuate": True,
        "smart_format": False,
        "diarize": False
    },
    model={
        "model": "gpt-4o-mini",
        "temperature": 0.7
    },
    voice={
        "provider": "eleven_labs",
        "voice_id": "3dwJD1ugcezUHQq99S00"
    },
    post_call_actions={
        "email": {
            "enabled": True,
            "recipients": ["example@example.com"],
            "include": ["summary", "extracted_variables"]
        },
        "extracted_variables": []
    }
)

# Print the result
print(f"Status: {response['status']}")
print(f"Created Agent: {response['json']}")

# Store the agent ID
agent_id = response['json'].get('id')
print(f"Agent ID: {agent_id}")
