EMAIL_VERIFICATION_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 0;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                    <td style="background-color:#2c5282;padding:40px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:-0.5px;">&#128737; {app_name}</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:48px 40px;">
                        <h2 style="color:#0F172A;margin:0 0 16px;font-size:24px;">Verify Your Email Address</h2>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Hello <strong style="color:#0F172A;">{full_name}</strong>,
                        </p>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 32px;">
                            Thank you for registering with {app_name}. Please verify your email address by clicking the button below. This link will expire in 24 hours.
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center">
                                    <a href="{verification_url}" style="background-color:#2c5282;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;display:inline-block;letter-spacing:0.3px;">
                                        Verify Email Address
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <p style="color:#94a3b8;line-height:1.6;font-size:14px;margin:32px 0 0;">
                            If the button doesn't work, copy and paste this link into your browser:<br>
                            <a href="{verification_url}" style="color:#2c5282;word-break:break-all;">{verification_url}</a>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
                        <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">
                            &copy; 2026 {app_name}. All rights reserved.<br>
                            This is an automated email. Please do not reply.
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
"""

PASSWORD_RESET_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 0;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                    <td style="background-color:#2c5282;padding:40px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:-0.5px;">&#128737; {app_name}</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:48px 40px;">
                        <h2 style="color:#0F172A;margin:0 0 16px;font-size:24px;">Reset Your Password</h2>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Hello <strong style="color:#0F172A;">{full_name}</strong>,
                        </p>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 32px;">
                            We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center">
                                    <a href="{reset_url}" style="background-color:#DC2626;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;display:inline-block;letter-spacing:0.3px;">
                                        Reset Password
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <div style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:24px 0;">
                            <p style="color:#991b1b;font-size:14px;margin:0;">
                                &#9888; If you didn't request a password reset, please ignore this email or contact support immediately.
                            </p>
                        </div>
                        <p style="color:#94a3b8;line-height:1.6;font-size:14px;margin:32px 0 0;">
                            If the button doesn't work, copy and paste this link into your browser:<br>
                            <a href="{reset_url}" style="color:#2c5282;word-break:break-all;">{reset_url}</a>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
                        <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">
                            &copy; 2026 {app_name}. All rights reserved.<br>
                            This is an automated email. Please do not reply.
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
"""

APPLICATION_RECEIVED_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 0;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                    <td style="background-color:#2c5282;padding:40px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:-0.5px;">&#128737; {app_name}</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:48px 40px;">
                        <h2 style="color:#0F172A;margin:0 0 16px;font-size:24px;">Application Received</h2>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Hello <strong style="color:#0F172A;">{full_name}</strong>,
                        </p>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Thank you for applying for the <strong style="color:#2c5282;">{job_title}</strong> position at {app_name}. We have received your application and our team will review it shortly.
                        </p>
                        <div style="background-color:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px;margin:24px 0;">
                            <p style="color:#0F172A;font-size:14px;margin:0 0 8px;font-weight:600;">Your Tracking Number</p>
                            <p style="color:#2c5282;font-size:24px;font-weight:700;margin:0;letter-spacing:1px;">{tracking_number}</p>
                        </div>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            You can use this tracking number to check the status of your application at any time on our portal.
                        </p>
                        <p style="color:#94a3b8;line-height:1.6;font-size:14px;margin:32px 0 0;">
                            We will keep you updated on the progress of your application via email.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
                        <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">
                            &copy; 2026 {app_name}. All rights reserved.<br>
                            This is an automated email. Please do not reply.
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
"""

STATUS_UPDATE_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 0;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                    <td style="background-color:#2c5282;padding:40px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:-0.5px;">&#128737; {app_name}</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:48px 40px;">
                        <h2 style="color:#0F172A;margin:0 0 16px;font-size:24px;">Application Status Updated</h2>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Hello <strong style="color:#0F172A;">{full_name}</strong>,
                        </p>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            The status of your application for <strong style="color:#2c5282;">{job_title}</strong> has been updated.
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                            <tr>
                                <td style="background-color:#f8fafc;border-radius:8px;padding:20px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding-bottom:12px;">
                                                <span style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Tracking Number</span><br>
                                                <span style="color:#0F172A;font-size:14px;font-weight:600;">{tracking_number}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-bottom:12px;">
                                                <span style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Previous Status</span><br>
                                                <span style="color:#475569;font-size:14px;">{old_status}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">New Status</span><br>
                                                <span style="color:#2c5282;font-size:16px;font-weight:700;">{new_status}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
                        <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">
                            &copy; 2026 {app_name}. All rights reserved.<br>
                            This is an automated email. Please do not reply.
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
"""

INTERVIEW_INVITE_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 0;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                    <td style="background-color:#059669;padding:40px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:-0.5px;">&#128737; {app_name}</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:48px 40px;">
                        <h2 style="color:#0F172A;margin:0 0 16px;font-size:24px;">Interview Invitation</h2>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Hello <strong style="color:#0F172A;">{full_name}</strong>,
                        </p>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Congratulations! We would like to invite you for an interview for the <strong style="color:#2c5282;">{job_title}</strong> position.
                        </p>
                        <div style="background-color:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:24px;margin:24px 0;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom:16px;">
                                        <span style="color:#059669;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">&#128197; Date & Time</span><br>
                                        <span style="color:#0F172A;font-size:16px;font-weight:600;">{interview_date}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom:16px;">
                                        <span style="color:#059669;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">&#128336; Duration</span><br>
                                        <span style="color:#0F172A;font-size:16px;">{duration} minutes</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom:16px;">
                                        <span style="color:#059669;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">&#127919; Interview Type</span><br>
                                        <span style="color:#0F172A;font-size:16px;">{interview_type}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span style="color:#059669;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">&#128205; Location</span><br>
                                        <span style="color:#0F172A;font-size:16px;">{location}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Please make sure to be available at the scheduled time. If you need to reschedule, please contact us as soon as possible.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
                        <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">
                            &copy; 2026 {app_name}. All rights reserved.<br>
                            This is an automated email. Please do not reply.
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
"""

OFFER_LETTER_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 0;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                    <td style="background:linear-gradient(135deg,#2c5282,#7C3AED);padding:40px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:-0.5px;">&#128737; {app_name}</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:48px 40px;">
                        <div style="text-align:center;margin:0 0 32px;">
                            <span style="font-size:48px;">&#127881;</span>
                        </div>
                        <h2 style="color:#0F172A;margin:0 0 16px;font-size:24px;text-align:center;">Congratulations!</h2>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;text-align:center;">
                            You have been selected for the position of
                        </p>
                        <div style="text-align:center;margin:24px 0;">
                            <span style="background-color:#eff6ff;color:#2c5282;font-size:20px;font-weight:700;padding:12px 24px;border-radius:8px;display:inline-block;">
                                {job_title}
                            </span>
                        </div>
                        <div style="background-color:#f8fafc;border-radius:12px;padding:24px;margin:32px 0;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-bottom:16px;">
                                        <span style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Department</span><br>
                                        <span style="color:#0F172A;font-size:16px;font-weight:600;">{department}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span style="color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Compensation</span><br>
                                        <span style="color:#059669;font-size:18px;font-weight:700;">{salary_range}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Welcome to the {app_name} family! We are thrilled to have you on board. Our HR team will be in touch shortly with the detailed onboarding process and next steps.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
                        <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">
                            &copy; 2026 {app_name}. All rights reserved.<br>
                            This is an automated email. Please do not reply.
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
"""

REJECTION_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 0;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                    <td style="background-color:#0F172A;padding:40px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:-0.5px;">&#128737; {app_name}</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:48px 40px;">
                        <h2 style="color:#0F172A;margin:0 0 16px;font-size:24px;">Application Update</h2>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Hello <strong style="color:#0F172A;">{full_name}</strong>,
                        </p>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            Thank you for your interest in the <strong>{job_title}</strong> position at {app_name} and for taking the time to go through our recruitment process.
                        </p>
                        <div style="background-color:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:20px;margin:24px 0;">
                            <p style="color:#9a3412;font-size:14px;margin:0 0 8px;font-weight:600;">Reason</p>
                            <p style="color:#9a3412;font-size:14px;margin:0;line-height:1.6;">{reason}</p>
                        </div>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0 0 24px;">
                            We encourage you to apply for future positions that match your skills and experience. We will keep your resume on file for potential opportunities.
                        </p>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:0;">
                            We wish you all the best in your career journey.
                        </p>
                        <p style="color:#475569;line-height:1.7;font-size:16px;margin:24px 0 0;">
                            Best regards,<br>
                            <strong style="color:#0F172A;">The {app_name} Recruitment Team</strong>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
                        <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">
                            &copy; 2026 {app_name}. All rights reserved.<br>
                            This is an automated email. Please do not reply.
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
"""
