import React from "react";
import MaterialTable from 'material-table';

class ListaFamiliares extends React.Component {
   
    render () {
        return (
            <div>
                <h2 className="labelleft">{this.props.titulo}</h2>
                <MaterialTable
                    className="table table-striped"
                    localization={{
                        pagination: {
                            labelDisplayedRows: '{from}-{to} de {count}',
                            labelRowsSelect: 'Filas'
                        },
                        toolbar: {
                            searchPlaceholder: 'Buscar',
                            searchTooltip: 'Buscar',
                            exportTitle: 'Exportar Familiares',
                            exportName: 'Exportar listado de Familiares'
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
                        { title: 'Nombre', field: 'familiar' },
                        { title: 'Parentesco', field: 'parentesco' }
                    ] }
                    data={ this.props.data_familiares }  
                    options={{
                        exportButton: true,
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
export default ListaFamiliares;