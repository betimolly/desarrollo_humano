Aplicación reactjs

1. Instalar nodejs última versión
2. Creo una estructura de carpetas:
   AccionSocial 
		app
			backend
			frontend
				accion_social
		docs
2. Ejecutar 
		npx create-react-app accion_social
3.  Me fijo en el archivo package.json, y modifico, si corresponde el campo homepage. Quedaría así:
	    "homepage": "/accion_social"
4. Para generar versión web para apache, ejecuto en la carpeta frontend/accion_social
		npm run build
5. La carpeta build es la que se publica. Se copia en el servidor web y se ejecuta. 
6. Creo un enlace simbólico para ejecutar en apache:
    mklink /d accion_social  D:\Work\AccionSocial\app\frontend\accion_social\build
7. Para trabajarlo en forma local, tengo que ejecutar el servidor reactjs en la ubicación D:\Work\AccionSocial\app\frontend\accion_social\
    npm start
8. Para trabajar con php, instalo Axios:
    npm install axios
9. Creo un enlance simbólico para el backend:
    mklink /d backend  D:\Work\AccionSocial\app\backend
10. Copio el htaccess dentro de la carpeta accion_social. También en la carpeta public. Éste contiene la regla de reescritura para los links de acceso al backend.php
11. Para simular los links dentro de la app (la navegación en la aplicación), instalo react-router-dom:
    npm install react-router-dom
12. IMPORTANTE! CADA VEZ QUE HAGO npm run build, tengo que crear el enlace simbólico para el backend, para poder accederlo desde Apache. Lo hago desde la carpeta /build:
    mklink /d backend  D:\Work\AccionSocial\app\backend
13. Para desarrollo, y para pruebas, tuve que habilitar la opción de complementos de chrome (Allow CORS: Access-Control-Allow-Origin) 
14. Para el menú lateral, instalo react-sidenav:
	npm install --save react @trendmicro/react-sidenav
15. Para mostrar los iconos del navbar, instalo fontawesome:
	npm i --save @fortawesome/fontawesome-svg-core  @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
16. Para pasarlo a Linux, hay que habilitar el módulo mod_rewrite y modificar el apache.conf:
	1. sudo a2enmod rewrite
	2. <Directory /var/www/html>
			Options Indexes FollowSymLinks
			AllowOverride All
		</Directory>	
	3. 	Se comentó las líneas de .htacces que contienen el header. Sino, instalar el módulo mod_headers. No se realizó en linux local:
		sudo a2enmod headers (en caso de instalarse).
	4. sudo apache2 restart
17. Instalo material lab para incorporar los autocomplete:
	npm install @material-ui/lab
        