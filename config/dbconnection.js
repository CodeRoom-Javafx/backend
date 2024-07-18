const mongoose = require("mongoose");

const connectDb = async () => {
  const URI =
    process.env.MONGODBURI ||
    `mongodb+srv://pratikshashindeskncomp:abwKl44uMKMygLZb@coderoom-primary.w4qxjdc.mongodb.net/?retryWrites=true&w=majority&appName=Coderoom-primary`;
  await mongoose
    .connect(URI)
    .then((conn) =>
      console.log(
        `Connected to ${conn.connection.host} ${conn.connection.name}`
      )
    )
    .catch((err) => console.log(`Database connection failed ${err}`));
};

module.exports = connectDb;
