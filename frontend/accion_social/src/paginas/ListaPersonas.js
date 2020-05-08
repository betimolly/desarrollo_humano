import React from "react";
import MaterialTable from 'material-table';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';


class ListaPersonas extends React.Component {
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
        await conn.deletepersonas(ids);
        this.loadData();
        this.handleClose();
    }

    loadData = async () => {
        let result = await conn.listapersonas();
        this.setState( { data: result.data } );
    };

    componentDidMount () {
        this.loadData();
    };
    
    render() {

        return (
            <div>
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} handleOk={this.handleDelete} dialog_title="Eliminar registros" dialog_content="¿Seguro que desea eliminar los registros seleccionados?" />
                <h2 className="labelleft">Listado de Personas</h2>
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
                            exportTitle: 'Exportar Personas',
                            exportName: 'Exportar listado de Personas'
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
                        { title: 'DNI / CUIT', field: 'ndoc' },
                        { title: 'Nombre', field: 'nombre' },
                        { title: 'Apellido', field: 'apellido' },
                        { title: 'Fecha Nacimiento', field: 'fecha_nacimiento' },
                        { title: 'Domicilio', field: 'domicilio' },
                        { title: 'Baja', field: 'baja' }
                    ] }
                    data={ this.state.data }        
                    actions={[
                        {
                            icon: 'add',
                            tooltip: 'Agregar Persona',
                            isFreeAction: true,
                            onClick: (event) => {if (this.props.history) {
                                this.props.history.push('/accion_social/agregar_persona');
                            }}
                        },
                        {
                            tooltip: 'Borrar todas las personas seleccionadas',
                            icon: 'delete',
                            onClick: (evt, data) => {
                                this.setState({ borrar: data, open: true });
                            }
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Editar Persona',
                            onClick: (event, rowData) => {if (rowData.length === 1) {
                                this.props.history.push(`/accion_social/agregar_persona/${rowData[0].id}`);
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
                    detailPanel={
                        rowData => {
                                return (
                                  <div
                                    style={{
                                      textAlign: 'center',
                                      color: 'black',
                                      backgroundColor: '#fff',
                                    }}
                                  > 
                                  {rowData.familiares.length > 0 ? (
                                        <table className="gridFamiliares">
                                            <tr>
                                                <th>{rowData.familiares[0].titular === 'S' ? "Titular" : "Nombre Familiar"} </th>
                                                <th>Parentesco</th>
                                            </tr>
                                        { 
                                            rowData.familiares.map(f => <tr><td>{f.familiar}</td><td>{f.parentesco}</td></tr>)
                                        } 
                                        </table>
                                  )
                                  :
                                  <table className="gridFamiliares">
                                    <tr>
                                        <th>No tiene familiares agregados</th>
                                    </tr>    
                                  </table>      
                                    }
                                  </div>
                                )
                            }
                    }
                />

            </div>
        )
    }
}      

export default ListaPersonas;