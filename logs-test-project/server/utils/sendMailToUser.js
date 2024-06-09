import nodemailer from "nodemailer";

export default  async (account="neopowernoreply@gmail.com", message="", ip, userAgent) => {
    const runtimeConfig = useRuntimeConfig();
    const transporter = nodemailer.createTransport({
        service : 'Gmail',
        host: 'smtp.gmail.com',
        secureConnection: false,
        auth: {
            user: runtimeConfig.MAIL.SENDER,
            pass: runtimeConfig.MAIL.APPPWD
        },
        tls:{
            rejectUnauthorized: false
        }
    });
    
    const mailOptions = {
        from: 'NeoPower 新動智能',
        to: account,
        subject: '[Neopower-EVCMS] 登入通知',
        html: `<h1>Neopower-EVCMS 登入通知</h1><p>${message}</p><table cellpadding="6" style="background-color:#eee;padding:2px;border-radius:5px"><tbody><tr style="vertical-align:top;white-space:nowrap"><td><b>信箱</b></td><td style="white-space:normal"><a href="mailto:${account}" target="_blank">${account}</a></td></tr><tr style="vertical-align:top;white-space:nowrap"><td><b>IP 地址</b></td><td style="white-space:normal">${ip}</td></tr><tr style="vertical-align:top;white-space:nowrap"><td><b>設備</b></td><td style="white-space:normal">${userAgent}</td></tr><tr style="vertical-align:top;white-space:nowrap"><td><b>時間</b></td><td style="white-space:normal">${(new Date()).toLocaleString('zh', {year:'numeric', month:'2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}</td></tr></tbody></table>`
    };
    let result = null;
    const resObj = {
        code: 200,
        msg: '',
        data: {
            messageId: ''
        }
    }
    try {
        // result = await transporter.sendMail(mailOptions);
        result = true
    }
    catch (error) {
        console.log('- send mail error', error);
        resObj.code = 10001;
        resObj.msg = 'Submit Fail !';
    } 
    finally {
        if (result?.messageId) {
            resObj.msg = 'mail submit success';
            resObj.data.messageId = result.messageId;
        }
        return resObj;
    }
}