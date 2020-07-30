import React from "react";
import MaterialTable from 'material-table';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';


class ListaOrdenesCompras extends React.Component {
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
        await conn.deleteordenescompra(ids);
        this.loadData();
        this.handleClose();
    }

    loadData = async () => {
        let result = await conn.listaordenescompras();
        this.setState( { data: result.data } );
    };

    componentDidMount () {
        this.loadData();
    };
    
    render() {

        return (
            <div>
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} handleOk={this.handleDelete} dialog_title="Eliminar registros" dialog_content="¿Seguro que desea eliminar los registros seleccionados?" />
                <h2 className="labelleft">Listado de Órdenes de Compra</h2>
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
                            exportTitle: 'Exportar Órdenes de Compra',
                            exportName: 'Exportar listado de Órdenes de Compra'
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
                        { title: 'Expediente', field: 'numero_expediente' },
                        { title: 'Resolución', field: 'numero_resolucion' },
                        { title: 'Proveedor', field: 'razon_social' },
                        { title: 'Destino', field: 'destino' },
                        { title: 'Fecha Emisión', field: 'fecha_emisión' },
                        { title: 'Plazo Entrega', field: 'plazo_entrega' },
                        { title: 'Observaciones', field: 'observaciones_entrega' }
                    ] }
                    data={ this.state.data }        
                    actions={[
                        {
                            icon: 'add',
                            tooltip: 'Agregar Orden Compra',
                            isFreeAction: true,
                            onClick: (event) => {if (this.props.history) {
                                this.props.history.push('/desarrollo_humano/agregar_orden_compra');
                            }}
                        },
                        {
                            tooltip: 'Borrar todos las órdenes seleccionadas',
                            icon: 'delete',
                            onClick: (evt, data) => {
                                this.setState({ borrar: data, open: true });
                            }
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Editar Orden Compra',
                            onClick: (event, rowData) => {if (rowData.length === 1) {
                                this.props.history.push(`/desarrollo_humano/agregar_orden_compra/${rowData[0].id}`);
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

export default ListaOrdenesCompras;