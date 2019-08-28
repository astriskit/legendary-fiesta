import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Select, Table, Loading, ShowRecord } from "./utilComps";
import {
  getStudents,
  getStudent,
  getRegistrations,
  addRegistration,
  removeRegistration,
  getSubjects,
  getSubject,
  getClassRooms,
  getClassRoom,
  updateClassRoom
} from "./service";

export function Navigation() {
  return (
    <div
      className="w3-container w3-bar w3-light-grey w3-border"
      style={{ marginTop: "5px", marginBottom: "5px" }}
    >
      <Link
        className="w3-bar-item w3-btn"
        style={{ marginRight: "5px" }}
        to="/"
      >
        Home
      </Link>
      <Link
        className="w3-bar-item w3-btn"
        style={{ marginRight: "5px" }}
        to="/students"
      >
        Students
      </Link>
      <Link
        className="w3-bar-item w3-btn"
        style={{ marginRight: "5px" }}
        to="/registrations"
      >
        Registrations
      </Link>
      <Link
        className="w3-bar-item w3-btn"
        style={{ marginRight: "5px" }}
        to="/subjects"
      >
        Subjects
      </Link>
      <Link
        className="w3-bar-item w3-btn"
        style={{ marginRight: "5px" }}
        to="/classrooms"
      >
        Classrooms
      </Link>
      <Link
        className="w3-bar-item w3-btn"
        style={{ marginRight: "5px" }}
        to="/registrations/create"
      >
        Assign Subjects
      </Link>
    </div>
  );
}
export function Home(props) {
  return (
    <div className="w3-container">Hello there. I'm just a landing page.</div>
  );
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
      title="List of Students"
    />
  );
}

export function ListClassRooms(props) {
  // {
  //   "id": 1,
  //   "layout": "conference",
  //   "name": "NavajoWhite",
  //   "size": 24,
  //   "subject": ""
  // }

  let [loading, setLoading] = useState(true);
  let [subjects, setSubjects] = useState([]);
  let [classrooms, setClassrooms] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        let { subjects } = await getSubjects();
        let { classrooms } = await getClassRooms();
        let opts = subjects.map(({ id, name, credits, teacher }) => ({
          key: id,
          value: id,
          title: `${name} by ${teacher} (Credits: ${credits})`
        }));
        let _classrooms = await Promise.all(
          classrooms.map(({ id }) => getClassRoom(id))
        );
        classrooms = classrooms.map(c => {
          let _c = _classrooms.find(({ id }) => id === c.id);
          if (_c) {
            c = { ...c, ..._c };
          }
          return c;
        });
        setSubjects(opts);
        setClassrooms(classrooms);
      } catch (er) {
        console.error(er);
        alert("Error fetching subjects/classrooms!");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubjectSelect = async ({ target: { value } }, id) => {
    try {
      setLoading(true);
      await updateClassRoom(id, { subject: value });
      let newRecords = classrooms.map(classroom => {
        if (id === classroom.id) {
          classroom.subject = value;
        }
        return classroom;
      });
      setClassrooms(newRecords);
    } catch (er) {
      console.error(er);
      alert("Error while saving!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Layout", key: "layout", dataIndex: "layout" },
    { title: "Size", key: "size", dataIndex: "size" },
    {
      title: "Subject",
      key: "subject",
      render: record => {
        return (
          <Select
            value={record.subject || ""}
            options={subjects}
            onChange={ev => onSubjectSelect(ev, record.id)}
          />
        );
      }
    }
  ];
  return (
    <Table
      data={classrooms}
      columns={columns}
      title="List of Classrooms"
      loading={loading}
    />
  );
}
export function ListRegistrations(props) {
  //   {
  //   "registration": {
  //     "id": 4,
  //     "student": 5,
  //     "subject": 3
  //   }
  // }
  let [loading, setLoading] = useState(false);
  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    {
      title: "Student Id",
      key: "student",
      render: ({ student }) => (
        <Link
          className="w3-btn w3-border"
          className="w3-btn"
          to={`students/${student}`}
        >
          {student}
        </Link>
      )
    },
    {
      title: "Subject Id",
      key: "subject",
      render: ({ subject }) => (
        <Link
          className="w3-btn w3-border"
          className="w3-btn"
          to={`subjects/${subject}`}
        >
          {subject}
        </Link>
      )
    },
    {
      title: "Delete",
      key: "delete",
      render: rec => (
        <button
          className="w3-btn w3-border"
          onClick={async () => {
            try {
              setLoading(true);
              await removeRegistration(rec.id);
            } catch (e) {
              alert("Error in deleting!");
              console.error("delete-error", e);
            } finally {
              setLoading(false);
            }
          }}
        >
          Delete
        </button>
      )
    }
  ];
  return (
    <Table
      loading={loading}
      title="List of Registrations"
      service={getRegistrations}
      columns={columns}
      responseFilter={data => data.registrations}
    />
  );
}
export function CreateRegistration(props) {
  let [loading, setLoading] = useState(true);
  let [{ students = [], subjects = [] }, setStore] = useState({});
  useEffect(() => {
    (async () => {
      try {
        let { subjects = [] } = await getSubjects();
        let { students = [] } = await getStudents();
        setStore({ students, subjects });
      } catch (e) {
        console.error("Error fetching students/subjects", e.message);
        alert("Error requesting resource");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) return <Loading />;
  let studentOpts = students.map(({ id, name, age, email }) => ({
    key: id,
    value: id,
    title: `${name}/${age} yrs./${email}`
  }));
  let subjectOpts = subjects.map(({ id, credits, name, teacher }) => ({
    key: id,
    value: id,
    title: `${name}(credits-${credits}) by ${teacher}`
  }));
  return (
    <Form
      onSubmit={values => {
        let payload = {};
        values.forEach(({ name, value }) => {
          payload[name] = value;
        });
        return addRegistration(
          Number(payload.student),
          Number(payload.subject)
        );
      }}
      title="Assign subjects to students"
    >
      <Select options={studentOpts} name="student" label="Select Student" />
      <Select options={subjectOpts} name="subject" label="Select Subject" />
    </Form>
  );
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
      title="List of Subjects"
      service={getSubjects}
      columns={columns}
      responseFilter={data => data.subjects}
    />
  );
}
export function ListSubject({
  match: {
    params: { id = "" }
  }
}) {
  if (!id) return <div className="w3-panel w3-yellow">Id is missing!</div>;
  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Credits", key: "credits", dataIndex: "credits" },
    { title: "Teacher", key: "teacher", dataIndex: "teacher" }
  ];
  return (
    <ShowRecord
      id={id}
      service={getSubject}
      title="Subject info"
      fields={columns}
    />
  );
}
export function ListStudent({
  match: {
    params: { id = "" }
  }
}) {
  if (!id) return <div className="w3-panel w3-yellow">Id is missing!</div>;
  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    { title: "Name", key: "name", dataIndex: "name" },
    { title: "Age", key: "age", dataIndex: "age" },
    { title: "Email", key: "email", dataIndex: "email" }
  ];
  return (
    <ShowRecord
      id={id}
      service={getStudent}
      title="Student info"
      fields={columns}
    />
  );
}
