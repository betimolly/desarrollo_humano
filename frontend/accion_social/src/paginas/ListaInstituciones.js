import React from "react";
import MaterialTable from 'material-table';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';


class ListaInstituciones extends React.Component {
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
        await conn.deleteinstituciones(ids);
        this.loadData();
        this.handleClose();
    }

    loadData = async () => {
        let result = await conn.listainstituciones();
        this.setState( { data: result.data } );
    };

    componentDidMount () {
        this.loadData();
    };
    
    render() {

        return (
            <div>
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} handleOk={this.handleDelete} dialog_title="Eliminar registros" dialog_content="¿Seguro que desea eliminar los registros seleccionados?" />
                <h2 className="labelleft">Listado de Instituciones</h2>
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
                            exportTitle: 'Exportar Instituciones',
                            exportName: 'Exportar listado de Instituciones'
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
                        { title: 'Institución', field: 'institucion' },
                        { title: 'Responsable', field: 'responsable' },
                        { title: 'Domicilio', field: 'domicilio' },
                        { title: 'Teléfono', field: 'telefono' },
                        { title: 'Baja', field: 'baja' }
                    ] }
                    data={ this.state.data }        
                    actions={[
                        {
                            icon: 'add',
                            tooltip: 'Agregar Institución',
                            isFreeAction: true,
                            onClick: (event) => {if (this.props.history) {
                                this.props.history.push('/accion_social/agregar_institucion');
                            }}
                        },
                        {
                            tooltip: 'Borrar todas las instituciones seleccionadas',
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

export default ListaInstituciones;