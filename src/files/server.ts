const FtpSrv = require('ftp-srv');
const path = require('path');

const ftpServer = new FtpSrv({
    url: 'ftp://0.0.0.0:2121',
    anonymous: false,
    file_format: 'ls'
});

// const minioClient = new Minio.Client({
//     endPoint: 'play.min.io',
//     port: 9000,
//     useSSL: true,
//     accessKey: 'XlkiuuQe2Uq126b02WpH',
//     secretKey: 'Dj5Xicl3uKsjJp40HIp745CgboSZcjQnqzQd3A95',
// })


ftpServer.on('login', ({ connection, username, password }, resolve, reject) => {

    if (username === '+998998137880' && password === '@123456') {
        resolve({ root: 'D:/Projects/fnn-express/uploads/projects' });
    }
    return reject(new Error('Invalid username or password'));
});


ftpServer.on('error', (err) => {
    console.error('Ошибка сервера FTP:', err);
});


ftpServer.listen()
    .then(() => console.log('FTP-сервер запущен!'))
    .catch(err => console.error('Ошибка запуска:', err));
