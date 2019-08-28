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
    { title: "Email", key: "email", dataIndex: "email" },
    {
      title: "Subject",
      key: "assign-subject",
      render: record => (
        <Link to={`registrations/create?studentId=${record.id}`}>Assign</Link>
      )
    }
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
        alert("Error fetching subjects/classrooms.");
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
      alert("Error while saving.");
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
  let [registrations, setRegistrations] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let { registrations: data } = await getRegistrations();
        setRegistrations(data);
      } catch (err) {
        console.error("error while fetching registrations", err);
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const columns = [
    { title: "Id", key: "id", dataIndex: "id" },
    {
      title: "Student Id",
      key: "student",
      render: ({ student }) => (
        <Link className="w3-btn w3-border" to={`students/${student}`}>
          {student}
        </Link>
      )
    },
    {
      title: "Subject Id",
      key: "subject",
      render: ({ subject }) => (
        <Link className="w3-btn w3-border" to={`subjects/${subject}`}>
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
              let regs = registrations.filter(r => r.id !== rec.id);
              setRegistrations(regs);
              alert("Deleted.");
            } catch (e) {
              alert("Error in deleting.");
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
      data={registrations}
      columns={columns}
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
  let {
    location: { search = "" }
  } = props;
  let qStudent = "";
  let qSubject = "";
  if (search) {
    let a = search.split("?");
    let b = a.length === 1 ? a[0] : a[1];
    let query = {};
    b.split("&")
      .map(c => c.split("="))
      .forEach(([key, value]) => {
        query[key] = value;
      });
    qStudent = query.studentId || "";
    qSubject = query.subjectId || "";
  }
  if (loading) return <Loading />;
  let studentOpts = students.map(({ id, name, age, email }) => ({
    key: id,
    value: id,
    title: `${name} | ${age} yrs. | ${email}`
  }));
  let subjectOpts = subjects.map(({ id, credits, name, teacher }) => ({
    key: id,
    value: id,
    title: `${name} (credits: ${credits}) by ${teacher}`
  }));
  return (
    <Form
      onSubmit={values => {
        let payload = {};
        values.forEach(({ name, value }) => {
          payload[name] = value;
        });
        let studentId = qStudent || Number(payload.student);
        let subjectId = qSubject || Number(payload.subject);
        if (!studentId || !subjectId)
          throw new Error("Student or subject not selected.");
        return addRegistration(studentId, subjectId);
      }}
      title="Assign subjects to students"
    >
      <Select
        disabled={qStudent ? true : false}
        value={qStudent || ""}
        options={studentOpts}
        name="student"
        label="Select Student"
        size={10}
      />
      <Select
        disabled={qSubject ? true : false}
        value={qSubject || ""}
        options={subjectOpts}
        name="subject"
        label="Select Subject"
        size={5}
      />
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
    { title: "Teacher", key: "teacher", dataIndex: "teacher" },
    {
      title: "Students",
      key: "assign-student",
      render: record => (
        <Link to={`registrations/create?subjectId=${record.id}`}>Assign</Link>
      )
    }
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
  if (!id) return <div className="w3-panel w3-yellow">Id is missing.</div>;
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
  if (!id) return <div className="w3-panel w3-yellow">Id is missing.</div>;
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
