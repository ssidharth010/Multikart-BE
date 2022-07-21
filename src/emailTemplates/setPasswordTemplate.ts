export const setPasswordContent = (
  link: string,
  password: string,
  title: string,
  message: string
) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Document</title>
  </head>
  <body>
	  <!DOCTYPE html>
  
	  <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
	  <head>
	  <title></title>
	  <meta charset="utf-8"/>
	  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
	  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
	  <style>
			  * {
				  box-sizing: border-box;
			  }
	  
			  th.column {
				  padding: 0
			  }
	  
			  a[x-apple-data-detectors] {
				  color: inherit !important;
				  text-decoration: inherit !important;
			  }
	  
			  #MessageViewBody a {
				  color: inherit;
				  text-decoration: none;
			  }
	  
			  p {
				  line-height: inherit
			  }
	  
			  @media (max-width:620px) {
				  .icons-inner {
					  text-align: center;
				  }
	  
				  .icons-inner td {
					  margin: 0 auto;
				  }
	  
				  .row-content {
					  width: 100% !important;
				  }
	  
				  .stack .column {
					  width: 100%;
					  display: block;
				  }
			  }
		  </style>
	  </head>
	  <body style="margin: 0; background-color: #091548; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #091548;" width="100%">
	  <tbody>
	  <tr>
	  <td>
	  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #091548; background-image: url('../../images/background_2.png'); background-position: center top; background-repeat: repeat;" width="100%">
	  <tbody>
	  <tr>
	  <td>
	  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="600">
	  <tbody>
	  <tr>
	  <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 10px; padding-right: 10px;" width="100%">
	  <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
	  <tr>
	  <td style="width:100%;padding-right:0px;padding-left:0px;padding-top:13px;">
	  <div align="center" style="line-height:10px"><img alt="Main Image" src="../../images/header3.png" style="display: block; height: auto; border: 0; width: 232px; max-width: 100%;" title="Main Image" width="232"/></div>
	  </td>
	  </tr>
	  </table>
	  <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
	  <tr>
	  <td style="padding-bottom:15px;padding-top:10px;">
	  <div style="font-family: sans-serif">
	  <div style="font-size: 14px; color: #ffffff; line-height: 1.2; font-family: Varela Round, Trebuchet MS, Helvetica, sans-serif;">
	  <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:30px;">${title}</span></p>
	  </div>
	  </div>
	  </td>
	  </tr>
	  </table>
	  <table border="0" cellpadding="5" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
	  <tr>
	  <td>
	  <div style="font-family: sans-serif">
	  <div style="font-size: 14px; color: #ffffff; line-height: 1.5; font-family: Varela Round, Trebuchet MS, Helvetica, sans-serif;">
	  <p style="margin: 0; font-size: 14px; text-align: center;">${message}</p>
      <p style="margin: 0; font-size: 14px; text-align: center;padding:5px;"><b>This is your temporary password: ${password}</b></p>
	  <p style="margin: 0; font-size: 14px; text-align: center;">Please click the button below to login</p>
	  </div>
	  </div>
	  </td>
	  </tr>
	  </table>
	  <table border="0" cellpadding="0" cellspacing="0" class="button_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
	  <tr>
	  <td style="padding-bottom:20px;padding-left:15px;padding-right:15px;padding-top:20px;text-align:center;">
	  <div align="center">
	  <!--[if mso]><a:roundrect xmlns:a="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://www.example.com/" style="height:42px;width:197px;v-text-anchor:middle;" arcsize="58%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#091548; font-family:sans-serif; font-size:15px"><![endif]--><a href="${link}" style="text-decoration:none;display:inline-block;color:#091548;background-color:#ffffff;border-radius:24px;width:auto;border-top:1px solid #ffffff;border-right:1px solid #ffffff;border-bottom:1px solid #ffffff;border-left:1px solid #ffffff;padding-top:5px;padding-bottom:5px;font-family:Varela Round, Trebuchet MS, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:25px;padding-right:25px;font-size:15px;display:inline-block;letter-spacing:normal;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span data-mce-style="font-size: 15px; line-height: 30px;" style="font-size: 15px; line-height: 30px;"><strong>LOGIN</strong></span></span></span></a>
	  <!--[if mso]></center></v:textbox></a:roundrect><![endif]-->
	  </div>
	  </td>
	  </tr>
	  </table>
	  <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
	  <tr>
	  <td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
	  <div align="center">
	  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="60%">
	  <tr>
	  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #5A6BA8;"><span></span></td>
	  </tr>
	  </table>
	  </div>
	  </td>
	  </tr>
	  </table>
	  <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0; word-break: break-word;" width="100%">
	  <tr>
	  <td style="padding-bottom:55px;padding-left:25px;padding-right:25px;padding-top:10px;">
	  <div style="font-family: sans-serif">
	  <div style="font-size: 14px; color: #7f96ef; line-height: 1.5; font-family: Varela Round, Trebuchet MS, Helvetica, sans-serif;">
	  <p style="margin: 0; font-size: 14px; text-align: center;"><strong>Didn’t request a password setup?</strong></p>
	  <p style="margin: 0; font-size: 14px; text-align: center;">You can safely ignore this message.</p>
	  </div>
	  </div>
	  </td>
	  </tr>
	  </table>
	  </th>
	  </tr>
	  </tbody>
	  </table>
	  </td>
	  </tr>
	  </tbody>
	  </table>
	  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
	  <tbody>
	  <tr>
	  <td>
	  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="600">
	  <tbody>
	  <tr>
	  <th class="column" style="mso-table-lspace: 0; mso-table-rspace: 0; font-weight: 400; text-align: left; vertical-align: top; padding-left: 10px; padding-right: 10px;" width="100%">
	  <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
	  <tr>
	  <td style="padding-bottom:5px;padding-left:5px;padding-right:5px;padding-top:20px;width:100%;">
	  <div align="center" style="line-height:10px"><img alt="Your Logo" src="../../images/logo.png" style="display: block; height: auto; border: 0; width: 145px; max-width: 100%;" title="Your Logo" width="145"/></div>
	  </td>
	  </tr>
	  </table>
	  <table border="0" cellpadding="0" cellspacing="0" class="divider_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
	  <tr>
	  <td style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
	  <div align="center">
	  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="60%">
	  <tr>
	  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #5A6BA8;"><span></span></td>
	  </tr>
	  </table>
	  </div>
	  </td>
	  </tr>
	  </table>
	  <table border="0" cellpadding="10" cellspacing="0" class="social_block" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
	  <tr>
	  <td>
	  </td>
	  </tr>
	  </table>
	  </th>
	  </tr>
	  </tbody>
	  </table>
	  </td>
	  </tr>
	  </tbody>
	  </table>
	  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0; mso-table-rspace: 0;" width="100%">
	  <tbody>
	  <tr>
	  <td>
	  </td>
	  </tr>
	  </tbody>
	  </table>
	  </td>
	  </tr>
	  </tbody>
	  </table><!-- End -->
	  </body>
	  </html>
  </body>
  </html>`;
};
