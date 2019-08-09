import React from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import "./App.css";
import {
  Home,
  ListStudents,
  ViewStudent,
  ListClassRooms,
  ViewClassRoom,
  UpdateClassRoom,
  ListRegistrations,
  ViewRegistration,
  CreateRegistration,
  DeleteRegistration,
  ListSubjects,
  ViewSubject,
  Navigation
} from "./components.js";

function App() {
  return (
    <HashRouter>
      <div id="app-container">
        <div id="navigation">
          <Navigation />
        </div>
        <div id="content">
          <Switch>
            <Route exact path="/students/:id" component={ViewStudent} />
            <Route exact path="/students" component={ListStudents} />

            <Route
              exact
              path="/registrations/:id/delete"
              component={DeleteRegistration}
            />
            <Route
              exact
              path="/registrations/create"
              component={CreateRegistration}
            />
            <Route
              exact
              path="/registrations/:id"
              component={ViewRegistration}
            />
            <Route exact path="/registrations" component={ListRegistrations} />

            <Route exact path="/subjects/:id" component={ViewSubject} />
            <Route exact path="/subjects" component={ListSubjects} />

            <Route exact path="/classrooms" component={ListClassRooms} />
            <Route exact path="/classrooms/:id" component={ViewClassRoom} />
            <Route
              exact
              path="/classrooms/:id/update"
              component={UpdateClassRoom}
            />

            <Route component={Home} />
          </Switch>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
