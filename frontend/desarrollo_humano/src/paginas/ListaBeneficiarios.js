import React from "react";
import MaterialTable from 'material-table';
import ModalConfirmacion from "../componentes/ModalConfirmacion";
import conn from '../ServiceConexion';


class ListaBeneficiarios extends React.Component {
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
        await conn.deletebeneficiarios(this.state.borrar, ids);
        this.loadData();
        this.handleClose();
    }

    loadData = async () => {
        let result = await conn.listabeneficiarios();
        this.setState( { data: result.data } );
    };

    componentDidMount () {
        this.loadData();
    };
    
    render() {

        return (
            <div>
                <ModalConfirmacion open={this.state.open} handleClose={this.handleClose} handleOk={this.handleDelete} dialog_title="Modificar registros" dialog_content="¿Seguro que desea activar/desactivar los registros seleccionados?" />
                <h2 className="labelleft">Listado de Beneficiarios</h2>
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
                            exportTitle: 'Exportar Beneficiarios',
                            exportName: 'Exportar listado de Beneficiarios'
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
                        { title: 'DNI', field: 'ndoc' },
                        { title: 'Nombre', field: 'nombre' },
                        { title: 'Formación', field: 'formacion' },
                        { title: 'Situación', field: 'situacion_laboral' },
                        { title: 'Fecha Alta', field: 'fecha_alta' },
                        { title: 'Activo', field: 'activo' },
                        { title: 'Observaciones', field: 'observaciones' }
                    ] }
                    data={ this.state.data }        
                    actions={[
                        {
                            icon: 'add',
                            tooltip: 'Agregar Beneficiario',
                            isFreeAction: true,
                            onClick: (event) => {if (this.props.history) {
                                this.props.history.push('/desarrollo_humano/agregar_beneficiario');
                            }}
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Editar Beneficiario',
                            onClick: (event, rowData) => {if (rowData.length === 1) {
                                //this.props.history.push(`/desarrollo_humano/agregar_beneficiario/${rowData[0].tipo}/${rowData[0].id}`);
                                this.props.history.push(`/desarrollo_humano/agregar_beneficiario/${rowData[0].id_persona}/${rowData[0].id}`);
                            } else {

                            }}
                        },
                        {
                            tooltip: 'Activar/Desactivar todos los beneficiarios seleccionados',
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
                                            <thead>
                                                <tr>
                                                    <th>Nombre Familiar</th>
                                                    <th>Parentesco</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            { 
                                                rowData.familiares.map(f => <tr key={f.id}><td>{f.familiar}</td><td>{f.parentesco}</td></tr>)
                                            } 
                                            </tbody>
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

export default ListaBeneficiarios;