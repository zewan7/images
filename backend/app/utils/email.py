import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config.settings import settings

# 发送邮件函数
def send_email(to_email, subject, body):
    try:
        # 创建邮件
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # 添加邮件正文
        msg.attach(MIMEText(body, 'html'))
        
        # 连接SMTP服务器
        if settings.SMTP_PORT == 465:
            # 使用SSL连接
            server = smtplib.SMTP_SSL(settings.SMTP_SERVER, settings.SMTP_PORT)
        else:
            # 使用TLS连接
            server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
            server.starttls()
        
        # 登录SMTP服务器
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        
        # 发送邮件
        server.send_message(msg)
        
        # 关闭连接
        server.quit()
        
        return True
    except Exception as e:

        return False

# 发送验证邮件
def send_verification_email(to_email, verification_token):
    verification_link = f"http://localhost:3000/verify-email?token={verification_token}"
    
    subject = "请验证您的邮箱"
    body = f"""
    <html>
      <body>
        <h2>欢迎注册视觉画廊！</h2>
        <p>请点击以下链接验证您的邮箱：</p>
        <p><a href="{verification_link}" style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">验证邮箱</a></p>
        <p>如果您没有注册我们的服务，请忽略此邮件。</p>
      </body>
    </html>
    """
    
    return send_email(to_email, subject, body)

# 发送密码重置邮件
def send_password_reset_email(to_email, reset_token):
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    
    subject = "重置您的密码"
    body = f"""
    <html>
      <body>
        <h2>密码重置请求</h2>
        <p>您请求重置视觉画廊账号的密码，请点击以下链接完成重置：</p>
        <p><a href="{reset_link}" style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">重置密码</a></p>
        <p>如果您没有请求重置密码，请忽略此邮件。</p>
      </body>
    </html>
    """
    
    return send_email(to_email, subject, body)

# 发送注册验证码邮件
def send_registration_otp(to_email, otp):
    subject = "视觉画廊注册验证码"
    body = f"""
    <html>
      <body>
        <h2>欢迎注册视觉画廊！</h2>
        <p>您的注册验证码是：</p>
        <p style="font-size: 24px; font-weight: bold; color: #4a90e2; letter-spacing: 3px;">{otp}</p>
        <p>验证码有效期为10分钟，请尽快完成注册。</p>
        <p>如果您没有注册我们的服务，请忽略此邮件。</p>
      </body>
    </html>
    """
    
    return send_email(to_email, subject, body)
