require("dotenv").config({ path: '../../.env' });
const sendMail = require("./sendmail");
async function test() {
  const res = await sendMail({
    to:"royd989712@gmail.com",
    subject:"Test OTP",
    html:"Your OTP is 123456"
  });
  console.log(res);
}

test();