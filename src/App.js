import React from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import "./App.css";
import {
  Home,
  ListStudents,
  ListClassRooms,
  ListRegistrations,
  CreateRegistration,
  ListSubjects,
  Navigation
} from "./appComps";

function App() {
  return (
    <HashRouter>
      <div className="w3-container">
        <Navigation />
        <Switch>
          <Route exact path="/students" component={ListStudents} />
          <Route
            exact
            path="/registrations/create"
            component={CreateRegistration}
          />
          <Route exact path="/registrations" component={ListRegistrations} />

          <Route exact path="/subjects" component={ListSubjects} />

          <Route exact path="/classrooms" component={ListClassRooms} />

          <Route component={Home} />
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
