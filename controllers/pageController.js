import nodemailer from 'nodemailer';
import Photo from '../models/photoModel.js';
import User from '../models/userModel.js';
const photos = [
  {
    url: 'https://images.unsplash.com/photo-1580852300513-9b50125bf293?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
    description: 'description',
    name: 'name',
  },
  {
    url: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
     description: 'description',
    name: 'name',
  },
  {
    url: 'https://images.unsplash.com/photo-1582994254571-52c62d96ebab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
     description: 'description',
    name: 'name',
  },
]
const getAboutPage = (req, res) => {
  res.render('about', {
    link: 'about',
  });
};
const getIndexPage = async (req, res) => {
  //const photos = await Photo.find().sort({ uploadedAt: -1 }).limit(3);

  const numOfUser = await User.countDocuments({});
  const numOfPhotos = await Photo.countDocuments({});

  res.render('index', {
    link: 'index',
    photos,
    numOfUser,
    numOfPhotos,
  });
};


const getRegisterPage = (req, res) => {
  res.render('register', {
    link: 'register',
  });
};

const getLoginPage = (req, res) => {
  res.render('login', {
    link: 'login',
  });
};

const getLogout = (req, res) => {
  res.cookie('jwt', '', {
    maxAge: 1,
  });
  res.redirect('/');
};

const getContactPage = (req, res) => {
  res.render('contact', {
    link: 'contact',
  });
};

const sendMail = async (req, res) => {
  const htmlTemplate = `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Simple Transactional Email</title>
      <style>
        /* -------------------------------------
            GLOBAL RESETS
        ------------------------------------- */
        
        /*All the styling goes here*/
        
        img {
          border: none;
          -ms-interpolation-mode: bicubic;
          max-width: 100%; 
        }
  
        body {
          background-color: #f6f6f6;
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%; 
        }
  
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%; }
          table td {
            font-family: sans-serif;
            font-size: 14px;
            vertical-align: top; 
        }
  
        /* -------------------------------------
            BODY & CONTAINER
        ------------------------------------- */
  
        .body {
          background-color: #f6f6f6;
          width: 100%; 
        }
  
        /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
        .container {
          display: block;
          margin: 0 auto !important;
          /* makes it centered */
          max-width: 580px;
          padding: 10px;
          width: 580px; 
        }
  
        /* This should also be a block element, so that it will fill 100% of the .container */
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 580px;
          padding: 10px; 
        }
  
        /* -------------------------------------
            HEADER, FOOTER, MAIN
        ------------------------------------- */
        .main {
          background: #ffffff;
          border-radius: 3px;
          width: 100%; 
        }
  
        .wrapper {
          box-sizing: border-box;
          padding: 20px; 
        }
  
        .content-block {
          padding-bottom: 10px;
          padding-top: 10px;
        }
  
  
      </style>
    </head>
    <body>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
          <td>&nbsp;</td>
          <td class="container">
            <div class="content">
  
              <!-- START CENTERED WHITE CONTAINER -->
              <table role="presentation" class="main">
  
                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p>Email: ${req.body.email}</p>
                          <p>Name: ${req.body.name}</p>
                          <p>Message: ${req.body.message}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
              <!-- END MAIN CONTENT AREA -->
              </table>
              <!-- END CENTERED WHITE CONTAINER -->
  
  
            </div>
          </td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>
  `;

  try {
    //// varsayılan SMTP aktarımını kullanarak yeniden kullanılabilir taşıyıcı nesnesi oluştur
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // 465 için doğru, diğer bağlantı noktaları için yanlış
      auth: {
        user: process.env.NODE_MAIL, // oluşturukan eterik kullanıcı 
        pass: process.env.NODE_PASS, // oluşturulan eteerik password 
      },
    });

    //// tanımlı taşıma nesnesi ile posta gönder 
    await transporter.sendMail({
      to: 'Sefakaraca011@gmail.com', //alıcı listesi 
      subject: `MAIL FROM ${req.body.email}`, // Konu satırı
      html: htmlTemplate, // html body
    });

    
    res.status(200).json({ succeeded: true });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

export {
  getIndexPage,
  getAboutPage,
  getRegisterPage,
  getLoginPage,
  getLogout,
  getContactPage,
  sendMail,
};
