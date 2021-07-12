function connectDb(mongoose) {
  const db = 'mongodb+srv://admin:kingspear1999@cluster0.trnqb.mongodb.net/ATNshop?retryWrites=true&w=majority'
  mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
}
module.exports = connectDb;