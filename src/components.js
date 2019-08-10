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
  return (
    <Table
      service={getStudents}
      columns={columns}
      responseFilter={data => data.students}
    />
  );
}
export function ViewStudent(props) {
  return null;
}
export function ListClassRooms(props) {
  // {
  //   "id": 1,
  //   "layout": "conference",
  //   "name": "NavajoWhite",
  //   "size": 24,
  //   "subject": ""
  // }

  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Layout", key: "layout", dataIndex: "layout" },
    { title: "Size", key: "size", dataIndex: "size" },
    { title: "Subject", key: "subject", dataIndex: "subject" }
  ];
  return (
    <Table
      service={getClassRooms}
      columns={columns}
      responseFilter={data => data.classrooms}
    />
  );
}
export function ViewClassRoom(props) {
  return null;
}
export function UpdateClassRoom(props) {
  return null;
}
export function ListRegistrations(props) {
  //   {
  //   "registration": {
  //     "id": 4,
  //     "student": 5,
  //     "subject": 3
  //   }
  // }
  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Student Id", key: "student", dataIndex: "student" },
    { title: "Subject Id", key: "subject", dataIndex: "subject" },
    {
      title: "Delete",
      key: "delete",
      render: rec => (
        <button
          onClick={() => {
            console.info("delete registration api-missing");
          }}
        >
          Delete
        </button>
      )
    }
  ];
  return (
    <Table
      service={getRegistrations}
      columns={columns}
      responseFilter={data => data.registrations}
    />
  );
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
  //   {
  //   "credits": 10,
  //   "id": 1,
  //   "name": "History",
  //   "teacher": "Brenda Miller"
  // }
  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Credits", key: "credits", dataIndex: "credits" },
    { title: "Teacher", key: "teacher", dataIndex: "teacher" }
  ];
  return (
    <Table
      service={getSubjects}
      columns={columns}
      responseFilter={data => data.subjects}
    />
  );
}
export function ViewSubject(props) {
  return null;
}
