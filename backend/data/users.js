import bcrypt from "bcryptjs";

const users = [
  {
    name: "Kartik Admin",
    email: "123@test.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Anurag",
    email: "1234@test.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Kartik",
    email: "12345@test.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
