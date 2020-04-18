<?php

if (!isset($_SESSION)) {
    session_start();
}

class Backend {

    private $conexion = null;
    private $data = null;

    function __construct () {
        $this->data = json_decode(file_get_contents("php://input"));
        $options = array(
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
            PDO::ATTR_EMULATE_PREPARES => false
        );
        try {
            //$this->conexion = new PDO( "mysql:dbname=db_muni_cipo;host=192.168.1.177;charset=utf8", "desar", "4h3#gh3Lmj3", $options );
            $this->conexion = new PDO( "mysql:dbname=db_muni_cipo;host=localhost;charset=utf8", "root", "admin", $options );

        }catch(PDOException $e){
            $this->LogError($e);
        }
        catch(Exception $e){
            $this->LogError($e);
        }
    }

    function LogError($e) {
        //$file = fopen("/var/www/html/beneficiarios/log/log_errores_bd.txt", "a+");
        //fwrite($file, '>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<'."\r\n Fecha: ".date('d-m-Y H:i')."\r\nError:".$e."\r\n >>>>>>>>>>>>>>>FIN ERROR<<<<<<<<<<<<<<< \r\n \r\n ".PHP_EOL);
        //fclose($file);
        //die('No se pudo realizar la consulta:<br />');
    }

    public function ProcessRequest() {
        //
        //echo json_encode($data); exit;
        if(isset($_REQUEST["metodo"])){
            $metodo = $_REQUEST["metodo"];

            if(method_exists($this, $metodo)){
                echo $this->$metodo();
                exit;
            }
        }
    }


    function Login() {
        $u = $this->data->user;
        $p = $this->data->pass;

        $query = $this->conexion->prepare ("select * from usuarios where md5(usuario)=md5(:u) and password=md5(:p) and modulo='accion_social'");
        $query->execute(array(':u' => $u, ':p' => $p));
        $rta = $query->fetchAll();

        if ( count($rta)>0) {
            $response = [ "token" => sha1($u), "user" => $rta[0]["nombres"]];
        }
        else {
            $response = [ "error" => "Usuario o contraseña incorrecto."];
        }
        return json_encode($response);
    }


    function SearchPersona() {
        $nro = "%".$this->data->nrodoc."%";

        $query = $this->conexion->prepare ("select * from personas where ndoc like ? ");
        $query->execute(array($nro));
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }


    function SearchBarrio() {
        $nom = "%".$this->data->nombre."%";

        $query = $this->conexion->prepare ("select num, denominacion_barrio as barrio from barrios where denominacion_barrio like ? ");
        $query->execute(array($nom));
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }


    function SavePersona() {
        $id = $this->data->id;
        $ndoc = $this->data->ndoc;
        $nom = $this->data->nombre;
        $ape = $this->data->apellido;
        $fec_nac = $this->data->fecha_nacimiento;
        $tel = $this->data->telefono;
        $email = $this->data->email;
        $calle = $this->data->calle;
        $altura = $this->data->altura;
        $barrio = $this->data->barrio;
        $prof = $this->data->profesion;

        if ($id == 0) {
            $campos = "id, tdoc, ndoc, apellido, nombre, fecha_nacimiento, calle, altura, barrio, localidad, provincia, telefono, email, profesion";
            $valores = "NULL, 'DNI', $ndoc, '$ape', '$nom', '$fec_nac', '$calle', $altura, $barrio, 2974, 62, $tel, $email, '$prof' ";
            $query = $this->conexion->prepare ("insert into personas(id, tdoc, ndoc, apellido, nombre, fecha_nacimiento, calle, altura, barrio, localidad, provincia, telefono, email, profesion) 
                                                values (:id, :tdoc, :ndoc, :apellido, :nombre, :fecha_nacimiento, :calle, :altura, :barrio, :localidad, :provincia, :telefono, :email, :profesion)");
            $query->execute(array(':id' => $id, ':tdoc' => 'DNI', ':ndoc' => $ndoc, ':apellido' => $ape, ':nombre' => $nom, ':fecha_nacimiento' => $fec_nac, ':calle' => $calle, ':altura' => $altura, 
                                  ':barrio' => $barrio, ':localidad' => 2974, ':provincia' => 62, ':telefono' => $tel, ':email' => $email, ':profesion' => $prof));
        }
        else {
            /*$campos = "id, tdoc, ndoc, apellido, nombre, fecha_nacimiento, calle, altura, barrio, localidad, provincia, telefono, email, profesion";
            $valores = "id=$id, tdoc='DNI', ndoc=$ndoc, apellido='$ape', nombre='$nom', '$fec_nac', '$calle', $altura, $barrio, 2974, 62, $tel, $email, '$prof' ";
            $query = $this->conexion->prepare ("update personas set :v where id=$id");
            $query->execute(array(':v' => $valores));*/
        }
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = [ "id" => $rta[0]["id"]];
        }
        else {
            $response = [ "error" => "Error al registrar los datos."];
        }
        return json_encode($response);
    }
}

$backend = new Backend();
$backend->ProcessRequest();
