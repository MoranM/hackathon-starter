module.exports = {
  db: 'mongodb://localhost:27017/api-proxy',

  sessionSecret: "Sears_Israel_Mobile_Team_Roles",

  localAuth: true,

  mailgun: {
    login: 'Your Mailgun SMTP Username',
    password: 'Your Mailgun SMTP Password'
  },

  sendgrid: {
    user: 'Your SendGrid Username',
    password: 'Your SendGrid Password'
  }
};
