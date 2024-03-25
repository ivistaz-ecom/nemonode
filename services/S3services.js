const AWS = require('aws-sdk')
require('dotenv').config()
const spacesEndpoint = new AWS.Endpoint(proess.env.DO_SPACES_ENDPOINT); // e.g., "nyc3.digitaloceanspaces.com"

const uploadToS3=(data,filename)=>{
    try{
    const BUCKET_NAME = 'nemonode'
    const ACCESS_KEY =process.env.DO_ACCESS_KEY;
    const IAM_USER_KEY=process.env.DO_USER_KEY
    const SECRET_KEY=process.env.JWT_SECRET;

    let s3bucket = new AWS.S3({
        endpoint:spacesEndpoint,
        accessKeyId:ACCESS_KEY,
        secretAccessKey:SECRET_KEY,
    })
    
        var params = {
            Bucket:BUCKET_NAME,
            Key : filename,
            Body:data,
            ACL:'public-read'
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log('Something went wrong',err)
                    reject(err)
                }
                else{
                    resolve(s3response.Location)
                }
            })
        })
      
    }catch(err){
        console.log(err)
        return res.status(500).json({err,message:"Something went wrong"})
    }
}

    module.exports={
        uploadToS3
    }