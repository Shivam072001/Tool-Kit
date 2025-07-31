# python_services/email_handler/management/commands/start_smtp_server.py

import os
import asyncio
from email import policy
from email.parser import BytesParser

import requests
from aiosmtpd.controller import Controller
from django.core.management.base import BaseCommand

# --- Configuration ---
# This should be in your environment variables in a real application
NODE_GATEWAY_URL = os.environ.get("NODE_GATEWAY_URL", "http://localhost:8080")
SMTP_HOST = os.environ.get("SMTP_HOST", "0.0.0.0")
SMTP_PORT = os.environ.get("SMTP_PORT", 1025)

class MailHandler:
    """
    Handles incoming emails, parses them, and forwards them to the Node.js backend.
    """
    async def handle_DATA(self, server, session, envelope):
        print(f"Receiving message from: {envelope.mail_from}")
        print(f"Message addressed to: {', '.join(envelope.rcpt_tos)}")

        try:
            # Parse the email content
            msg = BytesParser(policy=policy.default).parsebytes(envelope.content)

            body = ""
            if msg.is_multipart():
                for part in msg.walk():
                    ctype = part.get_content_type()
                    cdispo = str(part.get('Content-Disposition'))
                    if ctype == 'text/plain' and 'attachment' not in cdispo:
                        body = part.get_payload(decode=True).decode()
                        break
            else:
                body = msg.get_payload(decode=True).decode()

            # Prepare data for the Node.js backend
            email_data = {
                "to": envelope.rcpt_tos[0],
                "from": msg.get('From'),
                "subject": msg.get('Subject'),
                "body": body.strip(),
            }

            print(f"Forwarding email to Node.js backend: {email_data['subject']}")

            # Send the data to the Node.js internal endpoint
            response = requests.post(
                f"{NODE_GATEWAY_URL}/api/temp-email/internal/receive",
                json=email_data
            )

            if response.status_code == 200:
                print("Successfully forwarded email to backend.")
            else:
                print(f"Error forwarding email: {response.status_code} - {response.text}")

        except Exception as e:
            print(f"An error occurred while processing email: {e}")
            return '500 Could not process your message'

        return '250 OK'

class Command(BaseCommand):
    help = 'Starts the asynchronous SMTP server for receiving temporary emails.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS(f"Starting SMTP server on {SMTP_HOST}:{SMTP_PORT}..."))

        controller = Controller(MailHandler(), hostname=SMTP_HOST, port=SMTP_PORT)

        loop = asyncio.get_event_loop()
        loop.create_task(controller.start())

        try:
            self.stdout.write(self.style.SUCCESS("SMTP server is running. Press CTRL+C to stop."))
            loop.run_forever()
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING("Stopping SMTP server..."))
            controller.stop()
        finally:
            loop.close()
            self.stdout.write(self.style.SUCCESS("SMTP server stopped."))