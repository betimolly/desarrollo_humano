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
            //$this->conexion = new PDO( "mysql:dbname=db_muni_cipo;host=192.168.0.123;charset=utf8", "desarrollo", "m4nz4n4c1p0", $options );
            $this->conexion = new PDO( "mysql:dbname=db_muni_cipo;host=localhost;charset=utf8", "root", "admin", $options );

        }catch(PDOException $e){
            $this->LogError($e);
        }
        catch(Exception $e){
            $this->LogError($e);
        }
    }

    function LogError($e) {
        $file = fopen("../log/log_errores_bd.txt", "a+");
        fwrite($file, '>>>>>>>>>>>>>>> ERROR <<<<<<<<<<<<<<<'."\r\n Fecha: ".date('d-m-Y H:i')."\r\nError:".$e."\r\n >>>>>>>>>>>>>>>FIN ERROR<<<<<<<<<<<<<<< \r\n \r\n ".PHP_EOL);
        fclose($file);
        //die('No se pudo realizar la consulta:<br />');
    }

    public function ProcessRequest() {
        //
        //echo json_encode($data); exit;
        try{
            if(isset($_REQUEST["metodo"])){
                $metodo = $_REQUEST["metodo"];

                if(method_exists($this, $metodo)){
                    echo $this->$metodo();
                    exit;
                }
            }            
        }
        catch(Exception $e){
            $this->LogError($e);
        }
    }


    function Login() {
        $u = $this->data->user;
        $p = $this->data->pass;

        $query = $this->conexion->prepare ("select * from seg_usuarios where md5(usuario)=md5(:u) and password=md5(:p) and modulo='accion_social'");
        $query->execute(array(':u' => $u, ':p' => $p));
        $rta = $query->fetchAll();

        if ( count($rta)>0) {

            //Recupero los accesos permitidos por rol de usuario
            $query2 = $this->conexion->prepare ("SELECT p.id, p.nombre, p.pagina, p.componente, p.icono, p.menu, p.padre, p.orden, r.id as id_rol 
                                                FROM seg_roles r left join seg_rol_paginas rp ON r.id=rp.rol LEFT JOIN seg_rol_usuarios u ON u.rol=r.id LEFT JOIN seg_paginas p 
                                                ON p.id=rp.pagina
                                                WHERE u.usuario=:id_u
                                                ORDER BY p.padre, p.orden");
            $query2->execute(array(':id_u' => $rta[0]["id"]));
            $resultado = $query2->fetchAll();
            $accesos = [];
            $mapIdToIndex = [];
            $indexPadre = 0;
            foreach ($resultado as $p) {
                if(is_null($p["padre"])){
                    $p["hijos"] = [];
                    $mapIdToIndex[$p["id"]] = $indexPadre;
                    $accesos[] = $p;
                    $indexPadre++;
                }
                else{
                    $accesos[$mapIdToIndex[$p["padre"]]]["hijos"][] = $p;
                }

                // array_push($accesos, array("id" => $p["id"], "nombre" => $p["nombre"], "pagina" => $p["pagina"], "componente" => $p["componente"], 
                //                            "icono" => $p["icono"], "menu" => $p["menu"], "padre" => $p["padre"]));
            }

            $response = [ "token" => sha1($u), "user" => $rta[0]["nombres"], "userid" => $rta[0]["usuario"], "rol" =>$resultado[0]["id_rol"], "pages" => $accesos ];
        }
        else {
            $response = [ "error" => "Usuario o contraseña incorrecto."];
        }
        return json_encode($response);
    }


    function SearchBarrio() {
        $txt_search = $this->data->txt_search."%";

        $query = $this->conexion->prepare ("select cod_barrio, denominacion_barrio AS barrio from barrios where denominacion_barrio LIKE  ? ");
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


    function SearchPersona() {
        $nro = $this->data->nrodoc."%";

        $query = $this->conexion->prepare ("select id, ndoc, apellido, nombre, fecha_nacimiento, calle, altura, barrio as id_barrio, telefono, email, nacionalidad, baja, 
                                            coalesce((SELECT denominacion_barrio FROM barrios WHERE cod_barrio=barrio), '') AS barrio, tiempo_residencia, escolaridad, situacion_salud 
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


    function SearchSimplePersona() {
        $nro = $this->data->nrodoc."%";

        $query = $this->conexion->prepare ("select id as id_responsable, CONCAT(ndoc,' - ',nombre, ' ',apellido) AS responsable from personas where ndoc like ? ");
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

        $query = $this->conexion->prepare ("select id, ndoc, sexo, cuil, apellido, nombre, fecha_nacimiento, calle, altura, barrio as id_barrio, telefono, email, nacionalidad, baja, 
                                            tiempo_residencia, escolaridad, situacion_salud, (SELECT denominacion_barrio FROM barrios WHERE cod_barrio=barrio) AS barrio  
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

        if ($tipo === "P") {
            $sql = "SELECT id AS numero, concat('DNI ' , ndoc , ' - ' , upper(nombre) , ' ', upper(apellido)) AS descripcion FROM personas WHERE ndoc like ?";
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


    function SearchExactPersonaInstitucion() {
        $id = $this->data->pers_inst;
        $tipo = $this->data->tipo;

        $sql = "SELECT *, 
                case when tipo='persona' then CONCAT('DNI ', numero, ' - ',nombre)  ELSE CONCAT('CUIT ', numero, ' - ',nombre) END AS descripcion
                FROM ( 
                    SELECT id,  
                        case when id_persona IS not NULL then id_persona
                            when id_institucion IS NOT NULL then id_institucion
                        END  AS id_beneficiario, 
                        case when id_persona IS not NULL then (SELECT p.ndoc FROM personas p WHERE p.id=id_persona)
                            when id_institucion IS NOT NULL then (SELECT i.cuit FROM acc_instituciones i WHERE i.id=id_institucion)
                        END  AS numero, 
                        case when id_persona IS not NULL then (SELECT CONCAT(p.nombre, ' ', p.apellido) FROM personas p WHERE p.id=id_persona)
                            when id_institucion IS NOT NULL then (SELECT i.institucion FROM acc_instituciones i WHERE i.id=id_institucion)
                        END  AS nombre,
                        case when id_persona IS NOT NULL then 'persona' ELSE 'institucion' END AS tipo,
                        DATE_FORMAT(fecha_alta,'%d-%m-%Y') AS fecha_alta,
                        case when activo = 'S' then 'Si' ELSE 'No' end AS activo, 
                        beneficio_municipal, beneficio_provincial, beneficio_nacional,
                        observaciones, '' as familiares
                    FROM acc_beneficiarios ) q 
                WHERE tipo = :tipo and id = :id";
        
        $query = $this->conexion->prepare ($sql);
        $query->execute(array(':id' => $id, ':tipo' => $tipo));
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }


    function SearchExactInstitucion() {
        $id = $this->data->id;

        $query = $this->conexion->prepare ("select id, institucion, cuit, id_persona AS id_responsable, telefono, email, calle, altura, barrio as id_barrio, actividad, baja, 
                                            (SELECT denominacion_barrio FROM barrios WHERE cod_barrio=barrio) AS barrio, 
                                            (SELECT CONCAT(p.ndoc,' - ',p.nombre, ' ',p.apellido) FROM personas p WHERE p.id=id_persona) AS responsable
                                            from acc_instituciones where id=? ");
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


    function SearchExactArticulo() {
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


    function SearchExactArticuloOC() {
        $txt_search = $this->data->txt_search."%"; 
        $txt_oc = $this->data->txt_oc; 
        $id_oc = $this->data->id_oc; 
        $params = [];

        if ($id_oc != "") {
            $where = " WHERE o.id = ? ";
            $params[] = $id_oc;
        }
        else {
            $where = " WHERE o.numero = ? ";
            $params[] = $txt_oc;
        }         
        $params[] = $txt_search;

        $sql = "SELECT q.id, q.articulo FROM (
                    SELECT  d.id_orden_compra, d.cantidad, d.precio_unitario,
                    a.id, CONCAT(COALESCE(r.nombre,''), ' ', COALESCE(sr.nombre,''), ' ',a.descripcion, ' (', COALESCE(m.nombre,''), ')') AS articulo                                            
                    FROM acc_orden_compra o LEFT JOIN acc_orden_compra_detalle d ON o.id=d.id_orden_compra 
                    LEFT JOIN acc_articulos a ON d.id_articulo=a.id LEFT JOIN acc_rubros r ON a.id_rubro=r.id LEFT JOIN acc_subrubros sr ON
                    a.id_subrubro=sr.id LEFT JOIN acc_marcas m ON a.id_marca_articulo=m.id
                    $where
                ) q
                WHERE q.articulo LIKE ? ";

        $query = $this->conexion->prepare ($sql);
        $query->execute($params);
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }


    function SearchArticulosOC() {
        $txt_search = $this->data->txt_search."%"; 
        $txt_oc = $this->data->txt_oc; 
        $id_oc = $this->data->id_oc; 
        $params = [];

        if ($id_oc != "") {
            $where = " WHERE o.id = ? ";
            $params[] = $id_oc;
        }
        else {
            $where = " WHERE o.numero = ? ";
            $params[] = $txt_oc;
        }         
        $params[] = $txt_search;

        $sql = "SELECT q.id, q.articulo FROM (
                    SELECT  d.id_orden_compra, d.cantidad, d.precio_unitario,
                    a.id, CONCAT(COALESCE(r.nombre,''), ' ', COALESCE(sr.nombre,''), ' ',a.descripcion, ' (', COALESCE(m.nombre,''), ')') AS articulo                                            
                    FROM acc_orden_compra o LEFT JOIN acc_orden_compra_detalle d ON o.id=d.id_orden_compra 
                    LEFT JOIN acc_articulos a ON d.id_articulo=a.id LEFT JOIN acc_rubros r ON a.id_rubro=r.id LEFT JOIN acc_subrubros sr ON
                    a.id_subrubro=sr.id LEFT JOIN acc_marcas m ON a.id_marca_articulo=m.id
                    $where
                ) q
                WHERE q.articulo LIKE ? ";

        $query = $this->conexion->prepare ($sql);
        $query->execute($params);
        $rta = $query->fetchAll();

        if ( count($rta) > 0) {
            $response = $rta;
        }
        else {
            $response = [ "error" => "No se encontraron datos."];
        }
        return json_encode($response);
    }
    

    private function SearchDetalleOCInt($id) {
        $query = $this->conexion->prepare("SELECT mo.id,
                                                CONCAT(COALESCE(r.nombre,''), ' ', COALESCE(sr.nombre,''), ' ',a.descripcion, ' (', COALESCE(m.nombre,''), ')') AS articulo,
                                                a.id as id_articulo, mo.cantidad, mo.precio_unitario
                                            FROM acc_articulos a INNER JOIN acc_orden_compra_detalle mo ON mo.id_articulo=a.id LEFT JOIN acc_rubros r ON a.id_rubro=r.id
                                            LEFT JOIN acc_subrubros sr ON a.id_subrubro=sr.id LEFT JOIN acc_marcas m ON a.id_marca_articulo=m.id
                                            WHERE id_orden_compra=:id");
        $query->execute(array(':id' => $id));   
        $response = $query->fetchAll(); 
        return $response;
    }


    function SearchOrdenCompra() {
        $id = $this->data->id;

        $query = $this->conexion->prepare("SELECT *, '' as detalleOC,
                                           (SELECT p.razon_social FROM acc_proveedores p WHERE p.id=id_proveedor) AS razon_social 
                                           FROM acc_orden_compra WHERE id=:id");
        $query->execute(array(':id' => $id));    
        $response = [];

        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $detalle = $this->SearchDetalleOCInt($id);
            $row["detalleOC"] = $detalle; 
            $response[] = $row;
        }

        return json_encode($response);
    }
    

    private function SearchDetalleFactInt($id) {
        $query = $this->conexion->prepare("SELECT 
                                                CONCAT(COALESCE(r.nombre,''), ' ', COALESCE(sr.nombre,''), ' ',a.descripcion, ' (', COALESCE(m.nombre,''), ')') AS articulo,
                                                a.id as id_articulo, mo.cantidad, mo.precio_unitario, mo.id_orden_compra_detalle
                                            FROM acc_factura_proveedor_detalle mo LEFT JOIN acc_orden_compra_detalle d ON d.id=mo.id_orden_compra_detalle LEFT JOIN 
                                                acc_articulos a ON d.id_articulo=a.id  LEFT JOIN acc_rubros r ON a.id_rubro=r.id LEFT JOIN acc_subrubros sr ON 
                                                a.id_subrubro=sr.id LEFT JOIN acc_marcas m ON a.id_marca_articulo=m.id
                                            WHERE id_factura_proveedor=:id");
        $query->execute(array(':id' => $id));   
        $response = $query->fetchAll(); 
        return $response;
    }


    function SearchFactura() {
        $id = $this->data->id;

        $query = $this->conexion->prepare("SELECT *, '' as detalleitemsfactura,
                                           (SELECT p.razon_social FROM acc_proveedores p WHERE p.id=id_proveedor) AS razon_social,
                                           (SELECT numero FROM acc_orden_compra o WHERE o.id=id_orden_compra) AS orden_compra 
                                           FROM acc_factura_proveedor WHERE id=:id");
        $query->execute(array(':id' => $id));    
        $response = [];

        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $detalle = $this->SearchDetalleFactInt($id);
            $row["detalleitemsfactura"] = $detalle; 
            $response[] = $row;
        }

        return json_encode($response);
    }


    function SearchBeneficiario() {
        $id = $this->data->id;

        $query = $this->conexion->prepare("SELECT *, '' as detalleitemsfactura,
                                           (SELECT p.razon_social FROM acc_proveedores p WHERE p.id=id_proveedor) AS razon_social,
                                           (SELECT numero FROM acc_orden_compra o WHERE o.id=id_orden_compra) AS orden_compra 
                                           FROM acc_factura_proveedor WHERE id=:id");
        $query->execute(array(':id' => $id));    
        $response = [];

        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $detalle = $this->SearchDetalleFactInt($id);
            $row["detalleitemsfactura"] = $detalle; 
            $response[] = $row;
        }

        return json_encode($response);
    }
    

    private function SearchDetalleBeneficiosInt($id) {
        $query = $this->conexion->prepare(" SELECT p.id_percibe AS clave, t.nombre AS valor 
                                            FROM acc_beneficiario_percibe p INNER JOIN acc_tabla_parametricas t ON t.id=p.id_percibe 
                                            WHERE p.fecha_baja IS null AND t.tabla='BENEFICIOS' AND p.id_beneficiario=:id");
        $query->execute(array(':id' => $id));   
        $response = $query->fetchAll(); 
        return $response;
    }


    function SearchSituacionEconomica() {
        $id = $this->data->id_ben;

        $query = $this->conexion->prepare ("select * from acc_beneficiario_economico where id_beneficiario=? ");
        $query->execute(array($id));
        $response = [];

        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $detalle = $this->SearchDetalleBeneficiosInt($id);
            $row["lista_percibe"] = $detalle; 
            $response[] = $row;
        }

        return json_encode($response);
    }


    function SearchSituacionHabitacional() {
        $id = $this->data->id_ben;

        $query = $this->conexion->prepare ("select * from acc_beneficiario_vivienda where id_beneficiario=? ");
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


    function SearchSituacionSalud() {
        $id = $this->data->id_ben;

        $query = $this->conexion->prepare ("select * from acc_beneficiario_salud where id_beneficiario=? ");
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


    function SearchSituacionEducacional() {
        $id = $this->data->id_ben;

        $query = $this->conexion->prepare ("select * from acc_beneficiario_educacion where id_beneficiario=? ");
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


    function SearchSituacionJudicial() {
        $id = $this->data->id_ben;

        $query = $this->conexion->prepare ("select * from acc_beneficiario_judicial where id_beneficiario=? ");
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


    function SearchSolicitud() {
        $id = $this->data->id;

        $query = $this->conexion->prepare ("SELECT s.*,
                                            case when ISNULL(id_institucion) then id_beneficiario ELSE id_institucion END AS id_pers_inst,
                                            case when ISNULL(id_institucion) then concat(p.nombre, ' ', p.apellido) ELSE i.institucion END AS descripcion
                                            FROM acc_solicitud_beneficiario s LEFT JOIN acc_instituciones i ON i.id=s.id_institucion LEFT JOIN personas p ON p.id=s.id_beneficiario
                                            WHERE s.id=? ");
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
    

    private function SearchDetalleRemitoBenefInt($id) {
        $query = $this->conexion->prepare("SELECT r.id,
                                                CONCAT(COALESCE(ru.nombre,''), ' ', COALESCE(sr.nombre,''), ' ',ar.descripcion, ' (', COALESCE(m.nombre,''), ')') AS articulo,
                                                r.id_articulo_partida, r.cantidad_asignada, r.cantidad_entregada
                                            FROM acc_remito_beneficiario_detalle r INNER JOIN acc_articulo_partida a ON r.id_articulo_partida=a.id LEFT JOIN acc_articulos ar ON a.id_articulo=ar.id
                                            LEFT JOIN acc_rubros ru ON ar.id_rubro=ru.id LEFT JOIN acc_subrubros sr ON ar.id_subrubro=sr.id LEFT JOIN acc_marcas m ON ar.id_marca_articulo=m.id
                                            WHERE r.id_remito=:id");
        $query->execute(array(':id' => $id));   
        $response = $query->fetchAll(); 
        return $response;
    }


    function SearchRemitoBenef() {
        $id = $this->data->id;

        $query = $this->conexion->prepare ("SELECT r.id, COALESCE(r.id_solicitud,0) AS id_solicitud, r.fecha_emision, r.fecha_entrega, r.forma_entrega, r.observaciones, 
                                            r.borrado, case when r.id_solicitud IS NOT null then ( 
                                            SELECT CONCAT(id, ' - ',
                                            case when id_institucion IS NOT NULL then (SELECT CONCAT(cuit, ' - ', institucion) FROM acc_instituciones WHERE id=s.id_institucion) 
                                            when id_beneficiario IS NOT NULL then (SELECT CONCAT(ndoc, ' - ', nombre, ' ', apellido) FROM personas WHERE id=s.id_beneficiario) END) 
                                            FROM acc_solicitud_beneficiario s
                                            WHERE s.id=r.id_solicitud ) 
                                            ELSE '' END AS solicitud, '' as detalleremito
                                            FROM acc_remito_beneficiario r LEFT JOIN acc_solicitud_beneficiario s ON r.id_solicitud=s.id 
                                            WHERE r.id=? ");
        $query->execute(array($id));
        $response = [];

        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            $detalle = $this->SearchDetalleRemitoBenefInt($id);
            $row["detalleremito"] = $detalle; 
            $response[] = $row;
        }

        return json_encode($response);
    }


    function LoadBarrios() {
        $query = $this->conexion->prepare ("select cod_barrio as clave, denominacion_barrio as valor from barrios");
        $query->execute();
        $response = $query->fetchAll();
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

    function LoadBeneficios() {
        return $this->LoadGenericData('BENEFICIOS');
    }

    function LoadLocalidades() {
        $query = $this->conexion->prepare ("SELECT id as clave, denominacion as valor FROM localidades");
        $query->execute();
        $response = $query->fetchAll();
        return json_encode($response);
    }

    function LoadProveedores() {
        $query = $this->conexion->prepare ("SELECT id as clave, razon_social as valor FROM acc_proveedores");
        $query->execute();
        $response = $query->fetchAll();
        return json_encode($response);
    }

    function LoadOrdenesCompras() {
        $query = $this->conexion->prepare ("SELECT id, numero FROM acc_orden_compra");
        $query->execute();
        $response = $query->fetchAll();
        return json_encode($response);
    }

    function LoadDetalleOC() {
        $id = $this->data->id;
        $response = $this->SearchDetalleOCInt($id);
        return json_encode($response);
    }

    function LoadFilesFromLegajo() {
        $id = $this->data->id;
        $query = $this->conexion->prepare ("SELECT * FROM acc_archivos_legajo WHERE id_beneficiario=:id and borrado='N' ");
        $query->execute( array(':id' => $id));
        $response = $query->fetchAll();
        return json_encode($response);
    }

    function LoadPaises() {
        $query = $this->conexion->prepare ("SELECT * FROM paises");
        $query->execute();
        $response = $query->fetchAll();
        return json_encode($response);
    }

    function LoadSolicitudes() {
        $query = $this->conexion->prepare ("SELECT id AS id_solicitud, CONCAT(id, ' - ',
                                            case when id_institucion IS NOT NULL then (SELECT CONCAT(cuit, ' - ', institucion) FROM acc_instituciones WHERE id=s.id_institucion) 
                                            when id_beneficiario IS NOT NULL then (SELECT CONCAT(ndoc, ' - ', nombre, ' ', apellido) FROM personas WHERE id=s.id_beneficiario) END) AS solicitud
                                            FROM acc_solicitud_beneficiario s 
                                            WHERE estado <> 3");
        $query->execute();
        $response = $query->fetchAll();
        return json_encode($response);
    }


    function ListaBeneficiarios() {
        $query = $this->conexion->prepare("SELECT b.id, b.id_persona, ndoc, CONCAT(nombre, ' ', apellido) AS nombre,
                                           DATE_FORMAT(fecha_alta,'%d-%m-%Y') AS fecha_alta, formacion, situacion_laboral,
                                           case when activo = 'S' then 'Si' ELSE 'No' end AS activo, 
                                           observaciones, '' as familiares
                                           FROM acc_beneficiarios b LEFT JOIN personas p ON p.id=b.id_persona");                                    
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
                                            WHERE id_titular=:id");
        $query->execute(array(':id' => $id));   
        $response = $query->fetchAll(); 

        //Verifico que, si no tiene familiares a cargo (como titular), que sea un miembro de un grupo familiar 
        if ( count($response) <= 0) {
            $query = $this->conexion->prepare("SELECT f.*, CONCAT(p.tdoc, ' ', p.ndoc, ' - ', p.nombre, ' ', p.apellido) as familiar, 'S' as titular
                                                FROM acc_familiares f LEFT JOIN personas p on p.id=f.id_titular
                                                WHERE id_familiar=:id");
            $query->execute(array(':id' => $id));   
            $response = $query->fetchAll(); 
        }
        return $response;
    }
    

    private function ListaFamiliaresBenef() {
        $id = $this->data->id_persona;
        $query = $this->conexion->prepare("SELECT f.id, f.id_titular, f.id_familiar, p.ndoc, p.sexo, p.cuil, p.nombre, p.apellido, f.parentesco, FALSE as titular, calle, 
                                           fecha_nacimiento, altura, barrio as id_barrio, telefono, email, nacionalidad, baja, tiempo_residencia, escolaridad, situacion_salud, 
                                           (SELECT denominacion_barrio FROM barrios WHERE cod_barrio=barrio) AS barrio 
                                           FROM acc_familiares f LEFT JOIN personas p on p.id=f.id_familiar
                                           WHERE id_titular=:id");
        $query->execute(array(':id' => $id));   
        $response = $query->fetchAll(); 

        //Verifico que, si no tiene familiares a cargo (como titular), que sea un miembro de un grupo familiar 
        /*if ( count($response) <= 0) {
            $query = $this->conexion->prepare("SELECT f.id, f.id_titular, f.id_familiar, p.ndoc, p.nombre, p.apellido, f.parentesco, TRUE as titular, fecha_nacimiento, calle,  
                                               altura, barrio as id_barrio, telefono, email, nacionalidad, baja, tiempo_residencia, escolaridad, situacion_salud, 
                                               (SELECT denominacion_barrio FROM barrios WHERE cod_barrio=barrio) AS barrio 
                                               FROM acc_familiares f LEFT JOIN personas p on p.id=f.id_familiar
                                               WHERE id_familiar=:id");
            $query->execute(array(':id' => $id));   
            $response = $query->fetchAll(); 
        }*/
        return json_encode($response);
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


    function ListaOrdenesCompra() {
        $query = $this->conexion->prepare("SELECT c.*, p.razon_social FROM acc_orden_compra c LEFT JOIN acc_proveedores p ON p.id=c.id_proveedor");
        $query->execute();  
        $response = $query->fetchAll(); 
        return json_encode($response);  
    }


    function ListaFacturas() {
        $query = $this->conexion->prepare("SELECT f.*, p.razon_social, o.numero as orden_compra FROM acc_factura_proveedor f LEFT JOIN acc_proveedores p ON 
                                           p.id=f.id_proveedor LEFT JOIN acc_orden_compra o ON o.id=f.id_orden_compra");
        $query->execute();  
        $response = $query->fetchAll(); 
        return json_encode($response);  
    }


    function ListaSolicitudes() {
        $query = $this->conexion->prepare("SELECT s.id, DATE_FORMAT(s.fecha_emision,'%d-%m-%Y') AS fecha_emision, s.es_persona_institucion, s.tipo_beneficio, 
                                           case when s.estado='1' then 'Solicitada' 
                                            when s.estado='2' then 'Aprobada' 
                                            when s.estado='3' then 'Entregada'
                                           end as estado,
                                           s.observaciones, s.id_remito, s.borrado, s.fecha_baja,
                                           case when es_persona_institucion='P' then 'Persona' ELSE 'Institución' END AS es_pers_inst, 
                                           case when ISNULL(id_institucion) then id_beneficiario ELSE id_institucion END AS id_pers_inst,
                                           case when ISNULL(id_institucion) then p.ndoc ELSE i.cuit END AS documento, 
                                           case when ISNULL(id_institucion) then concat(p.nombre, ' ', p.apellido) ELSE i.institucion END AS descripcion
                                           FROM acc_solicitud_beneficiario s LEFT JOIN acc_instituciones i ON i.id=s.id_institucion LEFT JOIN personas p ON 
                                           p.id=s.id_beneficiario");
        $query->execute();  
        $response = $query->fetchAll(); 
        return json_encode($response);  
    }


    function ListaRemitosBeneficiarios() {
        $query = $this->conexion->prepare("SELECT id, id_solicitud, fecha_emision, fecha_entrega, observaciones,
                                           case when forma_entrega=1 then 'Mesa de Entrada' ELSE 'Reparto' END AS forma_entrega
                                           FROM acc_remito_beneficiario");
        $query->execute();  
        $response = $query->fetchAll(); 
        return json_encode($response);  
    }
    

    function DeleteBeneficiarios() {
        $ids = implode(',', $this->data->lista); 
        
        foreach( $this->data->data as $e ) {
            $estado = ( $e->activo == "No") ? "S" : "N"; 
            //$query = $this->conexion->prepare("UPDATE acc_beneficiarios set activo='N', fecha_baja=NOW() WHERE id in ($ids)");
            $query = $this->conexion->prepare("UPDATE acc_beneficiarios set activo = :estado, fecha_baja=NOW() WHERE id = :id");
            $query->execute( array(':estado' => $estado, ':id' => $e->id) ); 
        }
          
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
    

    /*function DeleteOrdenesCompra() {
        $ids = implode(',', $this->data->data);
        $query = $this->conexion->prepare("UPDATE acc_proveedores set baja='S', fecha_baja=NOW() WHERE id in ($ids)");
        $query->execute();   
        $response = "Exito";
        return json_encode($response);                              
    }*/
    

    function DeleteFile() {
        $id = $this->data->id;
        $query = $this->conexion->prepare("UPDATE acc_archivos_legajo set borrado='S' WHERE id = :id");
        $query->execute(array(':id' => $id));   
        $response = "Exito";
        return json_encode($response);                              
    }
    

    function DeleteFamiliar() {
        $id = $this->data->id;
        $query = $this->conexion->prepare("DELETE FROM acc_familiares WHERE id = :id");
        $query->execute(array(':id' => $id));   
        $response = "Exito";
        return json_encode($response);                              
    }
    

    function DeleteSolicitud() {
        $ids = implode(',', $this->data->data); 
        $query = $this->conexion->prepare("UPDATE acc_solicitud_beneficiario set borrado='S', fecha_baja=NOW() WHERE id in ($ids)");
        $query->execute();   
        $response = "Exito";
        return json_encode($response);                              
    }
    

    function DeleteRemitoBeneficiario() {
        $ids = implode(',', $this->data->data); //$this->LogError("UPDATE acc_solicitud_beneficiario set borrado='S', fecha_baja=NOW() WHERE id in ($ids)");
        $query = $this->conexion->prepare("UPDATE acc_remito_beneficiario set borrado='S', fecha_baja=NOW() WHERE id in ($ids)");
        $query->execute();   
        $response = "Exito";
        return json_encode($response);                              
    }
    

    function UploadFileServer() {
        $id = $this->data->id; 
        $name = $this->data->name; 
        $file = $this->data->file;
        try {
            //Guardo en filesystem
            if ($id !== "") {
                $p ="../archivos/{$id}"; //$p = realpath("../archivos")."/{$id}";
                if (!is_dir($p)) {
                    mkdir($p);
                }
                $filepath = $p."/".$name; //realpath("../archivos")."/Legajo_".$id."/".$name;
            }
            else {
                $filepath = realpath("../archivos")."/".$name;
            } 

            $base_to_php = explode(',', $file);
            $data = base64_decode($base_to_php[1]);
            file_put_contents($filepath, $data);  

            //Guardo en BD
            $query = $this->conexion->prepare("INSERT INTO acc_archivos_legajo values (null, :id, :arch, :pathar, :descrip, 'N', NOW())");
            $query->execute(array(':id' => $id, ':arch' => $name, ':pathar' => "/desarrollo_humano/archivos/".$id."/".$name, ':descrip' => ''));  
            $res_id = $this->conexion->lastInsertId();

            $response = array("id" => $res_id);
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        
        return json_encode($response);                              
    }
    

    function ModifyDescriptionFile() {
        $id = $this->data->id; 
        $name = $this->data->name; 
        try {
            $query = $this->conexion->prepare("UPDATE acc_archivos_legajo set descripcion=:descrip WHERE id=:id");
            $query->execute(array( ':id' => $id, ':descrip' => $name ));  
            $response = "Exito";
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        
        return json_encode($response);                              
    }
    

    function SavePersona() {
        $id = $this->data->id;
        $ben = $this->data->beneficiario;
        $ndoc = $this->data->ndoc;
        $cuil = $this->data->cuil;
        $sexo = $this->data->sexo;
        $nom = $this->data->nombre;
        $ape = $this->data->apellido;
        $fec_nac = $this->data->fecha_nacimiento;
        $tel = $this->data->telefono;
        $parentesco = $this->data->parentesco;
        $email = $this->data->email;
        $calle = $this->data->calle;
        $altura = $this->data->altura;
        $barrio = $this->data->id_barrio;
        $nac = $this->data->nacionalidad;
        $resi = $this->data->tiempo_residencia;
        $escol = $this->data->escolaridad;
        $salud = $this->data->situacion_salud;
        $titular = $this->data->titular;

        try {
            if ($id == 0) {
                $query = $this->conexion->prepare ("insert into personas(id, tdoc, ndoc, sexo, cuil, apellido, nombre, fecha_nacimiento, calle, altura, barrio, localidad, provincia, telefono, email, 
                                                    nacionalidad, tiempo_residencia, escolaridad, situacion_salud) 
                                                    values (:id, 'DNI', :ndoc, :sexo, :cuil, :apellido, :nombre, :fecha_nacimiento, :calle, :altura, :barrio, 2974, 62, :telefono, :email, 
                                                    :nacionalidad, :tiempo, :escolaridad, :salud)");
                $query->execute(array(':id' => $id, ':ndoc' => $ndoc, ':sexo' => $sexo, ':cuil' => $cuil, ':apellido' => $ape, ':nombre' => $nom, ':fecha_nacimiento' => $fec_nac, 
                                    ':calle' => $calle, ':altura' => $altura, ':barrio' => $barrio, ':telefono' => $tel, ':email' => $email, ':nacionalidad' => $nac, ':tiempo'=>$resi,
                                    ':escolaridad' => $escol, ':salud' => $salud ));
                $id = $this->conexion->lastInsertId();
            }
            else {
                $valores = "ndoc=:ndoc, sexo=:sexo, cuil=:cuil, apellido=:apellido, nombre=:nombre, fecha_nacimiento=:fecha_nacimiento, calle=:calle, altura=:altura, barrio=:barrio, 
                            telefono=:telefono, email=:email, nacionalidad=:nacionalidad, tiempo_residencia=:tiempo, escolaridad=:escolaridad, situacion_salud=:salud";
                $query = $this->conexion->prepare ("update personas set $valores where id=:id");
                $query->execute(array(':id' => $id, ':ndoc' => $ndoc, ':sexo' => $sexo, ':cuil' => $cuil, ':apellido' => $ape, ':nombre' => $nom, ':fecha_nacimiento' => $fec_nac, ':calle' => $calle, 
                                    ':altura'=> $altura, ':barrio' => $barrio, ':telefono' => $tel, ':email' => $email, ':nacionalidad' => $nac, ':tiempo'=>$resi, ':escolaridad' => $escol, 
                                    ':salud' => $salud));                   
            }

            if (($ben == 0) && $titular) {
                $query = $this->conexion->prepare ("insert into acc_beneficiarios(id, id_persona) values (NULL, :id)");
                $query->execute(array(':id' => $id));
                $ben = $this->conexion->lastInsertId();
            }

            $response = array("id" => $id, "ben" => $ben);
            
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        return json_encode($response);
    }


    function SaveFamiliar() { 
        $id_titular = $this->data->id_titular;
        $parent = $this->data->parentesco;
        $id = $this->data->id;

        try {
            //Reemplazo ids para guardado de familiar
            $this->data->id = $this->data->id_familiar;
            $rta = $this->SavePersona(); 
            $rta = json_decode($rta); 
            $id_familiar = $rta->id;

            //Actualizo o inserto el parentesco
            if ($id == 0) { //$id_parentesco
                $query = $this->conexion->prepare ("insert into acc_familiares(id, id_titular, id_familiar, parentesco) 
                                                    values (NULL, :id_titular, :id_familiar, :parentesco)");
                $query->execute(array(':id_titular' => $id_titular, ':id_familiar' => $id_familiar, ':parentesco' => $parent));
                $id = $this->conexion->lastInsertId(); 
            }        
            else {
                $query = $this->conexion->prepare ("update acc_familiares set parentesco=:parentesco, id_titular=:id_titular, id_familiar=:id_familiar
                                                    where id=:id");
                $result = $query->execute(array(':id_titular' => $id_titular, ':id_familiar' => $id_familiar, ':parentesco' => $parent, ':id' => $id));
            }   

            $response = array("id" => $id, "id_familiar" => $id_familiar); 
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
                $valores = " institucion=:instit, cuit=:cuit, id_persona=:id_resp, telefono=:telefono, email=:email, calle=:calle, altura=:altura, barrio=:barrio, 
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


    /*function SaveBeneficiario() { 
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

        try {
            //Verifico si es persona o institución
            if ($pers_inst == "persona") {
                $persona = $id_pers_inst;
                $institucion = NULL;
            }
            else {
                $persona = NULL;
                $institucion = $id_pers_inst;
            }

            if ($id == 0) {
                $query = $this->conexion->prepare ("INSERT INTO acc_beneficiarios(id_persona, id_institucion, beneficio_municipal, beneficio_provincial, beneficio_nacional, observaciones) 
                                                    VALUES (:id_pers, :id_inst, :ben_muni, :ben_prov, :ben_nac, :obs)");
                $query->execute(array(':id_pers' => $persona, ':id_inst' => $institucion, ':ben_muni' => $tipo_beneficio_1, ':ben_prov' => $tipo_beneficio_2, ':ben_nac' => $tipo_beneficio_3, 
                                      ':obs' => $observaciones));
                $rta = $query->fetchAll();
                $id = $this->conexion->lastInsertId();
            }
            else {
                $query = $this->conexion->prepare ("UPDATE acc_beneficiarios SET id_persona=:id_pers, id_institucion=:id_inst, beneficio_municipal=:ben_muni, 
                                                    beneficio_provincial=:ben_prov, beneficio_nacional=:ben_nac, observaciones=:obs
                                                    WHERE id=:id ");
                $query->execute(array(':id_pers' => $persona, ':id_inst' => $institucion, ':ben_muni' => $tipo_beneficio_1, ':ben_prov' => $tipo_beneficio_2, ':ben_nac' => $tipo_beneficio_3, 
                                      ':obs' => $observaciones, ':id' => $id));
                $rta = $query->fetchAll();
            }

            $response = array("id" => $id);

        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        return json_encode($response);
    }*/


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


    function SaveOrdenCompra() { 
        $id = $this->data->id;
        $nro = $this->data->numero;
        $expe = $this->data->numero_expediente;
        $resol = $this->data->numero_resolucion;
        $fecha_e = $this->data->fecha_emision;
        $plazo = $this->data->plazo_entrega;
        $es_ext = $this->data->proveedor_externo ? "S" : "N";
        $destino = $this->data->destino;
        $id_prov = $this->data->id_proveedor;
        $observ = $this->data->observaciones_entrega;
        $detalleOC = $this->data->detalleordencompra;


        try {
            //Guardo los datos de la orden de compra
            if ($id == 0) {
                $query = $this->conexion->prepare ("insert into acc_orden_compra(numero, numero_expediente, numero_resolucion, fecha_emision, plazo_entrega, proveedor_externo,
                                                    destino, id_proveedor, observaciones_entrega) values (:nro, :expe, :resol, :fecha, :plazo, :exter, :dest, :prov, :obs)");
                $query->execute(array(':nro' => $nro, ':expe' => $expe, ':resol' => $resol, ':fecha' => $fecha_e, ':plazo' => $plazo, ':exter' => $es_ext, ':dest' => $destino,
                                      ':prov' => $id_prov, ':obs' => $observ));
                $id = $this->conexion->lastInsertId();                      
            }
            else {
                $query = $this->conexion->prepare ("update acc_orden_compra set numero=:nro, numero_expediente=:expe, numero_resolucion=:resol, fecha_emision=:fecha, 
                                                    plazo_entrega=:plazo, proveedor_externo=:exter, destino=:dest, id_proveedor=:prov, observaciones_entrega=:obs
                                                    where id=:id");
                $query->execute(array(':nro' => $nro, ':expe' => $expe, ':resol' => $resol, ':fecha' => $fecha_e, ':plazo' => $plazo, ':exter' => $es_ext, ':dest' => $destino,
                                      ':prov' => $id_prov, ':obs' => $observ, ':id' => $id));
            }
            
            //Guardo los artículos/detalles que componen a la orden de compras
            $query = $this->conexion->prepare ("delete from acc_orden_compra_detalle where id_orden_compra=:id");
            $query->execute(array(':id' => $id));
            foreach($detalleOC as $det) { 
                $query = $this->conexion->prepare ("insert into acc_orden_compra_detalle(cantidad, precio_unitario, id_orden_compra, id_articulo) 
                                                    values (:cant, :precio, :id_oc, :id_articulo)");
                $query->execute(array(':cant' => $det->cantidad, ':precio' => $det->precio_unitario, ':id_oc' => $id, ':id_articulo' => $det->id_articulo));
            } 

            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos.".$e];
        }
        return json_encode($response);
    }


    function SaveFactura() { 
        $id = $this->data->id;
        $nro = $this->data->numero;
        $fecha = $this->data->fecha;
        $id_oc = $this->data->id_orden_compra;
        $id_prov = $this->data->id_proveedor;
        $observ = $this->data->observaciones;
        $detalle = $this->data->detalleitemsfactura;

        try {
            //Guardo los datos de la factura
            if ($id == 0) {
                $query = $this->conexion->prepare ("insert into acc_factura_proveedor(numero, fecha, observaciones, id_proveedor, id_orden_compra)
                                                    values (:nro, :fecha, :obs, :prov, :id_oc )");
                $query->execute(array(':nro' => $nro, ':fecha' => $fecha, ':obs' => $observ, ':prov' => $id_prov, ':id_oc' => $id_oc));
                $id = $this->conexion->lastInsertId();                      
            }
            else {
                $query = $this->conexion->prepare ("update acc_factura_proveedor set numero=:nro, fecha=:fecha, observaciones=:obs, id_proveedor=:prov, id_orden_compra=:id_oc 
                                                    where id=:id");
                $query->execute(array(':nro' => $nro, ':fecha' => $fecha, ':obs' => $observ, ':prov' => $id_prov, ':id_oc' => $id_oc, ':id' => $id));
            }
            
            //Guardo los artículos/detalles que componen a la factura
            $query = $this->conexion->prepare ("delete from acc_factura_proveedor_detalle where id_factura_proveedor=:id");
            $query->execute(array(':id' => $id));
            foreach($detalle as $det) { 
                $query = $this->conexion->prepare ("insert into acc_factura_proveedor_detalle(cantidad, precio_unitario, id_factura_proveedor, id_orden_compra_detalle) 
                                                    values (:cant, :precio, :id_fac, :id_oc_det)");
                $query->execute(array(':cant' => $det->cantidad, ':precio' => $det->precio_unitario, ':id_fac' => $id, ':id_oc_det' => $det->id_orden_compra_detalle));
            } 

            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos."];
        }
        return json_encode($response);
    }


    function SaveSituacionEconomica() { 
        $id = $this->data->id;
        $id_ben = $this->data->id_beneficiario;
        $tit_trab = $this->data->titular_trabaja ? "S" : "N";
        $activ = $this->data->actividad;
        $formal = $this->data->formal ? "S" : "N";
        $ing_fijo = $this->data->ingreso_fijo ? "S" : "N";
        $fliar_trab = $this->data->familiar_trabaja ? "S" : "N";
        $activ_fliar = $this->data->actividad_familiar;
        $formal_fliar = $this->data->formal_familiar ? "S" : "N";
        $ing_fijo_fliar = $this->data->ingreso_fijo_familiar ? "S" : "N";
        $percibe_alim = $this->data->percibe_alimentos_estado ? "S" : "N";
        $retira_alim = $this->data->retira_alimentos ? "S" : "N";
        $percibe_alim_soc = $this->data->percibe_alimentos_soc ? "S" : "N";
        $alim_menores = $this->data->alimentacion_menores ? "S" : "N";
        $lista_percibe = $this->data->lista_percibe;

        try {
            if ($id == "0") {
                $query = $this->conexion->prepare ("insert into acc_beneficiario_economico values (NULL, :id_ben, :tit_trab, :activ, :formal, :ing_fijo, :fliar_trab, 
                                                    :activ_fliar, :formal_fliar, :ing_fijo_fliar, :percibe_alim, :retira_alim, :percibe_alim_soc, :alim_menores )");
                $query->execute(array(':id_ben' => $id_ben, ':tit_trab' => $tit_trab, ':activ' => $activ, ':formal' => $formal, ':ing_fijo' => $ing_fijo, ':fliar_trab' => $fliar_trab, 
                                      ':activ_fliar' => $activ_fliar, ':formal_fliar' => $formal_fliar, ':ing_fijo_fliar' => $ing_fijo_fliar, ':percibe_alim' => $percibe_alim, 
                                      ':retira_alim' => $retira_alim, ':percibe_alim_soc' => $percibe_alim_soc, ':alim_menores' => $alim_menores));
                $id = $this->conexion->lastInsertId();                      
            }
            else {
                $query = $this->conexion->prepare ("update acc_beneficiario_economico set titular_trabaja=:tit_trab, actividad=:activ, formal=:formal, ingreso_fijo=:ing_fijo,  
                                                    familiar_trabaja=:fliar_trab, actividad_familiar=:activ_fliar, formal_familiar=:formal_fliar, ingreso_fijo_familiar=:ing_fijo_fliar,  
                                                    percibe_alimentos_estado=:percibe_alim, retira_alimentos=:retira_alim, percibe_alimentos_soc=:percibe_alim_soc, 
                                                    alimentacion_menores=:alim_menores 
                                                    where id=:id");
                $query->execute(array(':id' => $id, ':tit_trab' => $tit_trab, ':activ' => $activ, ':formal' => $formal, ':ing_fijo' => $ing_fijo, ':fliar_trab' => $fliar_trab, 
                                      ':activ_fliar' => $activ_fliar, ':formal_fliar' => $formal_fliar, ':ing_fijo_fliar' => $ing_fijo_fliar, ':percibe_alim' => $percibe_alim, 
                                      ':retira_alim' => $retira_alim, ':percibe_alim_soc' => $percibe_alim_soc, ':alim_menores' => $alim_menores));
            }

            //Busco los beneficios que percibe el beneficiario y actualizo
            $q = $this->conexion->prepare(" SELECT p.id_percibe as clave, t.nombre as valor  
                                            FROM acc_beneficiario_percibe p INNER JOIN acc_tabla_parametricas t ON t.id=p.id_percibe 
                                            WHERE t.tabla='BENEFICIOS' AND p.fecha_baja IS null AND p.id_beneficiario=:id");
            $q->execute(array(':id' => $id_ben));   
            $lista_bd = $q->fetchAll(); 

            //Inserto los nuevos beneficios
            foreach($lista_percibe as $elem) {
                $esta = false;
                foreach($lista_bd as $e) {
                    if ( $e["clave"] === $elem->clave ) {
                        $esta = true;
                    }
                }
                if (!$esta) {                    
                    $sql = $this->conexion->prepare("insert into acc_beneficiario_percibe values (null, :id_benef, :id, NOW(), null)");
                    $sql->execute(array(':id_benef' => $id_ben, ':id' => $elem->clave));
                }
            }
            //Se da de baja los beneficios borrados
            foreach($lista_bd as $elem) {
                $esta = false;
                foreach($lista_percibe as $e) {
                    if ( $e->clave === $elem["clave"] ) {
                        $esta = true;
                    }
                }
                if (!$esta) {                    
                    $sql = $this->conexion->prepare("update acc_beneficiario_percibe set fecha_baja=NOW() where id_percibe=:id and id_beneficiario=:id_benef and fecha_baja is null");
                    $sql->execute(array(':id_benef' => $id_ben, ':id' => $elem["clave"]));
                }
            }

            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos."];
            $this->LogError($e);
        }
        return json_encode($response);
    }


    function SaveSituacionHabitacional() { 
        $id = $this->data->id;
        $id_benef = $this->data->id_beneficiario;
        $sit_calle = $this->data->situacion_calle ? "S" : "N";
        $viv_ant = $this->data->vivienda_anterior;
        $conv_ant = $this->data->conviviente_anterior;
        $proy_sit = $this->data->proyeccion_situacion;
        $ubic_viv = $this->data->ubicacion_vivienda;
        $tipo_viv = $this->data->tipo_vivienda;
        $prop = $this->data->propiedad;
        $comp_viv = $this->data->comparte_vivienda;
        $luz = $this->data->luz ? "S" : "N";
        $gas = $this->data->gas ? "S" : "N";
        $cloaca = $this->data->cloacas ? "S" : "N";
        $agua = $this->data->agua_corriente ? "S" : "N";
        $residuo = $this->data->recoleccion_residuos ? "S" : "N";
        $cole = $this->data->servicio_colectivo ? "S" : "N";
        $cant_dorm = $this->data->cantidad_dormitorios;
        $piso = $this->data->material_piso;
        $pared = $this->data->material_pared;
        $techo = $this->data->material_techo;
        $banio = $this->data->banio;
        $tipo_banio = $this->data->tipo_banio;
        $agua_viv = $this->data->agua_en_vivienda ? "S" : "N";
        $tanque = $this->data->tanque_agua ? "S" : "N";
        $pilar = $this->data->pilar_luz ? "S" : "N";
        $conex = $this->data->conexion_electrica ? "S" : "N";
        $calef = $this->data->tipo_calefaccion;
        $alimento = $this->data->coccion_alimentos;
        $mejora_viv = $this->data->mejora_vivienda;

        try {
            if ($id == "0") {
                $query = $this->conexion->prepare ("insert into acc_beneficiario_vivienda values (NULL, :id_ben, :sit_calle, :viv_ant, :conv_ant, :proyecc, :ubi, :tipov, :prop, 
                                                    :comparte, :luz, :gas, :agua, :cloaca, :residuo, :cole, :cant_dormi, :piso, :pared, :techo, :banio, :tipo, :agua_viv, :tanque, 
                                                    :pilar, :conex, :calef, :alimen, :mejora )");
                $query->execute(array(':id_ben' => $id_benef, ':sit_calle' => $sit_calle, ':viv_ant' => $viv_ant, ':conv_ant' => $conv_ant, ':luz' => $luz,
                                      ':proyecc' => $proy_sit, ':ubi' => $ubic_viv, ':tipov' => $tipo_viv, ':prop' => $prop, ':comparte' => $comp_viv, ':gas' => $gas, 
                                      ':agua' => $agua, ':cloaca' => $cloaca, ':residuo' => $residuo, ':cole' => $cole, ':cant_dormi' => $cant_dorm, ':piso' => $piso,
                                      ':pared' => $pared, ':techo' => $techo, ':banio' => $banio, ':tipo' => $tipo_banio, ':agua_viv' => $agua_viv, ':tanque' => $tanque, 
                                      ':pilar' => $pilar, ':conex' => $conex, ':calef' => $calef, ':alimen' => $alimento, ':mejora' => $mejora_viv));
                $id = $this->conexion->lastInsertId();                      
            }
            else {
                $query = $this->conexion->prepare ("update acc_beneficiario_vivienda set situacion_calle=:sit_calle, vivienda_anterior=:viv_ant, conviviente_anterior=:conv_ant, 
                                                    proyeccion_situacion=:proyecc, ubicacion_vivienda=:ubi, tipo_vivienda=:tipov, propiedad=:prop, comparte_vivienda=:comparte,  
                                                    cloacas=:cloaca,luz=:luz, gas=:gas, agua_corriente=:agua, recoleccion_residuos=:residuo, material_piso=:piso, servicio_colectivo=:cole, 
                                                    cantidad_dormitorios=:cant_dormi, material_pared=:pared, material_techo=:techo, banio=:banio, tipo_banio=:tipo, agua_en_vivienda=:agua_viv, 
                                                    tanque_agua=:tanque, pilar_luz=:pilar, conexion_electrica=:conex, tipo_calefaccion=:calef, coccion_alimentos=:alimen, 
                                                    mejora_vivienda=:mejora where id=:id");
                $query->execute(array(':id' => $id, ':sit_calle' => $sit_calle, ':viv_ant' => $viv_ant, ':conv_ant' => $conv_ant, ':luz' => $luz, ':proyecc' => $proy_sit, 
                                        ':ubi' => $ubic_viv, ':tipov' => $tipo_viv, ':prop' => $prop, ':comparte' => $comp_viv, ':gas' => $gas, ':agua' => $agua, 
                                        ':cloaca' => $cloaca, ':residuo' => $residuo, ':cole' => $cole, ':cant_dormi' => $cant_dorm, ':piso' => $piso, ':pared' => $pared, 
                                        ':techo' => $techo, ':banio' => $banio, ':tipo' => $tipo_banio, ':agua_viv' => $agua_viv, ':tanque' => $tanque, ':pilar' => $pilar, 
                                        ':conex' => $conex, ':calef' => $calef, ':alimen' => $alimento, ':mejora' => $mejora_viv));
            }

            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos."];
            $this->LogError($e);
        }
        return json_encode($response);
    }


    function SaveSituacionSalud() { 
        $id = $this->data->id;
        $id_benef = $this->data->id_beneficiario;
        $enferm = $this->data->enfermedad;
        $lugar = $this->data->lugar_tratamiento;
        $enferm_fliar = $this->data->enfermedad_familiar;
        $lugar_fliar = $this->data->lugar_tratamiento_familiar;
        $discapac = $this->data->familiar_discapacitado ? "S" : "N";
        $certif = $this->data->posee_certificado ? "S" : "N";
        $ob_soc = $this->data->obra_social;
        $medicacion = $this->data->medicacion;
        $medico = $this->data->medico;
        $pase = $this->data->posee_pase_transporte ? "S" : "N";
        $referente = $this->data->referente;

        try {
            if ($id == "0") {
                $query = $this->conexion->prepare ("insert into acc_beneficiario_salud values (NULL, :id_ben, :enferm, :lugar, :enferm_fliar, :lugar_fliar, 
                                                    :discapac, :certif, :ob_soc, :medicacion, :medico, :pase, :referente )");
                $query->execute(array(':id_ben' => $id_benef, ':enferm' => $enferm, ':lugar' => $lugar, ':enferm_fliar' => $enferm_fliar, ':lugar_fliar' => $lugar_fliar,
                                      ':discapac' => $discapac, ':certif' => $certif, ':ob_soc' => $ob_soc, ':medicacion' => $medicacion, ':medico' => $medico, 
                                      ':pase' => $pase, ':referente' => $referente ));
                $id = $this->conexion->lastInsertId();                      
            }
            else {
                $query = $this->conexion->prepare ("update acc_beneficiario_salud set enfermedad=:enferm, lugar_tratamiento=:lugar, enfermedad_familiar=:enferm_fliar, 
                                                    lugar_tratamiento_familiar=:lugar_fliar, familiar_discapacitado=:discapac, posee_certificado=:certif, 
                                                    obra_social=:ob_soc, medicacion=:medicacion, medico=:medico, posee_pase_transporte=:pase, referente=:referente
                                                    where id=:id");
                $query->execute(array(':id' => $id, ':enferm' => $enferm, ':lugar' => $lugar, ':enferm_fliar' => $enferm_fliar, ':lugar_fliar' => $lugar_fliar,
                                        ':discapac' => $discapac, ':certif' => $certif, ':ob_soc' => $ob_soc, ':medicacion' => $medicacion, ':medico' => $medico, 
                                        ':pase' => $pase, ':referente' => $referente ));
            }

            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos."];
            $this->LogError($e);
        }
        return json_encode($response);
    }


    function SaveSituacionEducacion() { 
        $id = $this->data->id;
        $id_benef = $this->data->id_beneficiario;
        $cant = $this->data->cantidad_escolarizado;
        $ult = $this->data->ultimo_nivel_escolarizado;
        $establec = $this->data->establecimiento_educativo;
        $concurre = $this->data->concurren_centro_municipal ? "S" : "N";
        $apoyo = $this->data->apoyo_pedagogico ? "S" : "N";
        $etap = $this->data->etap;
        $activ = $this->data->actividad_familiar;
        $instit = $this->data->institucion_concurre;

        try {
            if ($id == "0") {
                $query = $this->conexion->prepare ("insert into acc_beneficiario_educacion values (NULL, :id_ben, :cant, :ult, :establec, :concurre, :apoyo, :etap, :activ, :instit)");
                $query->execute(array(':id_ben' => $id_benef, ':cant' => $cant, ':ult' => $ult, ':establec' => $establec, ':concurre' => $concurre, ':apoyo' => $apoyo, ':etap' => $etap, 
                                      ':activ' => $activ, ':instit' => $instit ));
                $id = $this->conexion->lastInsertId();                      
            }
            else {
                $query = $this->conexion->prepare ("update acc_beneficiario_educacion set cantidad_escolarizado=:cant, ultimo_nivel_escolarizado=:ult, establecimiento_educativo=:establec, 
                                                    concurren_centro_municipal=:concurre, apoyo_pedagogico=:apoyo, etap=:etap, actividad_familiar=:activ, institucion_concurre=:instit
                                                    where id=:id");
                $query->execute(array(':id' => $id, ':cant' => $cant, ':ult' => $ult, ':establec' => $establec, ':concurre' => $concurre, ':apoyo' => $apoyo, ':etap' => $etap, 
                                      ':activ' => $activ, ':instit' => $instit ));
            }

            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos."];
            $this->LogError($e);
        }
        return json_encode($response);
    }


    function SaveSituacionjudicial() { 
        $id = $this->data->id;
        $id_benef = $this->data->id_beneficiario;
        $proceso = $this->data->proceso_judicial ? "S" : "N";
        $ambito = $this->data->ambito_proceso_judicial;
        $prof = $this->data->profesional_interviniente;
        $instit = $this->data->institucion_concurre;

        try {
            if ($id == "0") {
                $query = $this->conexion->prepare ("insert into acc_beneficiario_judicial values (NULL, :id_ben, :proceso, :ambito, :prof, :instit)");
                $query->execute(array(':id_ben' => $id_benef, ':proceso' => $proceso, ':ambito' => $ambito, ':prof' => $prof, ':instit' => $instit ));
                $id = $this->conexion->lastInsertId();                      
            }
            else {
                $query = $this->conexion->prepare ("update acc_beneficiario_judicial set proceso_judicial=:proceso, ambito_proceso_judicial=:ambito, 
                                                    profesional_interviniente=:prof, institucion_concurre=:instit
                                                    where id=:id");
                $query->execute(array(':id' => $id, ':proceso' => $proceso, ':ambito' => $ambito, ':prof' => $prof, ':instit' => $instit));
            }

            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos."];
            $this->LogError($e);
        }
        return json_encode($response);
    }


    function SaveObservacionBenef() { 
        $id = $this->data->id;
        $obs = $this->data->obs;

        try {
            $query = $this->conexion->prepare ("update acc_beneficiarios set observaciones=:obs where id=:id");
            $query->execute(array(':id' => $id, ':obs' => $obs));
            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos."];
            $this->LogError($e);
        }
        return json_encode($response);
    }


    function SaveSolicitudBenef() { 
        $id = $this->data->id; 
        $es_per_inst = $this->data->es_persona_institucion;
        $id_per_inst = $this->data->id_pers_inst;
        $tipo = $this->data->tipo_beneficio;
        $remito = $this->data->id_remito;
        $estado = $this->data->estado; 
        $obs = $this->data->observaciones;
        $user = $this->data->usuario;

        try {
            //Verifico si es persona o institución
            if ($es_per_inst == "P") {
                $persona = $id_per_inst;
                $institucion = NULL;
            }
            else {
                $persona = NULL;
                $institucion = $id_per_inst;
            }

            if ($id == 0) { 
                $query = $this->conexion->prepare ("insert into acc_solicitud_beneficiario values (NULL, CURRENT_DATE(), :es_p_i, :inst, :pers, :tipo, '1', :obs, NULL, :usu, 'N', NULL)");
                $query->execute(array(':es_p_i' => $es_per_inst, ':inst' => $institucion, ':pers' => $persona, ':tipo' => $tipo, ':obs' => $obs, ':usu' => $user));
                $id = $this->conexion->lastInsertId();
            }
            else {
                $query = $this->conexion->prepare ("update acc_solicitud_beneficiario set es_persona_institucion=:es_p_i, id_institucion=:inst, id_beneficiario=:pers, 
                                                    tipo_beneficio=:tipo, estado=:estado, observaciones=:obs, id_remito=:remito, usuario=:usu
                                                    where id=:id");
                $query->execute(array(':id' => $id, ':es_p_i' => $es_per_inst, ':inst' => $institucion, ':pers' => $persona, ':tipo' => $tipo, ':estado' => $estado,
                                      ':obs' => $obs, ':remito' => $remito, ':usu' => $user));
            }
            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos."];
            $this->LogError($e);
        }
        return json_encode($response);
    }


    function SaveRemitoBenef() { 
        $id = $this->data->id; 
        $fecha_emision = $this->data->fecha_emision;
        $fecha_entrega = $this->data->fecha_entrega;
        $forma_entrega = $this->data->forma_entrega; 
        $obs = $this->data->observaciones;
        $id_solicitud = $this->data->id_solicitud;
        $user = $this->data->usuario;
        
        try {
            if ($id == 0) { 
                $query = $this->conexion->prepare ("insert into acc_remito_beneficiario values (NULL, :id_sol, :fecha_emi, :fecha_entr, :forma, :obs, :usu, 'N', NULL, CURRENT_TIMESTAMP())");
                $query->execute(array(':id_sol' => $id_solicitud, ':fecha_emi' => $fecha_emision, ':fecha_entr' => $fecha_entrega, ':forma' => $forma_entrega, ':obs' => $obs, ':usu' => $user));
                $id = $this->conexion->lastInsertId();
            }
            else {
                $query = $this->conexion->prepare ("update acc_remito_beneficiario set fecha_emision=:fecha_emision, fecha_entrega=:fecha_entrega, forma_entrega=:forma_entrega, 
                                                    id_solicitud=:id_solicitud, observaciones=:obs
                                                    where id=:id");
                $query->execute(array(':id' => $id, ':fecha_emision' => $fecha_emision, ':fecha_entrega' => $fecha_entrega, ':forma_entrega' => $forma_entrega, ':obs' => $obs, 
                                      ':id_solicitud' => $id_solicitud));
            }
            $response = array("id" => $id); 
        }
        catch(Exception $e) {
            $response = [ "error" => "Error al registrar los datos."];
            $this->LogError($e);
        }
        return json_encode($response);
    }
    
    
}

$backend = new Backend();
$backend->ProcessRequest();
