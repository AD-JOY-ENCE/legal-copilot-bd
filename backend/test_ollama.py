
import os
from dotenv import load_dotenv
from ollama import Client

load_dotenv(".env")

model = os.getenv("OLLAMA_MODEL", "qwen3:4b")
host = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")

print("Testing model:", model)

try:
    client = Client(host=host, timeout=180)

    response = client.chat(
        model=model,
        messages=[
            {
                "role": "user",
                "content": "Return one risk category for a fictional employment contract."
            }
        ],
        format={
            "type": "object",
            "properties": {
                "category": {"type": "string"}
            },
            "required": ["category"]
        },
        think=False,
        options={
            "temperature": 0,
            "num_predict": 256
        }
    )

    print("SUCCESS!")
    print("AI Response:", response.message.content)

except Exception as error:
    print("FAILED!")
    print("Error type:", type(error).__name__)
    print("Status code:", getattr(error, "status_code", "N/A"))
