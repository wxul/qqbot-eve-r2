import axios, { AxiosRequestConfig } from 'axios';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import config from 'config';

export async function download(url: string, fileName: string, useTemp: boolean = false) {
    const path = useTemp ? resolve(process.cwd(), 'temp', fileName) : resolve(config.get<string>('image.mclPath'), fileName);
    await downloadFile(url, path);
    return path;
}

export async function downloadFile(fileUrl: string, outputLocationPath: string) {
    const writer = createWriteStream(outputLocationPath);

    return axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then((response) => {
        //ensure that the user can call `then()` only when the file has
        //been downloaded entirely.

        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error: any = null;
            writer.on('error', (err) => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                }
                //no need to call the reject here, as it will have been called in the
                //'error' stream;
            });
        });
    });
}

export async function request<T>(url: string, requestConfig?: AxiosRequestConfig) {
    try {
        const response = await axios.get<T>(url, requestConfig);
        // console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
