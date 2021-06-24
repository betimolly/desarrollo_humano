import React from "react";
import MaterialTable from 'material-table';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';


class ListaRemitosBeneficiarios extends React.Component {
    state = {
        data: [],

        borrar: [],
        open: false
    }
    
    handleClose = () => {
        this.setState( { open: false, borrar: [] } );
    };
    
    handleDelete = async () => {
        const ids = this.state.borrar.map((v,i)=>v.id);
        await conn.deleteremitosbeneficiarios(ids);
        this.loadData();
        this.handleClose();
    }

    loadData = async () => {
        let result = await conn.listaremitosbeneficiarios();
        this.setState( { data: result.data } );
    };

    componentDidMount () {
        this.loadData();
    };
    
    render() {

        return (
            <div>
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} handleOk={this.handleDelete} dialog_title="Eliminar registros" dialog_content="¿Seguro que desea eliminar los registros seleccionados?" />
                <h2 className="labelleft">Listado de Remitos de Beneficiarios</h2>
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
                            exportTitle: 'Exportar Remitos de Beneficiarios',
                            exportName: 'Exportar listado de Remitos de Beneficiarios'
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
                        { title: 'Id', field: 'id' },
                        { title: 'Solicitud', field: 'id_solicitud' },
                        { title: 'Fecha Emisión', field: 'fecha_emisión' },
                        { title: 'Fecha Entrega', field: 'fecha_entrega' },
                        { title: 'Forma Entrega', field: 'forma_entrega' },
                        { title: 'Borrado', field: 'borrado' },
                        { title: 'Observaciones', field: 'observaciones' }
                    ] }
                    data={ this.state.data }        
                    actions={[
                        {
                            icon: 'add',
                            tooltip: 'Agregar Remito',
                            isFreeAction: true,
                            onClick: (event) => {if (this.props.history) {
                                this.props.history.push('/desarrollo_humano/remito_beneficiario');
                            }}
                        },
                        {
                            tooltip: 'Borrar todos los remitos seleccionados',
                            icon: 'delete',
                            onClick: (evt, data) => {
                                this.setState({ borrar: data, open: true });
                            }
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Editar Remito',
                            onClick: (event, rowData) => {if (rowData.length === 1) {
                                this.props.history.push(`/desarrollo_humano/remito_beneficiario/${rowData[0].id}`);
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

export default ListaRemitosBeneficiarios;