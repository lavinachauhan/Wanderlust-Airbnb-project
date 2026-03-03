// Note:-> Models folder contain the schema and model of the database.
const mongoose = require ("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    // image :{
    //     type: String,
    //     default : "https://unsplash.com/photos/a-pool-of-water-surrounded-by-rocks-and-trees-zo_udYMcaVc",
    //     set : (v) => v === "" ? undefined : v
    // },
    image: {
    filename: String,
    url: {
        type: String,
        default : "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        set : (v) => v === "" ? "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" : v
        }  
    },
    price : {
        type: Number
    },
    location : {
        type: String
    },
    country : {
        type: String
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await review.deleteMany({_id : {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;