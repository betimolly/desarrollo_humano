import React from "react";
import MaterialTable from 'material-table';
import { getRolId } from '../utils/Commons';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';


class ListaSolicitudes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],

            borrar: [],
            open: false
        }
    }
    
    handleClose = () => {
        this.setState( { open: false, borrar: [] } );
    };
    
    handleDelete = async () => {
        const ids = this.state.borrar.map((v,i)=>v.id);
        await conn.deletesolicitud(ids);
        this.loadData();
        this.handleClose();
    }

    loadData = async () => {
        let result = await conn.listasolicitudes(getRolId());
        this.setState( { data: result.data } );
    };

    componentDidMount () {
        this.loadData();
    };
    
    render() {

        return (
            <div>
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} handleOk={this.handleDelete} dialog_title="Modificar registros" dialog_content="¿Seguro que desea borrar los registros seleccionados?" />
                <h2 className="labelleft">Listado de Solicitudes de Entrega de Mercadería</h2>
                <MaterialTable
                    className="table table-striped"
                    localization={{
                        pagination: {
                            labelDisplayedRows: '{from}-{to} de {count}',
                            labelRowsSelect: 'Filas'
                        },
                        toolbar: {
                            nRowsSelected: '{0} filas(s) seleccionada/s',
                            searchPlaceholder: 'Buscar',
                            searchTooltip: 'Buscar',
                            exportTitle: 'Exportar Solicitudes',
                            exportName: 'Exportar listado de Solicitudes'
                        },
                        header: {
                            actions: 'Acciones'
                        },
                        body: {
                            emptyDataSourceMessage: 'No hay registros.',
                            filterRow: {
                                filterTooltip: 'Filtrar'
                            }
                        }
                    }}
                    title=""
                    columns={ [
                        { title: 'Tipo', field: 'es_pers_inst' },
                        { title: 'DNI / CUIT', field: 'documento' },
                        { title: 'Nombre', field: 'descripcion' },
                        { title: 'Fecha Emisión', field: 'fecha_emision' },
                        { title: 'Tipo Beneficio', field: 'tipo_beneficio' },
                        { title: 'Efector', field: 'nombre' },
                        { title: 'Nro. Remito', field: 'id_remito' },
                        { title: 'Estado', field: 'estado' },
                        { title: 'Borrado', field: 'borrado' }
                    ] }
                    data={ this.state.data }        
                    actions={[
                        {
                            icon: 'add',
                            tooltip: 'Agregar Solicitud',
                            isFreeAction: true,
                            onClick: (event) => {if (this.props.history) {
                                this.props.history.push('/desarrollo_humano/solicitud_entrega');
                            }}
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Editar Beneficiario',
                            onClick: (event, rowData) => {if (rowData.length === 1) {
                                this.props.history.push(`/desarrollo_humano/solicitud_entrega/${rowData[0].id}`);
                            } else {

                            }}
                        },
                        {
                            tooltip: 'Activar/Desactivar todas las solicitudes seleccionados',
                            icon: 'delete',
                            onClick: (evt, data) => {
                                this.setState({ borrar: data, open: true });
                            }
                        }
                    ]}
                    options={{
                        exportButton: true,
                        selection: true,
                        headerStyle: {
                            backgroundColor: '#5d25a7',
                            color: '#FFF'
                        },
                        rowStyle: (rowData, index) => {
                            if (index % 2) {
                                return {backgroundColor: "#f2f2f2"}
                            }
                        }
                    }}
                />

            </div>
        )
    }
}      

export default ListaSolicitudes;