from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List
import uuid
from datetime import datetime
import anyio
import requests

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactSubmission(ContactSubmissionCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: str = "received"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TalkRequest(BaseModel):
    prompt: str

class TalkResponse(BaseModel):
    reply: str


# Utilities
def _sanitize_text(text: str, limit: int = 5000) -> str:
    if not isinstance(text, str):
        return ""
    text = text.replace("\r", "").strip()
    if len(text) > limit:
        return text[:limit] + "... (truncated)"
    return text


def _sendgrid_enabled() -> bool:
    return bool(os.environ.get('SENDGRID_API_KEY') and os.environ.get('CONTACT_TO'))


def _send_email_sync(from_email: str, subject: str, content: str) -> bool:
    """Send email using SendGrid synchronously. Returns True if accepted by API."""
    from sendgrid import SendGridAPIClient  # lazy import
    from sendgrid.helpers.mail import Mail

    sg = SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
    message = Mail(
        from_email=from_email,
        to_emails=os.environ.get('CONTACT_TO'),
        subject=subject,
        plain_text_content=content,
    )
    response = sg.send(message)
    return int(response.status_code) == 202


def _reflective_fallback(prompt: str) -> str:
    opening = (
        "This space will not prescribe; it will mirror. "
        "Here is what I’m hearing in your words, without agenda:"
    )
    body = f"\n\n• You named: {prompt.strip()}\n• What might already be true: you care enough to ask.\n• Invitation: breathe; let the language arrive before the outcome."
    close = "\n\nTi Amo Energy is steady. When you are ready, ask the next honest question."
    return opening + body + close


def _openai_enabled() -> bool:
    return bool(os.environ.get('OPENAI_API_KEY'))


def _openai_reflect(prompt: str) -> str:
    """Best-effort OpenAI call using REST; falls back on exception."""
    try:
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY missing")
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        data = {
            "model": "gpt-4o-mini",
            "temperature": 0.7,
            "max_tokens": 300,
            "messages": [
                {"role": "system", "content": "You are Dr. Sarah Chen in Sacred Neutrality. Presence over performance. Mirror before advising."},
                {"role": "user", "content": prompt},
            ],
        }
        resp = requests.post(url, json=data, headers=headers, timeout=20)
        if resp.status_code != 200:
            raise RuntimeError(f"OpenAI status {resp.status_code}: {resp.text[:200]}")
        js = resp.json()
        content = js.get("choices", [{}])[0].get("message", {}).get("content")
        if not content:
            raise RuntimeError("OpenAI response missing content")
        return content.strip()
    except Exception as e:
        logging.error(f"OpenAI error: {e}")
        return _reflective_fallback(prompt)


# Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


@api_router.post("/contact")
async def contact_message(payload: ContactSubmissionCreate):
    """Create a contact submission and attempt to email the site owner.
    Never exposes recipient email to the client. Always persists in MongoDB.
    """
    # Sanitize
    name = _sanitize_text(payload.name, 200)
    subject = _sanitize_text(payload.subject, 300)
    message = _sanitize_text(payload.message, 5000)

    # Compose content
    content = (
        f"New contact form submission (Blessed & Grateful)\n\n"
        f"From: {name} <{payload.email}>\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{message}\n\n"
        f"Submitted at: {datetime.utcnow().isoformat()}Z"
    )

    submission = ContactSubmission(
        name=name,
        email=str(payload.email),
        subject=subject,
        message=message,
        status="received",
    )

    # Attempt email if enabled
    emailed = False
    if _sendgrid_enabled():
        try:
            emailed = await anyio.to_thread.run_sync(
                _send_email_sync, str(payload.email), f"Contact Form: {subject}", content
            )
        except Exception as e:
            logging.error(f"SendGrid error: {e}")
            emailed = False

    submission.status = "email_sent" if emailed else "logged_only"

    # Persist
    await db.contacts.insert_one(submission.dict())

    if emailed:
        return {"success": True, "message": "Message sent successfully."}
    else:
        return {
            "success": True,
            "message": "Message received. We will follow up soon.",
        }


@api_router.post("/talk", response_model=TalkResponse)
async def talk_endpoint(req: TalkRequest):
    prompt = _sanitize_text(req.prompt, 4000)
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    if _openai_enabled():
        reply = await anyio.to_thread.run_sync(_openai_reflect, prompt)
    else:
        reply = _reflective_fallback(prompt)

    return TalkResponse(reply=reply)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()