require("dotenv").config({ path: '../../.env' });
const sendMail = require("./sendmail");
async function test() {
  const res = await sendMail(
    "friend@example.com",
    "Test OTP",
    "Your OTP is 123456"
  );
  console.log(res);
}

test();