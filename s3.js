const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

/* -----------------------------------------------------------

    S3 VARS

/* -----------------------------------------------------------*/
const bucketName = process.env.bucketName;
const region = process.env.region;
const accessKeyId = process.env.accessKeyId;
const secreteAccessKey = process.env.secreteAccessKey;


/* -----------------------------------------------------------

    API CONTROLLER 

/* -----------------------------------------------------------*/
// api: list files
async function s3_list_api_get(req, res) {
    const ret = await s3_list_service();
    return res.send(ret);
}


// api: download file
async function s3_download_api_get(req, res) {
    const filePath = req.body.path + "/" + req.body.name;
    const ret = await s3_download_service(req.body.name, filePath);
    return res.send(ret);
}

// api: upload file
async function s3_upload_api_post(req, res) {
    const ret = await s3_upload_service(req.body.path, req.body.name);
    return res.send(ret);
}

// api: check if file exist
async function s3_exist_api_get(req, res) {
    const ret = await s3_fileExist_service(req.body.name);
    return res.send({ret: ret});
}

// api: delete file
async function s3_delete_api_get(req, res) {
    const ret = await s3_delete(req.body.name);
    return res.send(ret);
}


/* -----------------------------------------------------------

    FORM CONTROLLER

/* -----------------------------------------------------------*/


// form controller
async function s3_upload_form_post(req, res) {

    try {
   

        // put file into temp upload dir
        if (!req.files) {
            // render the error on the the page
            return res.send({code: 400, message: "File is undefined"});
        }      

        const file = req.files.file;
        const path = "./uploads/";
        const name =  file.name;

        // copy file to temp upload dir
        const temppath =  path + file.name;
        await file.mv(temppath);

        // check file copied
        if (await fs.existsSync(temppath) === false) {
            // render the error on the the page

            return res.send({code: 400, message: "Failed to copy file into temp dir", fullPath: temppath});
        }

        // send to s3
        const ret = await s3_upload_service(path, name);
        
        // remove file from temp dir
        await deleteLocalSystemFile(temppath);

        if (ret.code === 200) {
            // success
            return res.send({code: 200, ret: ret});

        }
        // fail
        return res.send({code: 400, ret: ret});
        

    } catch (e) {

        const resp = { 
            code: 500,
            message: "s3_upload_form_post exception", 
            error: e.stack
        }

        console.log(resp);

        // render the error on the the page
        return res.send(resp);

    }
 
}

/* -----------------------------------------------------------

    S3 SERVICE (this business logic)

/* -----------------------------------------------------------*/ 

// Upload a file to S3 service, pass in a filename and its path
async function s3_upload_service(filepath, filename) 
{

    try {

        const fullPath = filepath + filename; 

        // Check file exist
        if (await fs.existsSync(fullPath) === false) {
            return {code: 400, message: "File not found", fullPath: fullPath};
        }

        // Get file info (used to check file size later)
        const fileinfo = await fs.statSync(fullPath);

        // Read file into buffer
        const buffer = await fs.readFileSync(fullPath);

        //
        const s3 = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secreteAccessKey,
        })

        // Send to S3
        let response = await s3.upload({
            Bucket: bucketName,
            Key: filename,
            Body: buffer,
        }).promise();


        // Check file actual exists on s3
        const s3fileinfo = await s3_fileExist_service(response.key);

        // check s3 file size with our file size
        if (s3fileinfo.result.ContentLength === fileinfo.size) {
            
            // success
            return {
                code: 200, 
                message: "File uploaded successfuly", 
                fileinfo: fileinfo, 
                response: response, 
                s3fileinfo: s3fileinfo
            };
        }

        // unknown error
        return {
            code: 400, 
            message: "Unknown upload error, file size miss-match", 
            fileinfo: fileinfo, 
            response: response, 
            s3fileinfo: s3fileinfo
        };


    }  catch (e) {

        const resp = {
            code: 500, 
            message: "S3 upload exception", 
            error: e.stack
        }

        console.log(resp);
        return resp;

    }

}

// Delete a a file on local system
async function deleteLocalSystemFile(fullPath) {
    try {

        if (await fs.existsSync(fullPath) === true) {
            await fs.unlinkSync(fullPath);
            return true
        }

        return true;

    } catch (e) {

        console.log(e.stack);
        return false;

    }
}

// Check if file exists on s3
async function s3_fileExist_service(key) {

    try {

        const s3 = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secreteAccessKey,
        })

        const params = {
            Bucket: bucketName,
            Key: key //"apple.png"
        }

        // check if exist
        const result = await s3.headObject(params).promise();

        const response = {
            code: 200,
            message: "File exist in s3",
            result: result
        }

        return response;

    } catch (e) {

        // when not exist, exception is thrown
        const response = {
            code: 403,
            message: "File not found in S3 bucket",
            error: e
        }
        console.log({response: response});
        return response;
    }

}



// Download file and save to fullPath (path and filename)
// Example: fullPath = './downloads/red.png';
async function s3_download_service(key, filePath) {

    try {

        //
        const s3 = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secreteAccessKey,
        })
    
        //
        const params = {
            Bucket: bucketName,
            Key: key //"apple.png"
        }
    
        // get the file from s3
        const data = await s3.getObject(params).promise();
    
        // save to server filePath
        fs.writeFileSync(filePath, data.Body.toString());

        // on fiel write error, exception will be thrown.
        const response = {
            code: 300,
            message: "Download success",
            filePath: filePath
        }

        return response;


    } catch (e) {

        // file write , download error
        const response = {
            code: 403,
            message: "s3_download exception",
            error: e
        }
        console.log({response: response});
        return response;

    }

}


// Delete a file on S3
async function s3_delete(key) {

    try {
       
        //
        const s3 = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secreteAccessKey,
        })
    
        //
        const params = {
            Bucket: bucketName,
            Key: key //"apple.png"
        }

        // Delete the file on s3
        const result = await s3.deleteObject(params).promise();

        // S3 does not returns an object if it has been deleted.
        // we have to do out own sanity checks
        try {

            // test if file exist
            const result = await s3.headObject(params).promise();

             // file still exists 
            const response = {
                code: 400,
                message: "Delete failed, file still exist on S3",
            }
            return response

        } catch (e) {

            // file not exist 
            const response = {
                code: 200,
                message: "Delete success, file removed from S3",
            }
            return response

        }


    } catch (e) {

        const response = {
            code: 403,
            message: "s3_delete exception",
            error: e
        }
        console.log({response: response});
        return response;

    }

}

// List objects in S3 bucket
// requires "s3:ListBucket" in the AWS policy
async function s3_list_service() {

    try {

        const params = {
            Bucket: bucketName 
        }

        const s3 = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secreteAccessKey,
        })

        const result = await s3.listObjects(params).promise();

        // todo: add some response error handling here ?

        return result;

    } catch (e) {

        const resp = { 
            code: 500,
            message: "s3_list_api_get exception", 
            error: e.stack
        }

        console.log(resp);

        return resp;
    }
}

module.exports = {
    s3_upload_form_post,
    s3_upload_api_post,
    s3_exist_api_get,
    s3_download_api_get,
    s3_delete_api_get,
    s3_list_api_get
}