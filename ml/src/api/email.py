from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

router = APIRouter()

class EmailPlanRequest(BaseModel):
    email: EmailStr
    name: str
    htmlContent: str
    dietPlan: Optional[dict] = None

@router.post("/email-plan")
async def send_diet_plan(request: EmailPlanRequest):
    """
    Send a personalized diet plan to the user's email.
    Supports both SMTP and SendGrid.
    """
    try:
        # Get email configuration from environment variables
        email_provider = os.getenv("EMAIL_PROVIDER", "smtp")
        
        if email_provider.lower() == "sendgrid":
            return await send_via_sendgrid(request)
        else:
            return await send_via_smtp(request)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error sending email: {str(e)}"
        )

async def send_via_smtp(request: EmailPlanRequest):
    """Send email using SMTP server"""
    
    # Get SMTP configuration from environment
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    
    if not sender_email or not sender_password:
        raise HTTPException(
            status_code=500,
            detail="Email configuration not set. Set SENDER_EMAIL and SENDER_PASSWORD env vars."
        )
    
    try:
        # Create email message
        message = MIMEMultipart("alternative")
        message["Subject"] = f"Your FoodGene Diet Plan - {request.name}"
        message["From"] = sender_email
        message["To"] = request.email
        
        # Create email body with beautiful HTML styling
        html_body = f"""
        <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background: #f9fafb;
                    }}
                    .header {{
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 8px;
                        text-align: center;
                        margin-bottom: 20px;
                    }}
                    .header h1 {{
                        margin: 0;
                        font-size: 28px;
                    }}
                    .content {{
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }}
                    .section {{
                        margin-bottom: 20px;
                        border-bottom: 1px solid #e5e7eb;
                        padding-bottom: 20px;
                    }}
                    .section:last-child {{
                        border-bottom: none;
                    }}
                    .section h2 {{
                        color: #10b981;
                        margin-top: 0;
                    }}
                    .footer {{
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        margin-top: 20px;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🥗 Your FoodGene Diet Plan</h1>
                        <p>Personalized nutrition plan for {request.name}</p>
                    </div>
                    
                    <div class="content">
                        {request.htmlContent}
                        
                        <div class="section">
                            <h2>How to Use This Plan</h2>
                            <ul>
                                <li>Follow the macronutrient targets for optimal results</li>
                                <li>Drink plenty of water throughout the day</li>
                                <li>Adjust meals based on your preferences</li>
                                <li>Track your progress weekly</li>
                            </ul>
                        </div>
                        
                        <div class="section">
                            <h2>Important Notes</h2>
                            <p>This plan is generated for informational purposes. 
                            Please consult with a healthcare professional before making significant dietary changes.</p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Generated by FoodGene - Your AI-Powered Nutrition Assistant</p>
                        <p>&copy; 2025 FoodGene. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        # Attach HTML content
        part = MIMEText(html_body, "html")
        message.attach(part)
        
        # Send email via SMTP
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, request.email, message.as_string())
        
        return {
            "status": "success",
            "message": f"Diet plan sent successfully to {request.email}"
        }
    
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(
            status_code=401,
            detail="SMTP authentication failed. Check SENDER_EMAIL and SENDER_PASSWORD."
        )
    except smtplib.SMTPException as e:
        raise HTTPException(
            status_code=500,
            detail=f"SMTP error: {str(e)}"
        )

async def send_via_sendgrid(request: EmailPlanRequest):
    """Send email using SendGrid API"""
    
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="SendGrid not installed. Install with: pip install sendgrid"
        )
    
    sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
    from_email = os.getenv("SENDGRID_FROM_EMAIL", "noreply@foodgene.com")
    
    if not sendgrid_api_key:
        raise HTTPException(
            status_code=500,
            detail="SENDGRID_API_KEY not set in environment variables."
        )
    
    try:
        # Create email body
        html_body = f"""
        <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background: #f9fafb;
                    }}
                    .header {{
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 8px;
                        text-align: center;
                        margin-bottom: 20px;
                    }}
                    .header h1 {{
                        margin: 0;
                        font-size: 28px;
                    }}
                    .content {{
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }}
                    .section {{
                        margin-bottom: 20px;
                        border-bottom: 1px solid #e5e7eb;
                        padding-bottom: 20px;
                    }}
                    .section:last-child {{
                        border-bottom: none;
                    }}
                    .section h2 {{
                        color: #10b981;
                        margin-top: 0;
                    }}
                    .footer {{
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        margin-top: 20px;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🥗 Your FoodGene Diet Plan</h1>
                        <p>Personalized nutrition plan for {request.name}</p>
                    </div>
                    
                    <div class="content">
                        {request.htmlContent}
                        
                        <div class="section">
                            <h2>How to Use This Plan</h2>
                            <ul>
                                <li>Follow the macronutrient targets for optimal results</li>
                                <li>Drink plenty of water throughout the day</li>
                                <li>Adjust meals based on your preferences</li>
                                <li>Track your progress weekly</li>
                            </ul>
                        </div>
                        
                        <div class="section">
                            <h2>Important Notes</h2>
                            <p>This plan is generated for informational purposes. 
                            Please consult with a healthcare professional before making significant dietary changes.</p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Generated by FoodGene - Your AI-Powered Nutrition Assistant</p>
                        <p>&copy; 2025 FoodGene. All rights reserved.</p>
                    </div>
                </div>
            </body>
        </html>
        """
        
        # Create Mail object
        message = Mail(
            from_email=from_email,
            to_emails=request.email,
            subject=f"Your FoodGene Diet Plan - {request.name}",
            html_content=html_body
        )
        
        # Send via SendGrid
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        
        return {
            "status": "success",
            "message": f"Diet plan sent successfully to {request.email}",
            "statusCode": response.status_code
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"SendGrid error: {str(e)}"
        )
