import React from "react";
import { Link } from "react-router-dom";
import Table from "./Table";
import {
  getStudents,
  getStudent,
  getRegistrations,
  getRegistration,
  addRegistration,
  removeRegistration,
  getSubjects,
  getSubject,
  getClassRooms,
  getClassRoom,
  updateClassRoom
} from "./service";

export function Navigation({ className = "" }) {
  return (
    <ul className={className}>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/students">Students</Link>
      </li>
      <li>
        <Link to="/registrations">Registrations</Link>
      </li>
      <ul>
        <li>
          <Link to="/registrations/create">Create</Link>
        </li>
      </ul>
      <li>
        <Link to="/subjects">Subjects</Link>
      </li>
      <li>
        <Link to="/classrooms">Class room</Link>
      </li>
    </ul>
  );
}
export function Home(props) {
  return "Home";
}
export function ListStudents(props) {
  // {
  //   "age": 29,
  //   "email": "susanpetersen@example.com",
  //   "id": 1,
  //   "name": "Susan Petersen"
  // }
  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Age", key: "age", dataIndex: "age" },
    { title: "Email", key: "email", dataIndex: "email" }
  ];
  return <Table service={getStudents} columns={columns} />;
}
export function ViewStudent(props) {
  return null;
}
export function ListClassRooms(props) {
  return null;
}
export function ViewClassRoom(props) {
  return null;
}
export function UpdateClassRoom(props) {
  return null;
}
export function ListRegistrations(props) {
  return null;
}
export function ViewRegistration(props) {
  return null;
}
export function CreateRegistration(props) {
  return null;
}
export function DeleteRegistration(props) {
  return null;
}
export function ListSubjects(props) {
  return null;
}
export function ViewSubject(props) {
  return null;
}
