import React from "react";
import MaterialTable from 'material-table';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';


class ListaProveedores extends React.Component {
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
        await conn.deleteproveedores(ids);
        this.loadData();
        this.handleClose();
    }

    loadData = async () => {
        let result = await conn.listaproveedores();
        this.setState( { data: result.data } );
    };

    componentDidMount () {
        this.loadData();
    };
    
    render() {

        return (
            <div>
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} handleOk={this.handleDelete} dialog_title="Eliminar registros" dialog_content="¿Seguro que desea eliminar los registros seleccionados?" />
                <h2 className="labelleft">Listado de Proveedores</h2>
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
                            exportTitle: 'Exportar Proveedores',
                            exportName: 'Exportar listado de Proveedores'
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
                        { title: 'CUIT', field: 'cuit' },
                        { title: 'Razón Social', field: 'razon_social' },
                        { title: 'Contacto', field: 'contacto' },
                        { title: 'Domicilio', field: 'domicilio' },
                        { title: 'Baja', field: 'baja' }
                    ] }
                    data={ this.state.data }        
                    actions={[
                        {
                            icon: 'add',
                            tooltip: 'Agregar Proveedor',
                            isFreeAction: true,
                            onClick: (event) => {if (this.props.history) {
                                this.props.history.push('/accion_social/agregar_proveedor');
                            }}
                        },
                        {
                            tooltip: 'Borrar todos los proveedores seleccionados',
                            icon: 'delete',
                            onClick: (evt, data) => {
                                this.setState({ borrar: data, open: true });
                            }
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Editar Proveedor',
                            onClick: (event, rowData) => {if (rowData.length === 1) {
                                this.props.history.push(`/accion_social/agregar_proveedor/${rowData[0].id}`);
                            } else {

                            }}
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

export default ListaProveedores;