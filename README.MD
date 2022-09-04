# About
Demo of how to:
- Update file to S3 bucket
- Check file exists on S3 bucket
- Download file from S3 bucket
- Delete a file from S3 bucket

# Pre-req
Requires a S3 bucket where you can:
- Put file
- Get file
- Delete file
Very good tutorial: https://www.youtube.com/watch?v=NZElg91l_ms

# Setup
Create a .env file and define the required values:

bucketName=s3-xxxxxxxxx-eu-west-2
region=eu-west-2
accessKeyId=XXXXXXXXXXXX
secreteAccessKey=XXXXXXXXXXXXXXX

# Start
npm run dev

# Demo usage
- Use the requests in .s3.rest to test the integration.
- or use the index.ejs web form

# My git notes

echo "# s3-demo" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M master
git remote add origin https://github.com/adriangbarnett/s3-demo.git
git push -u origin master


…or push an existing repository from the command line
git remote add origin https://github.com/adriangbarnett/s3-demo.git
git branch -M master
git push -u origin master

