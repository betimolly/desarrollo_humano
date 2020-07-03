import React from "react";
import MaterialTable from 'material-table';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';


class ListaFacturasProveedores extends React.Component {
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
        await conn.deletefacturas(ids);
        this.loadData();
        this.handleClose();
    }

    loadData = async () => {
        let result = await conn.listafacturas();
        this.setState( { data: result.data } );
    };

    componentDidMount () {
        this.loadData();
    };
    
    render() {

        return (
            <div>
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} handleOk={this.handleDelete} dialog_title="Eliminar registros" dialog_content="¿Seguro que desea eliminar los registros seleccionados?" />
                <h2 className="labelleft">Listado de Facturas de Proveedores</h2>
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
                            exportTitle: 'Exportar Facturas',
                            exportName: 'Exportar listado de Facturas'
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
                        { title: 'Número', field: 'numero' },
                        { title: 'Orden Compra', field: 'orden_compra' },
                        { title: 'Proveedor', field: 'razon_social' },
                        { title: 'Fecha', field: 'fecha' },
                        { title: 'Observaciones', field: 'observaciones' }
                    ] }
                    data={ this.state.data }        
                    actions={[
                        {
                            icon: 'add',
                            tooltip: 'Agregar Factura',
                            isFreeAction: true,
                            onClick: (event) => {if (this.props.history) {
                                this.props.history.push('/desarrollo_humano/agregar_factura');
                            }}
                        },
                        {
                            tooltip: 'Borrar todos las facturas seleccionadas',
                            icon: 'delete',
                            onClick: (evt, data) => {
                                this.setState({ borrar: data, open: true });
                            }
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Editar Facturas',
                            onClick: (event, rowData) => {if (rowData.length === 1) {
                                this.props.history.push(`/desarrollo_humano/agregar_factura/${rowData[0].id}`);
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

export default ListaFacturasProveedores;