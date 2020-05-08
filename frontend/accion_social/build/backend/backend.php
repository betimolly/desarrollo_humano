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
            $this->conexion = new PDO( "mysql:dbname=db_muni_cipo;host=192.168.0.123;charset=utf8", "desarrollo", "m4nz4n4c1p0", $options );
            //$this->conexion = new PDO( "mysql:dbname=db_muni_cipo;host=localhost;charset=utf8", "root", "admin", $options );

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
        $nro = $this->data->nrodoc."%";

        $query = $this->conexion->prepare ("select id, ndoc, apellido, nombre, fecha_nacimiento, calle, altura, barrio, telefono, email, profesion, baja, 
                                                    (SELECT denominacion_barrio FROM barrios WHERE num=barrio) AS nombre_barrio 
                                            from personas where ndoc like ? ");
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


    function SearchExactPersona() {
        $id = $this->data->id;

        $query = $this->conexion->prepare ("select id, ndoc, apellido, nombre, fecha_nacimiento, calle, altura, barrio, telefono, email, profesion, baja, 
                                                    (SELECT denominacion_barrio FROM barrios WHERE num=barrio) AS nombre_barrio 
                                            from personas where id=? ");
        $query->execute(array($id));
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }


    function SearchPersonaInstitucion() {
        $txt_search = $this->data->txt_search."%";
        $tipo = $this->data->pers_inst;

        if ($tipo == "persona") {
            $sql = "SELECT id AS numero, concat(tdoc , ' ' , ndoc , ' - ' , upper(nombre) , ' ', upper(apellido)) AS descripcion FROM personas WHERE ndoc like ?";
        }
        else {
            $sql = "SELECT id AS numero, CONCAT('CUIT ',cuit, ' - ',institucion) AS descripcion FROM acc_instituciones WHERE cuit LIKE ? ";
        }
        $query = $this->conexion->prepare ($sql);
        $query->execute(array($txt_search));
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }


    function SearchArticulo() {
        $id = $this->data->id;

        $query = $this->conexion->prepare ("SELECT id, descripcion, codigo_barra, cantidad_maxima, cantidad_minima, cantidad_unidad, id_rubro, id_subrubro,  
                                            id_marca_articulo, unidad_medida, envase, activo, fecha_baja, CASE WHEN perecedero='N' THEN 0 ELSE 1 END AS perecedero 
                                            FROM acc_articulos WHERE id = ? ");
        $query->execute(array($id));
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }


    function SearchProveedor() {
        $id = $this->data->id;

        $query = $this->conexion->prepare ("SELECT  id, razon_social, cuit, contacto, domicilio, telefono, email, id_localidad, observaciones_entrega, fecha_baja, 
                                                    CASE WHEN baja='N' THEN 'No' ELSE 'Si' END AS baja  
                                            FROM acc_proveedores WHERE id = ? ");
        $query->execute(array($id));
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }

    function SearchArticulosModulos() {
        $txt_search = $this->data->txt_search."%"; 
        $query = $this->conexion->prepare ("SELECT q.id, q.articulo FROM (
                                            SELECT  
                                            a.id, CONCAT(COALESCE(r.nombre,''), ' ', COALESCE(sr.nombre,''), ' ',a.descripcion, ' (', COALESCE(m.nombre,''), ')') AS articulo
                                            FROM acc_articulos a LEFT JOIN acc_rubros r ON a.id_rubro=r.id
                                            LEFT JOIN acc_subrubros sr ON a.id_subrubro=sr.id LEFT JOIN acc_marcas m ON a.id_marca_articulo=m.id
                                            ) q
                                            WHERE q.articulo LIKE ? ");
        $query->execute(array($txt_search));
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }


    function LoadBarrios() {
        $query = $this->conexion->prepare ("select num as clave, denominacion_barrio as valor from barrios");
        $query->execute();
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }

    function LoadRubros() {
        $query = $this->conexion->prepare ("SELECT id as clave, nombre as valor from acc_rubros");
        $query->execute();
        $response = $query->fetchAll();
        return json_encode($response);
    }

    function LoadSubRubros() {
        $id = $this->data->id;
        $query = $this->conexion->prepare ("SELECT id as clave, nombre as valor from acc_subrubros WHERE id_rubro=:id");
        $query->execute(array(':id' => $id));
        $response = $query->fetchAll();
        return json_encode($response);
    }

    private function LoadGenericData($tb) {
        $query = $this->conexion->prepare ("SELECT id as clave, nombre as valor from acc_tabla_parametricas WHERE tabla='$tb' ");
        $query->execute();
        $response = $query->fetchAll();
        return json_encode($response);
    }

    function LoadMarcas() {
        return $this->LoadGenericData('MARCAARTICULO');
    }

    function LoadUnidadMedida() {
        return $this->LoadGenericData('UNIDADMEDIDA');
    }

    function LoadEnvases() {
        return $this->LoadGenericData('ENVASE');
    }

    function LoadLocalidades() {
        $query = $this->conexion->prepare ("SELECT id as clave, denominacion as valor FROM localidades");
        $query->execute();
        $response = $query->fetchAll();
        return json_encode($response);
    }


    function ListaBeneficiarios() {
        $query = $this->conexion->prepare("SELECT 
                                                id, id_persona, 
                                                case when id_persona IS not NULL then (SELECT p.ndoc FROM personas p WHERE p.id=id_persona)
                                                    when id_institucion IS NOT NULL then (SELECT i.cuit FROM acc_instituciones i WHERE i.id=id_institucion)
                                                END  AS numero, 
                                                case when id_persona IS not NULL then (SELECT CONCAT(p.nombre, ' ', p.apellido) FROM personas p WHERE p.id=id_persona)
                                                    when id_institucion IS NOT NULL then (SELECT i.institucion FROM acc_instituciones i WHERE i.id=id_institucion)
                                                END  AS nombre,
                                                DATE_FORMAT(fecha_alta,'%d-%m-%Y') AS fecha_alta,
                                                case when activo = 'S' then 'Si' ELSE 'No' end AS activo, 
                                                observaciones, '' as familiares
                                            FROM acc_beneficiarios");
        $query->execute();    
        $response = [];
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $familiares = $this->ListaFamiliaresInt($row["id_persona"]);
            $row["familiares"] = $familiares; 
            $response[] = $row;
        }

        return json_encode($response);                              
    }


    function ListaPersonas() {
        $query = $this->conexion->prepare("SELECT 
                                                id, ndoc, nombre, apellido, 
                                                CONCAT(calle, ' ', altura) AS domicilio,
                                                DATE_FORMAT(fecha_nacimiento,'%d-%m-%Y') AS fecha_nacimiento,
                                                case when baja = 'S' then 'Si' ELSE 'No' end AS baja, 
                                                '' as familiares
                                           FROM personas");
        $query->execute();    
        $response = [];
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $familiares = $this->ListaFamiliaresInt($row["id"]);
            $row["familiares"] = $familiares; 
            $response[] = $row;
        }

        return json_encode($response);                              
    }


    function ListaInstituciones() {
        $query = $this->conexion->prepare("SELECT 
                                                id, cuit, institucion, 
                                                CONCAT(calle, ' ', altura) AS domicilio,
                                                telefono,
                                                (SELECT CONCAT(p.nombre,' ',p.apellido) FROM personas p WHERE id_persona=p.id) AS responsable,
                                                case when baja = 'S' then 'Si' ELSE 'No' end AS baja
                                            FROM acc_instituciones");
        $query->execute();  
        $response = $query->fetchAll(); 
        //return $response;
        return json_encode($response);  
    }


    function ListaFamiliares() {
        $id = $this->data->id_persona;
        $response = $this->ListaFamiliaresInt($id);
        return json_encode($response);                              
    }
    

    private function ListaFamiliaresInt($id) {
        $query = $this->conexion->prepare("SELECT f.*, CONCAT(p.tdoc, ' ', p.ndoc, ' - ', p.nombre, ' ', p.apellido) as familiar, 'N' as titular
                                            FROM acc_familiares f LEFT JOIN personas p on p.id=f.id_familiar
                                            WHERE id_persona=:id");
        $query->execute(array(':id' => $id));   
        $response = $query->fetchAll(); 

        //Verifico que, si no tiene familiares a cargo (como titular), que sea un miembro de un grupo familiar 
        if ( count($response) <= 0) {
            $query = $this->conexion->prepare("SELECT f.*, CONCAT(p.tdoc, ' ', p.ndoc, ' - ', p.nombre, ' ', p.apellido) as familiar, 'S' as titular
                                                FROM acc_familiares f LEFT JOIN personas p on p.id=f.id_persona
                                                WHERE id_familiar=:id");
            $query->execute(array(':id' => $id));   
            $response = $query->fetchAll(); 
        }
        return $response;
    }


    function ListaArticulos() {
        $query = $this->conexion->prepare("SELECT 
                                                id, descripcion, 
                                                case when perecedero = 'S' then 'Si' ELSE 'No' end AS perecedero,
                                                (select nombre from acc_marcas where id=id_marca_articulo) AS marca, 
                                                (select nombre from acc_rubros where id=id_rubro) AS rubro,  
                                                (select nombre from acc_subrubros where id=id_subrubro) AS subrubro, 
                                                envase, unidad_medida,
                                                case when activo = 'S' then 'Si' ELSE 'No' end AS activo
                                            FROM acc_articulos");
        $query->execute();  
        $response = $query->fetchAll(); 
        return json_encode($response);  
    }


    function ListaArticulosModulo() {
        $id = $this->data->id_art;
        $query = $this->conexion->prepare("SELECT 
                                                a.id, CONCAT(COALESCE(r.nombre,''), ' ', COALESCE(sr.nombre,''), ' ',a.descripcion, ' (', COALESCE(m.nombre,''), ')') AS articulo,
                                                mo.cantidad
                                            FROM acc_articulos a INNER JOIN acc_articulo_modulo mo ON mo.id_articulo=a.id LEFT JOIN acc_rubros r ON a.id_rubro=r.id
                                            LEFT JOIN acc_subrubros sr ON a.id_subrubro=sr.id LEFT JOIN acc_marcas m ON a.id_marca_articulo=m.id
                                            WHERE mo.id_modulo=:id");
        $query->execute(array(':id' => $id));  
        $response = $query->fetchAll(); 
        return json_encode($response);  
    }


    function ListaProveedores() {
        $query = $this->conexion->prepare("SELECT id, cuit, razon_social, domicilio, contacto, telefono,
                                                case when baja = 'S' then 'Si' ELSE 'No' end AS baja
                                           FROM acc_proveedores");
        $query->execute();  
        $response = $query->fetchAll(); 
        return json_encode($response);  
    }
    

    function DeleteBeneficiarios() {
        $ids = implode(',', $this->data->data); 
        $query = $this->conexion->prepare("UPDATE acc_beneficiarios set activo='N', fecha_baja=NOW() WHERE id in ($ids)");
        $query->execute();   
        $response = "Exito";
        return json_encode($response);                              
    }
    

    function DeleteInstituciones() {
        $ids = implode(',', $this->data->data); 
        $query = $this->conexion->prepare("UPDATE acc_instituciones set baja='S', fecha_baja=NOW() WHERE id in ($ids)");
        $query->execute();   
        $response = "Exito";
        return json_encode($response);                              
    }
    

    function DeletePersonas() {
        $ids = implode(',', $this->data->data);
        $query = $this->conexion->prepare("UPDATE personas set baja='S', fecha_baja=NOW() WHERE id in ($ids)");
        $query->execute();   
        $response = "Exito";
        return json_encode($response);                              
    }
    

    function DeleteArticulos() {
        $ids = implode(',', $this->data->data); 
        $query = $this->conexion->prepare("UPDATE acc_articulos set activo='N', fecha_baja=NOW() WHERE id in ($ids)");
        $query->execute();   
        $response = "Exito";
        return json_encode($response);                              
    }
    

    function DeleteProveedores() {
        $ids = implode(',', $this->data->data);
        $query = $this->conexion->prepare("UPDATE acc_proveedores set baja='S', fecha_baja=NOW() WHERE id in ($ids)");
        $query->execute();   
        $response = "Exito";
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

        try {
            if ($id == 0) {
                $query = $this->conexion->prepare ("insert into personas(id, tdoc, ndoc, apellido, nombre, fecha_nacimiento, calle, altura, barrio, localidad, provincia, telefono, email, profesion) 
                                                    values (:id, 'DNI', :ndoc, :apellido, :nombre, :fecha_nacimiento, :calle, :altura, :barrio, 2974, 62, :telefono, :email, :profesion)");
                $query->execute(array(':id' => $id, ':ndoc' => $ndoc, ':apellido' => $ape, ':nombre' => $nom, ':fecha_nacimiento' => $fec_nac, ':calle' => $calle, ':altura' => $altura, 
                                    ':barrio' => $barrio, ':telefono' => $tel, ':email' => $email, ':profesion' => $prof));
                $response = array("id" => $this->conexion->lastInsertId());
            }
            else {
                $valores = "ndoc=:ndoc, apellido=:apellido, nombre=:nombre, fecha_nacimiento=:fecha_nacimiento, calle=:calle, altura=:altura, barrio=:barrio, 
                            telefono=:telefono, email=:email, profesion=:profesion";
                $query = $this->conexion->prepare ("update personas set $valores where id=:id");
                $query->execute(array(':id' => $id, ':ndoc' => $ndoc, ':apellido' => $ape, ':nombre' => $nom, ':fecha_nacimiento' => $fec_nac, ':calle' => $calle, ':altura'=> $altura, 
                                    ':barrio' => $barrio, ':telefono' => $tel, ':email' => $email, ':profesion' => $prof));
                $response =  array("id" => $id);                    
            }
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        return json_encode($response);
    }


    function SaveInstitucion() {
        $id = $this->data->id;
        $instit = $this->data->institucion;
        $cuit = $this->data->cuit;
        $id_resp = $this->data->id_responsable;
        $tel = $this->data->telefono;
        $email = $this->data->email;
        $calle = $this->data->calle;
        $altura = $this->data->altura;
        $barrio = $this->data->id_barrio;
        $activ = $this->data->actividad;

        try {
            if ($id == 0) {
                $query = $this->conexion->prepare ("insert into acc_instituciones(id, institucion, cuit, id_persona, telefono, email, calle, altura, barrio, localidad, provincia, actividad) 
                                                    values (:id, :instit, :cuit, :id_resp, :telefono, :email, :calle, :altura, :barrio, 2974, 62, :activ)");
                $query->execute(array(':id' => $id, ':instit' => $instit, ':cuit' => $cuit, ':id_resp' => $id_resp, ':telefono' => $tel, ':email' => $email, ':calle' => $calle,
                                      ':altura' => $altura, ':barrio' => $barrio, ':activ' => $activ));
                $response = array("id" => $this->conexion->lastInsertId());
            }
            else {
                $valores = "id=:id, institucion=:instit, cuit=:cuit, id_persona=:id_resp, telefono=:telefono, email=:email, calle=:calle, altura=:altura, barrio=:barrio, 
                            actividad=:activ";
                $query = $this->conexion->prepare ("update acc_instituciones set $valores where id=:id");
                $query->execute(array(':id' => $id, ':instit' => $instit,  ':cuit' => $cuit, ':id_resp' => $id_resp, ':telefono' => $tel, ':email' => $email, 
                                      ':calle' => $calle, ':altura'=> $altura, ':barrio' => $barrio, ':activ' => $activ));
                $response = array("id" => $id);                   
            }
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos."];
        }

        return json_encode($response);
    }


    function SaveFamiliar() { 
        $id_titular = $this->data->id_titular;
        $parent = $this->data->parentesco;
        $id_familiar = $this->data->id_familiar;

        try {
                //Chequeo si ya existe el parentesco en la BD
                $query = $this->conexion->prepare ("SELECT id FROM acc_familiares WHERE id_persona=:id_persona AND id_familiar=:id_familiar");
                $query->execute(array(':id_persona' => $id_titular, ':id_familiar' => $id_familiar));
                $rta = $query->fetchAll();

                if ( count($rta) > 0) {
                    $id_parentesco = $rta[0]["id"];
                }
                else {
                    $id_parentesco = 0;
                }

                //Actualizo o inserto el parentesco
                if ($id_parentesco == 0) {
                    $query = $this->conexion->prepare ("insert into acc_familiares(id, id_persona, id_familiar, parentesco) 
                                                        values (NULL, :id_persona, :id_familiar, :parentesco)");
                    $query->execute(array(':id_persona' => $id_titular, ':id_familiar' => $id_familiar, ':parentesco' => $parent));
                    $response = array("id" => $this->conexion->lastInsertId()); 
                }        
                else {
                    $query = $this->conexion->prepare ("update acc_familiares set parentesco=:parentesco 
                                                        where id_persona=:id_persona and id_familiar=:id_familiar");
                    $result = $query->execute(array(':id_persona' => $id_titular, ':id_familiar' => $id_familiar, ':parentesco' => $parent));
                    $response = array("id" => $id_parentesco);  
                }   
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        return json_encode($response);
    }


    function SaveBeneficiario() { 
        $id = $this->data->id;
        $pers_inst = $this->data->es_persona_institucion;
        $id_pers_inst = $this->data->id_pers_inst;
        $nombre = $this->data->nombre;
        $beneficio_1 = $this->data->es_beneficiario_1;
        $beneficio_2 = $this->data->es_beneficiario_2;
        $beneficio_3 = $this->data->es_beneficiario_3;
        $tipo_beneficio_1 = $this->data->tipo_beneficio_1;
        $tipo_beneficio_2 = $this->data->tipo_beneficio_2;
        $tipo_beneficio_3 = $this->data->tipo_beneficio_3;
        $observaciones = $this->data->observaciones;
        $campos = "id, id_persona, id_institucion, beneficio_municipal, beneficio_provincial, beneficio_nacional, observaciones";
        $valores = "NULL, :id_persona, :id_institucion, :beneficio_municipal, :beneficio_provincial, :beneficio_nacional, :observaciones";

        try {
            if ($id == 0) {
                if ($pers_inst == "persona") {
                    $persona = $id_pers_inst;
                    $institucion = NULL;
                }
                else {
                    $persona = NULL;
                    $institucion = $id_pers_inst;
                }

                $query = $this->conexion->prepare ("INSERT INTO acc_beneficiarios($campos) VALUES ($valores)");
                $query->execute(array(':id_persona' => $persona, ':id_institucion' => $institucion, ':beneficio_municipal' => $tipo_beneficio_1, ':beneficio_provincial' => $tipo_beneficio_2,
                                      ':beneficio_nacional' => $tipo_beneficio_3, ':observaciones' => $observaciones));
                $rta = $query->fetchAll();

                $id = $this->conexion->lastInsertId();
            }
            $response = array("id" => $id);

        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        return json_encode($response);
    }


    function SaveArticulo() { 
        $id = $this->data->id;
        $descripcion = $this->data->descripcion;
        $perecedero = $this->data->perecedero ? "S" : "N";
        $cod_barra = $this->data->codigo_barra;
        $cant_max = $this->data->cantidad_maxima;
        $cant_min = $this->data->cantidad_minima;
        $cant_un = $this->data->cantidad_unidad;
        $id_subrubro = $this->data->id_subrubro;
        $id_rubro = $this->data->id_rubro;
        $id_marca = $this->data->id_marca_articulo;
        $un_medida = $this->data->unidad_medida;
        $envase = $this->data->envase;

        try {
                //Actualizo o inserto el artículo
                if ($id == 0) {
                    $query = $this->conexion->prepare ("insert into acc_articulos(id, descripcion, perecedero, codigo_barra, cantidad_maxima, cantidad_minima, 
                                                                                  cantidad_unidad, id_rubro, id_subrubro, id_marca_articulo, unidad_medida, envase) 
                                                        values (NULL, :descripcion, :perecedero, :codigo_barra, :cantidad_maxima, :cantidad_minima, :cantidad_unidad, 
                                                                :id_rubro, :id_subrubro, :id_marca_articulo, :unidad_medida, :envase)");
                    $query->execute(array(':descripcion' => $descripcion, ':perecedero' => $perecedero, ':codigo_barra' => $cod_barra, ':cantidad_maxima' => $cant_max, 
                                          ':cantidad_minima' => $cant_min, ':cantidad_unidad' => $cant_un, ':id_rubro' => $id_rubro, ':id_subrubro' => $id_subrubro,
                                          ':id_marca_articulo' => $id_marca, ':unidad_medida' => $un_medida, ':envase' => $envase));
                    $response = array("id" => $this->conexion->lastInsertId()); 
                }        
                else {
                    $query = $this->conexion->prepare ("update acc_articulos set descripcion=:descripcion, perecedero=:perecedero, codigo_barra=:codigo_barra, 
                                                                cantidad_maxima=:cant_max, cantidad_minima=:cant_min, cantidad_unidad=:cant_un, id_rubro=:id_rubro, 
                                                                id_subrubro=:id_subrubro, id_marca_articulo=:id_marca, unidad_medida=:un_medida, envase=:envase
                                                        where id=:id");
                    $result = $query->execute(array(':id' => $id, ':descripcion' => $descripcion, ':perecedero' => $perecedero, ':codigo_barra' => $cod_barra,
                                                    ':cant_max' => $cant_max, ':cant_min' => $cant_min, ':cant_un' => $cant_un, ':id_rubro' => $id_rubro,
                                                    ':id_subrubro' => $id_subrubro, ':id_marca' => $id_marca, ':un_medida' => $un_medida, ':envase' => $envase ));
                    $response = array("id" => $id);  
                }   
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        return json_encode($response);
    }


    function SaveProveedor() { 
        $id = $this->data->id;
        $cuit = $this->data->cuit;
        $razon_social = $this->data->razon_social;
        $contacto = $this->data->contacto;
        $domicilio = $this->data->domicilio;
        $telefono = $this->data->telefono;
        $email = $this->data->email;
        $id_localidad = $this->data->id_localidad;
        $observaciones = $this->data->observaciones_entrega;

        try {
                //Actualizo o inserto el proveedor
                if ($id == 0) {
                    $query = $this->conexion->prepare ("insert into acc_proveedores(id, cuit, razon_social, contacto, domicilio, telefono, email, id_localidad, observaciones_entrega) 
                                                        values (NULL, :cuit, :razon_social, :contacto, :domicilio, :telefono, :email, :id_localidad, :observaciones)");
                    $query->execute(array(':cuit' => $cuit, ':razon_social' => $razon_social, ':contacto' => $contacto, ':domicilio' => $domicilio, 
                                          ':telefono' => $telefono, ':email' => $email, ':id_localidad' => $id_localidad, ':observaciones' => $observaciones));
                    $response = array("id" => $this->conexion->lastInsertId()); 
                }        
                else {
                    $query = $this->conexion->prepare ("update acc_proveedores set cuit=:cuit, razon_social=:razon_social, contacto=:contacto, domicilio=:domicilio, 
                                                        telefono=:telefono, email=:email, id_localidad=:id_localidad, observaciones_entrega=:observaciones
                                                        where id=:id");
                    $result = $query->execute(array(':id' => $id, ':cuit' => $cuit, ':razon_social' => $razon_social, ':contacto' => $contacto, ':domicilio' => $domicilio, 
                                                    ':telefono' => $telefono, ':email' => $email, ':id_localidad' => $id_localidad, ':observaciones' => $observaciones ));
                    $response = array("id" => $id);  
                }   
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        return json_encode($response);
    }


    function SaveModuloArticulos() { 
        $id = $this->data->id;
        //$nombre_modulo = $this->data->nombre_modulo;
        $lista_articulos = $this->data->lista_articulos;

        try {
            //Primero, borro los artículos del módulo
            $query = $this->conexion->prepare ("delete from acc_articulo_modulo where id_modulo=:id");
            $query->execute(array(':id' => $id));

            //Guardo los artículos que componen al módulo
            foreach($lista_articulos as $art) { 
                $query = $this->conexion->prepare ("insert into acc_articulo_modulo(id_modulo, id_articulo, cantidad) 
                                                    values (:id_modulo, :id_articulo, :cantidad)");
                $query->execute(array(':id_modulo' => $id, ':id_articulo' => $art->id, ':cantidad' => $art->cantidad));
            } 
            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        return json_encode($response);
    }
    
    
}

$backend = new Backend();
$backend->ProcessRequest();
