const mongoose = require('mongoose')

if (process.argv.length<3 || process.argv.length>5) {
    console.log('Missing of toomany arguments i.e. password, name, number');
    process.exit(1);
}

const password = process.argv[2];

const url = 
    `mongodb+srv://Puhelinluettelo:${password}@cluster0-fqzsi.mongodb.net/testPuhelinluettelo?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });


const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model("Contact", contactSchema);

//Find persons
if(process.argv.length === 3){
    Contact.find({}).then( result => {
        //console.log('result type :>> ', typeof(result));
        //console.log('result :>> ', result);
        
        for (let i = 0; i < result.length; i++) {
            console.log(result[i].name,"\t", result[i].number);
        } 

        mongoose.connection.close();
        process.exit(0);
    })
}else if(process.argv.length === 5){
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    contact.save().then( response => {
        console.log("Number saved");
        mongoose.connection.close()
    })
}