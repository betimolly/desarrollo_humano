import React from "react";
import { Tabs, Tab , AppBar, Card, CardContent } from '@material-ui/core';
import TabPanel from '../componentes/TabPanel';
import PersonaDatos from "../componentes/PersonaDatos";
import Listafamiliares from "ListaFamiliares";

class Persona extends React.Component {
    state = {
        tab_selected: 0
    };

    handleTab = (e, newval) => {
        this.setState ({tab_selected: newval});
    };

    render() {      
        return (
            <div className="App" >
                <Card className="Card" >
                    <CardContent>
                        <AppBar position="static" color="transparent">
                            <Tabs
                                value={this.state.tab_selected}
                                indicatorColor="primary"
                                textColor="primary"
                                onChange={this.handleTab}
                            >
                                <Tab label="Persona" ></Tab>
                                <Tab label="Familiares" ></Tab>
                            </Tabs>
                        </AppBar>
                        <TabPanel value={this.state.tab_selected} index={0} >
                            <PersonaDatos titulo="Persona" />
                        </TabPanel>
                        <TabPanel value={this.state.tab_selected} index={1} >
                            <Listafamiliares titulo="Listado Familiares" />
                        </TabPanel>
                    </CardContent>                    
                </Card>
            </div>
        )
    }
}

export default Persona;