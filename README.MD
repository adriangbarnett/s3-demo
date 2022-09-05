# About
Demo of how to:
- Update file to S3 bucket
- Check file exists on S3 bucket
- Download file from S3 bucket
- Delete a file from S3 bucket
- List objects in S3 bucket

# Pre-req
- S3 bucket Very good tutorial: https://www.youtube.com/watch?v=NZElg91l_ms
- Example S3 Policy below to allow alless to the bucket

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::my-bucket-name/*",
                "arn:aws:s3:::my-bucket-name/"
            ]
        }
    ]
}



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

# AWS Console
https://eu-west-2.console.aws.amazon.com/console/home?region=eu-west-2#



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

