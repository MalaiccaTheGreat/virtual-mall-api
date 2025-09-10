$guid = [guid]::NewGuid().ToString('N')
@"
APP_NAME="Virtual Mall API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost
APP_KEY=base64:$guid

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=virtual_mall
DB_USERNAME=root
DB_PASSWORD=
"@ | Out-File -FilePath .env -Encoding utf8
